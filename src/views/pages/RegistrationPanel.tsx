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
} from "../../hooks/useRegistrationPanel";

type RegistrationPanelProps = {
  onClose: () => void;
};

const inputClass =
  "h-11 w-full rounded-lg border border-[#CFCFCF] bg-[#E8E8E8] px-4 text-sm font-semibold text-[#555555] transition-all placeholder:text-[#A0A0A0] focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)] focus:outline-none";

const textAreaClass =
  "h-[92px] w-full resize-none rounded-lg border border-[#CFCFCF] bg-[#E8E8E8] px-4 py-3 text-sm font-semibold text-[#555555] transition-all placeholder:text-[#A0A0A0] focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)] focus:outline-none";

const aiTextAreaClass =
  "min-h-[130px] flex-1 resize-none rounded-xl border border-[#CFCFCF] bg-[#E8E8E8] px-4 py-3 text-sm font-semibold text-[#555555] transition-all placeholder:text-[#A0A0A0] focus:border-[#FF6600] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,102,0,0.18)] focus:outline-none";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.16em] text-[#777777]";

export function RegistrationPanel({ onClose }: RegistrationPanelProps) {
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
  } = useRegistrationPanel({ onClose });

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
    nextField?: HTMLElement | null
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
        className="flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#3a3a3a] bg-[#F2F2F2] shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="hidden w-72 shrink-0 flex-col bg-[#181818] px-8 py-9 md:flex">
          <UserRoundPlus
            className="mb-9 h-12 w-12 bg-[#FF6600] p-3 text-white"
            strokeWidth={2}
          />

          <h2 className="mb-10 text-xl font-semibold text-black">
            Staff Registration
          </h2>

          <div className="flex flex-col gap-7">
            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === "personal_data"
                  ? "border-[#FF6600] text-[#FF6600] shadow-[0_8px_12px_-10px_rgba(255,102,0,0.95)]"
                  : "border-[#555555] text-[#777777]"
              }`}
            >
              <UserRound
                className={`h-10 w-10 rounded-lg border bg-transparent p-2 ${
                  step === "personal_data"
                    ? "border-[#FF6600] text-[#FF6600] shadow-[0_0_12px_rgba(255,102,0,0.7)]"
                    : "border-[#666666] text-[#666666]"
                }`}
                strokeWidth={2.5}
              />
              <p className="text-sm leading-relaxed">Personal Data</p>
            </div>

            <div
              className={`flex items-center gap-4 border-b pb-4 transition-all ${
                step === "ai_assessment"
                  ? "border-[#FF6600] text-[#FF6600] shadow-[0_8px_12px_-10px_rgba(255,102,0,0.95)]"
                  : "border-[#555555] text-[#777777]"
              }`}
            >
              <BrainCircuit
                className={`h-10 w-10 rounded-lg border bg-transparent p-2 ${
                  step === "ai_assessment"
                    ? "border-[#FF6600] text-[#FF6600] shadow-[0_0_12px_rgba(255,102,0,0.7)]"
                    : "border-[#666666] text-[#666666]"
                }`}
                strokeWidth={2.5}
              />
              <p className="text-sm leading-relaxed">AI-Assisted Assessment</p>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-[#F2F2F2]">
          <div className="flex shrink-0 items-center justify-between border-b border-[#D7D7D7] px-6 py-5 md:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b6b6b]">
                {step === "personal_data" ? "STEP 01" : "STEP 02"}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-black">
                {step === "personal_data" ? "Personal Data" : "AI Assistance"}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-black text-black transition-colors hover:border-[#FF6600] hover:bg-[#FF6600]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10">
            {(errorMessage || successMessage) && (
              <div
                className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                  errorMessage
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-green-400 bg-green-50 text-green-700"
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
                  className="flex w-full items-center gap-5 rounded-xl border border-[#D0D0D0] bg-[#EEEEEE] p-4 text-left transition-colors hover:border-[#FF6600] hover:bg-white"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {photo ? (
                    <img
                      src={photo}
                      alt="Selected person"
                      className="h-20 w-20 rounded-xl object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#999999] bg-[#E1E1E1]">
                      <ImagePlus className="h-8 w-8 text-[#808080]" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#777777]">
                      Person Image
                    </p>
                    <p className="mt-1 text-xs text-[#999999]">
                      Click to select an image
                    </p>
                  </div>
                </button>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>First Name</label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      onKeyDown={(event) =>
                        focusNextField(event, lastNameRef.current)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Last Name</label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      onKeyDown={(event) => focusNextField(event, dniRef.current)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>ID</label>
                    <input
                      ref={dniRef}
                      type="text"
                      value={dni}
                      onChange={(event) => setDni(event.target.value)}
                      onKeyDown={(event) => focusNextField(event, sexRef.current)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Sex</label>
                    <select
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
                  <label className={labelClass}>Birth Date</label>
                  <input
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
                  <p className="text-xs text-[#8A8A8A]">
                    Allowed date: 1924-01-01 to {MAX_BIRTH_DATE}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    onKeyDown={(event) =>
                      focusNextField(event, conditionsRef.current)
                    }
                    className={textAreaClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Conditions</label>
                  <textarea
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
                <div className="mb-5 rounded-2xl border border-[#D7D7D7] bg-white/50 px-5 py-4">
                  <p className="text-sm font-semibold text-black">
                    AI-Assisted Staff Evaluation
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#777777]">
                    Complete the candidate profile information. The system will
                    use these details to support the assessment process.
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-5">
                  <div className="flex min-h-[150px] flex-col gap-2">
                    <label className={labelClass}>Background and History</label>
                    <textarea
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

                  <div className="flex min-h-[150px] flex-col gap-2">
                    <label className={labelClass}>Specialized Skills</label>
                    <textarea
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

                  <div className="flex min-h-[150px] flex-col gap-2">
                    <label className={labelClass}>Motivation for Joining</label>
                    <textarea
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

          <div className="flex shrink-0 flex-col gap-3 border-t border-[#D7D7D7] bg-[#F2F2F2] px-6 py-4 sm:flex-row sm:justify-end md:px-10">
            {step === "personal_data" ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-black bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-[#FF6600] hover:bg-[#FF6600]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!isStepOneValid}
                  onClick={handleGoToAssessment}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep("personal_data")}
                  className="rounded-xl border border-black bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-[#FF6600] hover:bg-[#FF6600]"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={!isStepTwoValid || submitting}
                  onClick={handleSubmit}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
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