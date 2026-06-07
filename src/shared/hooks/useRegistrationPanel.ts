import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { PersonService } from "../../services/PersonService";
import { AdmissionRequestService } from "../../services/AdmissionRequestService";
import { AiPromptService } from "../../services/AiPromptService";
import { AdmissionEvaluationService } from "../../services/AdmissionEvaluationService";
import { getAuthContextFromToken } from "../utils/authAccess";

export type RegistrationStep = "personal_data" | "ai_assessment";

const personService = new PersonService();
const admissionRequestService = new AdmissionRequestService();
const aiPromptService = new AiPromptService();
const admissionEvaluationService = new AdmissionEvaluationService();

export const MIN_BIRTH_DATE = "1924-01-01";
export const MAX_BIRTH_DATE = new Date().toISOString().split("T")[0];

type UseRegistrationPanelParams = {
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

export function useRegistrationPanel({
  onClose,
  onSuccess,
}: UseRegistrationPanelParams) {
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
  const [conditions, setConditions] = useState("");

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
      setErrorMessage("Please select a valid image file.");
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
          setErrorMessage("The selected image could not be processed.");
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.55);

        setPhoto(compressedImage);
        setErrorMessage("");
      };

      img.onerror = () => {
        setErrorMessage("The selected image could not be loaded.");
      };

      img.src = String(reader.result);
    };

    reader.onerror = () => {
      setErrorMessage("The selected image could not be read.");
    };

    reader.readAsDataURL(file);
  };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBirthDate(value);

    if (value && (value < MIN_BIRTH_DATE || value > MAX_BIRTH_DATE)) {
      setErrorMessage("Birth date must be between 1924 and the current year.");
      return;
    }

    setErrorMessage("");
  };

  const handleGoToAssessment = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isBirthDateValid) {
      setErrorMessage("Birth date must be between 1924 and the current year.");
      return;
    }

    if (!isStepOneValid) {
      setErrorMessage("Complete all Personal Data fields before continuing.");
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
      `Name: ${firstName.trim()} ${lastName.trim()}`,
      `DNI: ${dni.trim()}`,
      `Sex: ${sex}`,
      `Birth date: ${birthDate}`,
      `Description: ${description.trim()}`,
      `Conditions: ${conditions.trim() || "No declared conditions"}`,
      "",
      `Background and history: ${background.trim()}`,
      `Specialized skills: ${skills.trim()}`,
      `Motivation for joining: ${motivation.trim()}`,
      "",
      "Return a JSON object with: apto, riesgo, razon, asignacion_recomendada.",
    ].join("\n");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!authContext.campId) {
      setErrorMessage("The current user's camp could not be identified.");
      return;
    }

    if (!isBirthDateValid) {
      setStep("personal_data");
      setErrorMessage("Birth date must be between 1924 and the current year.");
      return;
    }

    if (!isStepOneValid) {
      setStep("personal_data");
      setErrorMessage("Complete all Personal Data fields.");
      return;
    }

    if (!isStepTwoValid) {
      setErrorMessage("Complete all AI Assistance fields.");
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
        conditions: conditions.trim() || undefined,
        state: "A",
      });

      if (!personResp.getEstado()) {
        setErrorMessage(
          personResp.getMensaje() || "The person could not be created.",
        );
        return;
      }

      const createdPerson =
        personResp.getResultado<{ id?: number }>("registro");

      if (!createdPerson?.id) {
        setErrorMessage("The person was created, but no ID was received.");
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
            "The admission request could not be created.",
        );
        return;
      }

      const createdAdmissionRequest =
        admissionResp.getResultado<{ id?: number }>("registro");

      if (!createdAdmissionRequest?.id) {
        setErrorMessage(
          "The admission request was created, but no ID was received.",
        );
        return;
      }

      const promptResp = await aiPromptService.save({
        admission_request_id: createdAdmissionRequest.id,
        prompt: buildPrompt(),
      });

      if (!promptResp.getEstado()) {
        setErrorMessage(
          promptResp.getMensaje() || "The AI prompt could not be created.",
        );
        return;
      }

      const evaluationResp = await admissionEvaluationService.evaluate(
        createdAdmissionRequest.id,
      );

      if (!evaluationResp.getEstado()) {
        setErrorMessage(
          evaluationResp.getMensaje() ||
            "The request was created, but the AI evaluation could not be executed.",
        );
        return;
      }

      setSuccessMessage("Person registered successfully.");

      window.setTimeout(() => {
        void onSuccess?.();
        onClose();
      }, 700);
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred while submitting the analysis.");
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
    conditions,
    setConditions,

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