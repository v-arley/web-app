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
  "h-[50px] w-full rounded-none border border-[#CCCCCC] bg-[#E6E6E6] px-3 font-semibold text-[#999999] transition-shadow focus:border-[#FFA366] focus:shadow-[0_0_0_3px_rgba(255,163,102,0.45)] focus:outline-none";

const textAreaClass =
  "h-[100px] w-full rounded-none border border-[#CCCCCC] bg-[#E6E6E6] px-3 py-2 font-semibold text-[#999999] transition-shadow focus:border-[#FFA366] focus:shadow-[0_0_0_3px_rgba(255,163,102,0.45)] focus:outline-none";

export function RegistrationPanel({ onClose }: RegistrationPanelProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl flex-col overflow-y-auto rounded-2xl border border-[#3a3a3a] bg-[#f3f3f3] shadow-[0_30px_60px_rgba(0,0,0,0.45)] md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-[30px] bg-[#181818] p-7.5 md:w-72 md:shrink-0">
          <UserRoundPlus
            className="h-10 w-10 bg-[#FF6600] p-2 text-white"
            strokeWidth={2}
          />

          <h2>Staff Registration</h2>

          <div
            className={`flex items-center gap-3 border-b pb-2 text-[#666666] ${
              step === "personal_data"
                ? "border-[#FF6600] shadow-[0_8px_12px_-10px_rgba(255,102,0,0.95)]"
                : "border-[#666666]"
            }`}
          >
            <UserRound
              className={`h-[35px] w-[35px] rounded-md border bg-transparent p-1.5 ${
                step === "personal_data"
                  ? "border-[#FF6600] text-[#FF6600] shadow-[0_0_12px_rgba(255,102,0,0.8)]"
                  : "border-[#666666] text-[#666666]"
              }`}
              strokeWidth={2.5}
            />
            <p>Personal Data</p>
          </div>

          <div
            className={`flex items-center gap-3 border-b pb-2 text-[#666666] ${
              step === "ai_assessment"
                ? "border-[#FF6600] shadow-[0_8px_12px_-10px_rgba(255,102,0,0.95)]"
                : "border-[#666666]"
            }`}
          >
            <BrainCircuit
              className={`h-[35px] w-[35px] rounded-md border bg-transparent p-1.5 ${
                step === "ai_assessment"
                  ? "border-[#FF6600] text-[#FF6600] shadow-[0_0_12px_rgba(255,102,0,0.8)]"
                  : "border-[#666666] text-[#666666]"
              }`}
              strokeWidth={2.5}
            />
            <p>AI-Assisted Assessment</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-[0.25em] text-[#6b6b6b]">
                {step === "personal_data" ? "STEP 01" : "STEP 02"}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-black">
                {step === "personal_data" ? "Personal Data" : "AI Assistance"}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-black px-3 py-2 text-sm font-medium text-black transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black sm:w-auto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {(errorMessage || successMessage) && (
            <div
              className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                errorMessage
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-green-400 bg-green-50 text-green-700"
              }`}
            >
              {errorMessage || successMessage}
            </div>
          )}

          {step === "personal_data" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleSelectImage}
                  className="flex w-full items-center gap-[40px] rounded-none border-b border-[#CCCCCC] p-4 text-left shadow-[0_4px_8px_-6px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#e9e9e9]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div className="relative">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Selected person"
                        className="h-[100px] w-[100px] rounded-xl object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-xl border border-dashed border-[#999999] bg-[#E6E6E6]">
                        <ImagePlus className="h-8 w-8 text-[#808080]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-[#808080]">PERSON IMAGE</p>
                    <p className="mt-1 text-xs text-[#999999]">
                      Click to select image
                    </p>
                  </div>
                </button>

                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                  <div className="flex flex-col gap-[10px]">
                    <label className="text-[#808080]">FIRST NAME</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="text-[#808080]">LAST NAME</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="text-[#808080]">ID</label>
                    <input
                      type="text"
                      value={dni}
                      onChange={(event) => setDni(event.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="text-[#808080]">SEX</label>
                    <select
                      value={sex}
                      onChange={(event) => setSex(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select sex</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                  <label className="text-[#808080]">BIRTH DATE</label>
                  <input
                    type="date"
                    value={birthDate}
                    min={MIN_BIRTH_DATE}
                    max={MAX_BIRTH_DATE}
                    onChange={handleBirthDateChange}
                    className={inputClass}
                  />
                  <p className="text-xs text-[#999999]">
                    Fecha permitida: 1924-01-01 hasta {MAX_BIRTH_DATE}
                  </p>
                </div>

                <div>
                  <label className="text-[#808080]">DESCRIPTION</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className={textAreaClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleGoToAssessment}
                  disabled={!isStepOneValid}
                  className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:bg-[#999999] disabled:text-[#E6E6E6] sm:w-auto"
                >
                  Continue to AI-Assisted Assessment
                </button>
              </div>
            </div>
          )}

          {step === "ai_assessment" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[15px]">
                  <label className="text-[#808080]">
                    Background and history
                  </label>
                  <textarea
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className={textAreaClass}
                  />
                </div>

                <div className="flex flex-col gap-[15px]">
                  <label className="text-[#808080]">Specialized skills</label>
                  <textarea
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                    className={textAreaClass}
                  />
                </div>

                <div className="flex flex-col gap-[15px]">
                  <label className="text-[#808080]">
                    Motivation for joining
                  </label>
                  <textarea
                    value={motivation}
                    onChange={(event) => setMotivation(event.target.value)}
                    className={textAreaClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep("personal_data")}
                  disabled={submitting}
                  className="w-full rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:border-[#999999] disabled:text-[#999999] sm:w-auto"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepTwoValid || submitting}
                  className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#FF6600] hover:text-black disabled:cursor-not-allowed disabled:bg-[#999999] disabled:text-[#E6E6E6] sm:w-auto"
                >
                  {submitting ? "Submitting..." : "Submit for analysis"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}