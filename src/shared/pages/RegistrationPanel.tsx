import { useEffect, useRef, type KeyboardEvent } from "react";
import {
  BrainCircuit,
  ImagePlus,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import {
  MAX_BIRTH_DATE,
  MIN_BIRTH_DATE,
  useRegistrationPanel,
} from "../hooks/useRegistrationPanel";

type RegistrationPanelProps = {
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[16px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const textAreaClass =
  "h-[115px] w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[16px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const aiTextAreaClass =
  "min-h-[160px] flex-1 resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[16px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

function FieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary"
    >
      {children}
      {required ? <span className="ml-1 text-status-critical">*</span> : null}
    </label>
  );
}

function sanitizeName(value: string) {
  return value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/g, "");
}

export function RegistrationPanel({
  onClose,
  onSuccess,
}: RegistrationPanelProps) {
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const dniRef = useRef<HTMLInputElement | null>(null);
  const sexRef = useRef<HTMLSelectElement | null>(null);
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const conditionsRef = useRef<HTMLTextAreaElement | null>(null);

  const backgroundRef = useRef<HTMLTextAreaElement | null>(null);
  const skillsRef = useRef<HTMLTextAreaElement | null>(null);
  const motivationRef = useRef<HTMLTextAreaElement | null>(null);

  const {
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

    isStepOneValid,
    isStepTwoValid,

    handleSelectImage,
    handleImageChange,
    handleBirthDateChange,
    handleGoToAssessment,
    handleSubmit,
 } = useRegistrationPanel({ onClose, onSuccess });

  useEffect(() => {
    if (step === "personal_data") {
      setTimeout(() => firstNameRef.current?.focus(), 0);
    }

    if (step === "ai_assessment") {
      setTimeout(() => backgroundRef.current?.focus(), 0);
    }
  }, [step]);

  const focusNextField = (
    event: KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    nextField?: HTMLElement | null,
  ) => {
    if (event.key !== "Enter") return;

    if (event.shiftKey && event.currentTarget.tagName === "TEXTAREA") return;

    event.preventDefault();
    nextField?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-7xl overflow-hidden border border-border-default bg-bg-primary shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="hidden w-80 shrink-0 flex-col border-r border-border-default bg-bg-secondary px-8 py-9 md:flex">
          <div className="mb-9 flex h-14 w-14 items-center justify-center bg-accent text-accent-fg">
            <UserRoundPlus className="h-7 w-7" strokeWidth={2.3} />
          </div>

          <h2 className="mb-10 text-[27px] font-bold uppercase leading-tight tracking-[0.11em] text-txt-primary">
            Staff
            <br />
            Registration
          </h2>

          <div className="flex flex-col gap-7">
            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === "personal_data"
                  ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              <UserRound
                className={`h-12 w-12 border bg-transparent p-2 ${
                  step === "personal_data"
                    ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                    : "border-border-strong text-txt-disabled"
                }`}
                strokeWidth={2.5}
              />

              <p className="text-[16px] font-bold leading-relaxed tracking-[0.07em]">
                Personal Data
              </p>
            </div>

            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === "ai_assessment"
                  ? "border-accent text-accent shadow-[0_8px_12px_-10px_rgba(232,93,4,0.95)]"
                  : "border-border-default text-txt-disabled"
              }`}
            >
              <BrainCircuit
                className={`h-12 w-12 border bg-transparent p-2 ${
                  step === "ai_assessment"
                    ? "border-accent text-accent shadow-[0_0_12px_rgba(232,93,4,0.7)]"
                    : "border-border-strong text-txt-disabled"
                }`}
                strokeWidth={2.5}
              />

              <p className="text-[16px] font-bold leading-relaxed tracking-[0.07em]">
                AI-Assisted Assessment
              </p>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-bg-primary">
          <div className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-6 py-5 md:px-10">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-txt-disabled">
                {step === "personal_data" ? "STEP 01" : "STEP 02"}
              </p>

              <h3 className="mt-1 text-[30px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                {step === "personal_data" ? "Personal Data" : "AI Assistance"}
              </h3>

              <p className="mt-2 text-[12px] font-bold tracking-[0.05em] text-txt-secondary">
                <span className="text-status-critical">*</span> Required fields
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close registration panel"
              title="Close registration panel"
              className="flex h-12 w-12 items-center justify-center border border-border-strong text-txt-primary transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10">
            {(errorMessage || successMessage) && (
              <div
                className={`mb-5 border px-4 py-3 text-[15px] font-bold tracking-[0.05em] ${
                  errorMessage
                    ? "border-status-critical bg-status-critical/10 text-status-critical"
                    : "border-status-ok bg-status-ok/10 text-status-ok"
                }`}
              >
                {errorMessage || successMessage}
              </div>
            )}

            {step === "personal_data" && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={handleSelectImage}
                  className="flex w-full items-center gap-5 border border-border-default bg-bg-secondary p-4 text-left transition-colors hover:border-accent hover:bg-bg-tertiary"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    aria-label="Person image"
                    title="Person image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {photo ? (
                    <img
                      src={photo}
                      alt="Selected person"
                      className="h-24 w-24 object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-dashed border-border-strong bg-bg-primary">
                      <ImagePlus className="h-10 w-10 text-txt-secondary" />
                    </div>
                  )}

                  <div>
                    <p className="text-[16px] font-bold uppercase tracking-[0.14em] text-txt-primary">
                      Person Image
                      <span className="ml-1 text-status-critical">*</span>
                    </p>

                    <p className="mt-1 text-[14px] font-bold tracking-[0.04em] text-txt-secondary">
                      Click to select an image for the staff profile.
                    </p>
                  </div>
                </button>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="firstName" required>
                      First Name
                    </FieldLabel>

                    <input
                      id="firstName"
                      aria-label="First name"
                      title="First name"
                      ref={firstNameRef}
                      type="text"
                      value={firstName}
                      maxLength={40}
                      onChange={(event) =>
                        setFirstName(sanitizeName(event.target.value))
                      }
                      onKeyDown={(event) =>
                        focusNextField(event, lastNameRef.current)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="lastName" required>
                      Last Name
                    </FieldLabel>

                    <input
                      id="lastName"
                      aria-label="Last name"
                      title="Last name"
                      ref={lastNameRef}
                      type="text"
                      value={lastName}
                      maxLength={60}
                      onChange={(event) =>
                        setLastName(sanitizeName(event.target.value))
                      }
                      onKeyDown={(event) => focusNextField(event, dniRef.current)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="dni" required>
                      ID
                    </FieldLabel>

                    <input
                      id="dni"
                      aria-label="ID"
                      title="ID"
                      ref={dniRef}
                      type="text"
                      value={dni}
                      maxLength={30}
                      onChange={(event) => setDni(event.target.value)}
                      onKeyDown={(event) => focusNextField(event, sexRef.current)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="sex" required>
                      Sex
                    </FieldLabel>

                    <select
                      id="sex"
                      aria-label="Sex"
                      title="Sex"
                      ref={sexRef}
                      value={sex}
                      onChange={(event) => setSex(event.target.value)}
                      onKeyDown={(event) =>
                        focusNextField(event, birthDateRef.current)
                      }
                      className={inputClass}
                    >
                      <option value="">Select sex</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="birthDate" required>
                    Birth Date
                  </FieldLabel>

                  <input
                    id="birthDate"
                    aria-label="Birth date"
                    title="Birth date"
                    ref={birthDateRef}
                    type="date"
                    value={birthDate}
                    min={MIN_BIRTH_DATE}
                    max={MAX_BIRTH_DATE}
                    onChange={handleBirthDateChange}
                    onKeyDown={(event) =>
                      focusNextField(event, descriptionRef.current)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="description" required>
                    Description
                  </FieldLabel>

                  <textarea
                    id="description"
                    aria-label="Description"
                    title="Description"
                    ref={descriptionRef}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    onKeyDown={(event) =>
                      focusNextField(event, conditionsRef.current)
                    }
                    placeholder="Describe the person profile, behavior, experience or relevant details..."
                    className={textAreaClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="conditions">Conditions</FieldLabel>

                  <textarea
                    id="conditions"
                    aria-label="Conditions"
                    title="Conditions"
                    ref={conditionsRef}
                    value={conditions}
                    onChange={(event) => setConditions(event.target.value)}
                    onKeyDown={(event) => focusNextField(event)}
                    placeholder="Example: Healthy, mild injury, food allergy, fever, bite..."
                    className={textAreaClass}
                  />
                </div>
              </div>
            )}

            {step === "ai_assessment" && (
              <div className="flex min-h-full flex-col">
                <div className="mb-5 border border-border-default bg-bg-secondary px-5 py-4">
                  <p className="text-[16px] font-bold uppercase tracking-[0.12em] text-txt-primary">
                    AI-Assisted Staff Evaluation
                  </p>

                  <p className="mt-2 text-[15px] font-bold leading-relaxed tracking-[0.04em] text-txt-secondary">
                    Complete the candidate profile information. The system will
                    use these details to support the assessment process.
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-5">
                  <div className="flex min-h-[175px] flex-col gap-2">
                    <FieldLabel htmlFor="background" required>
                      Background and History
                    </FieldLabel>

                    <textarea
                      id="background"
                      aria-label="Background and history"
                      title="Background and history"
                      ref={backgroundRef}
                      value={background}
                      onChange={(event) => setBackground(event.target.value)}
                      onKeyDown={(event) =>
                        focusNextField(event, skillsRef.current)
                      }
                      placeholder="Describe previous experience, personal background, relevant history or context..."
                      className={aiTextAreaClass}
                    />
                  </div>

                  <div className="flex min-h-[175px] flex-col gap-2">
                    <FieldLabel htmlFor="skills" required>
                      Specialized Skills
                    </FieldLabel>

                    <textarea
                      id="skills"
                      aria-label="Specialized skills"
                      title="Specialized skills"
                      ref={skillsRef}
                      value={skills}
                      onChange={(event) => setSkills(event.target.value)}
                      onKeyDown={(event) =>
                        focusNextField(event, motivationRef.current)
                      }
                      placeholder="Example: logistics, exploration, agriculture, medicine, leadership, communication..."
                      className={aiTextAreaClass}
                    />
                  </div>

                  <div className="flex min-h-[175px] flex-col gap-2">
                    <FieldLabel htmlFor="motivation" required>
                      Motivation for Joining
                    </FieldLabel>

                    <textarea
                      id="motivation"
                      aria-label="Motivation for joining"
                      title="Motivation for joining"
                      ref={motivationRef}
                      value={motivation}
                      onChange={(event) => setMotivation(event.target.value)}
                      onKeyDown={(event) => focusNextField(event)}
                      placeholder="Explain why this person wants to join the staff team..."
                      className={aiTextAreaClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-border-default bg-bg-secondary px-6 py-4 sm:flex-row sm:justify-end md:px-10">
            {step === "personal_data" ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-border-strong bg-bg-primary px-8 py-3 text-[15px] font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!isStepOneValid}
                  onClick={handleGoToAssessment}
                  className="border border-accent bg-accent px-8 py-3 text-[15px] font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-60"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep("personal_data")}
                  className="border border-border-strong bg-bg-primary px-8 py-3 text-[15px] font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={!isStepTwoValid || submitting}
                  onClick={handleSubmit}
                  className="border border-accent bg-accent px-8 py-3 text-[15px] font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}