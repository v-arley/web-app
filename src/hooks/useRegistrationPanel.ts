import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { PersonService } from "../services/PersonService";
import { AdmissionRequestService } from "../services/AdmissionRequestService";
import { AiPromptService } from "../services/AiPromptService";
import { getAuthContextFromToken } from "../utils/authAccess";

export type RegistrationStep = "personal_data" | "ai_assessment";

const personService = new PersonService();
const admissionRequestService = new AdmissionRequestService();
const aiPromptService = new AiPromptService();

export const MIN_BIRTH_DATE = "1924-01-01";
export const MAX_BIRTH_DATE = new Date().toISOString().split("T")[0];

type UseRegistrationPanelParams = {
  onClose: () => void;
};

export function useRegistrationPanel({ onClose }: UseRegistrationPanelParams) {
  const authContext = getAuthContextFromToken();
  const [step, setStep] = useState<RegistrationStep>("personal_data");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photo, setPhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [description, setDescription] = useState("");

  const [background, setBackground] = useState("");
  const [skills, setSkills] = useState("");
  const [motivation, setMotivation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isBirthDateValid =
    birthDate.trim() !== "" &&
    birthDate >= MIN_BIRTH_DATE &&
    birthDate <= MAX_BIRTH_DATE;

  const isStepOneValid = useMemo(() => {
    return (
      photo.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      dni.trim() !== "" &&
      sex.trim() !== "" &&
      isBirthDateValid &&
      description.trim() !== ""
    );
  }, [
    photo,
    firstName,
    lastName,
    dni,
    sex,
    isBirthDateValid,
    description,
  ]);

  const isStepTwoValid = useMemo(() => {
    return (
      background.trim() !== "" &&
      skills.trim() !== "" &&
      motivation.trim() !== ""
    );
  }, [background, skills, motivation]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Debe seleccionar un archivo de imagen.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setErrorMessage("No se pudo procesar la imagen.");
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.55);

        setPhoto(compressedImage);
        setErrorMessage("");
      };

      img.onerror = () => {
        setErrorMessage("No se pudo cargar la imagen seleccionada.");
      };

      img.src = String(reader.result);
    };

    reader.onerror = () => {
      setErrorMessage("No se pudo leer la imagen seleccionada.");
    };

    reader.readAsDataURL(file);
  };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBirthDate(value);

    if (value && (value < MIN_BIRTH_DATE || value > MAX_BIRTH_DATE)) {
      setErrorMessage(
        "La fecha de nacimiento debe estar entre 1924 y el año actual.",
      );
      return;
    }

    setErrorMessage("");
  };

  const handleGoToAssessment = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isBirthDateValid) {
      setErrorMessage(
        "La fecha de nacimiento debe estar entre 1924 y el año actual.",
      );
      return;
    }

    if (!isStepOneValid) {
      setErrorMessage(
        "Complete todos los campos de Personal Data antes de continuar.",
      );
      return;
    }

    setStep("ai_assessment");
  };

  const buildObservations = () => {
    return [
      `Background and history: ${background.trim()}`,
      `Specialized skills: ${skills.trim()}`,
      `Motivation for joining: ${motivation.trim()}`,
    ].join("\n");
  };

  const buildPrompt = () => {
    return [
      "Evaluate the admission of this person according to the following information:",
      "",
      `Background and history: ${background.trim()}`,
      `Specialized skills: ${skills.trim()}`,
      `Motivation for joining: ${motivation.trim()}`,
    ].join("\n");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isBirthDateValid) {
      setStep("personal_data");
      setErrorMessage(
        "La fecha de nacimiento debe estar entre 1924 y el año actual.",
      );
      return;
    }

    if (!isStepOneValid) {
      setStep("personal_data");
      setErrorMessage("Complete todos los campos de Personal Data.");
      return;
    }

    if (!isStepTwoValid) {
      setErrorMessage("Complete todos los campos de AI Assistance.");
      return;
    }

    try {
      setSubmitting(true);

      const personResp = await personService.save({
        dni: dni.trim(),
        name: firstName.trim(),
        surname: lastName.trim(),
        date_of_birth: birthDate,
        sex,
        photo,
        description: description.trim(),
        state: "A",
      });

      if (!personResp.getEstado()) {
        setErrorMessage(
          personResp.getMensaje() || "No se pudo crear la persona.",
        );
        return;
      }

      const createdPerson =
        personResp.getResultado<{ id?: number }>("registro");

      if (!createdPerson?.id) {
        setErrorMessage("La persona fue creada, pero no se recibió el ID.");
        return;
      }

      if (authContext.campId == null) {
  setErrorMessage("No se pudo identificar el campamento del usuario.");
  return;
}

      const admissionResp = await admissionRequestService.save({
        person_id: createdPerson.id,
        camp_id: authContext.campId,
        observations: buildObservations(),
      });

      if (!admissionResp.getEstado()) {
        setErrorMessage(
          admissionResp.getMensaje() ||
            "No se pudo crear la solicitud de admisión.",
        );
        return;
      }

      const createdAdmissionRequest =
        admissionResp.getResultado<{ id?: number }>("registro");

      if (!createdAdmissionRequest?.id) {
        setErrorMessage("La solicitud fue creada, pero no se recibió el ID.");
        return;
      }

      const promptResp = await aiPromptService.save({
        admission_request_id: createdAdmissionRequest.id,
        prompt: buildPrompt(),
      });

      if (!promptResp.getEstado()) {
        setErrorMessage(
          promptResp.getMensaje() || "No se pudo crear el prompt de IA.",
        );
        return;
      }

      setSuccessMessage("Solicitud enviada para análisis correctamente.");

      window.setTimeout(() => {
        onClose();
      }, 900);
    } catch (error) {
      console.error(error);
      setErrorMessage("Ocurrió un error inesperado al enviar el análisis.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    fileInputRef,

    photo,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    dni,
    setDni,
    sex,
    setSex,
    birthDate,
    description,
    setDescription,

    background,
    setBackground,
    skills,
    setSkills,
    motivation,
    setMotivation,

    errorMessage,
    successMessage,
    submitting,

    isBirthDateValid,
    isStepOneValid,
    isStepTwoValid,

    handleSelectImage,
    handleImageChange,
    handleBirthDateChange,
    handleGoToAssessment,
    handleSubmit,
  };
}