import type { Ref } from "react";
import type { AdmissionRequest } from "../../../models/AdmissionRequest";
import type { Profession } from "../../../models/Profession";
import type { Role } from "../../../models/Role";

type AdmissionApprovalStepContentProps = {
  step: 1 | 2;
  admission: AdmissionRequest;
  personLabel?: string;
  recommendedProfession: string;
  roles: Role[];
  professions: Profession[];
  roleId: string;
  professionId: string;
  username: string;
  password: string;
  confirmPassword: string;
  loadingCatalogs: boolean;
  isSubmitting: boolean;
  roleSelectRef: Ref<HTMLSelectElement>;
  usernameRef: Ref<HTMLInputElement>;
  getRoleLabel: (role: Role) => string;
  getProfessionLabel: (profession: Profession) => string;
  onRoleChange: (value: string) => void;
  onProfessionChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

const inputClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all placeholder:text-txt-disabled focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

const selectClass =
  "h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[15px] font-bold tracking-[0.04em] text-txt-primary outline-none transition-all focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]";

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-bold uppercase tracking-[0.13em] text-txt-primary"
    >
      {children}
      {required ? <span className="ml-1 text-status-critical">*</span> : null}
    </label>
  );
}

export function AdmissionApprovalStepContent({
  step,
  admission,
  personLabel,
  recommendedProfession,
  roles,
  professions,
  roleId,
  professionId,
  username,
  password,
  confirmPassword,
  loadingCatalogs,
  isSubmitting,
  roleSelectRef,
  usernameRef,
  getRoleLabel,
  getProfessionLabel,
  onRoleChange,
  onProfessionChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: AdmissionApprovalStepContentProps) {
  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border-default bg-bg-secondary px-4 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
              Person
            </p>

            <p className="mt-2 text-[17px] font-bold tracking-[0.04em] text-txt-primary">
              {personLabel ?? `Person #${admission.person_id}`}
            </p>
          </div>

          <div className="border border-accent/50 bg-accent/10 px-4 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-accent">
              Suggested Profession
            </p>

            <p className="mt-2 text-[17px] font-bold uppercase tracking-[0.04em] text-txt-primary">
              {recommendedProfession || "Not suggested"}
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="approvalRole" required>
              System Role
            </FieldLabel>

            <select
              id="approvalRole"
              ref={roleSelectRef}
              aria-label="System role"
              title="System role"
              value={roleId}
              onChange={(event) => onRoleChange(event.target.value)}
              disabled={loadingCatalogs || isSubmitting}
              className={selectClass}
            >
              {roles.length === 0 ? (
                <option value="">No operational roles available</option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {getRoleLabel(role)}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="approvalProfession" required>
              Camp Profession
            </FieldLabel>

            <select
              id="approvalProfession"
              aria-label="Camp profession"
              title="Camp profession"
              value={professionId}
              onChange={(event) => onProfessionChange(event.target.value)}
              disabled={loadingCatalogs || isSubmitting}
              className={selectClass}
            >
              {professions.length === 0 ? (
                <option value="">No professions available</option>
              ) : (
                professions.map((profession) => (
                  <option key={profession.id} value={profession.id}>
                    {getProfessionLabel(profession)}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="approvalUsername" required>
            Username
          </FieldLabel>

          <input
            id="approvalUsername"
            ref={usernameRef}
            aria-label="Username"
            title="Username"
            type="text"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="approvalPassword" required>
              Password
            </FieldLabel>

            <input
              id="approvalPassword"
              aria-label="Password"
              title="Password"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="approvalConfirmPassword" required>
              Confirm Password
            </FieldLabel>

            <input
              id="approvalConfirmPassword"
              aria-label="Confirm password"
              title="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              placeholder="Repeat password"
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}