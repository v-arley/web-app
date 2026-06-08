import { Map } from "lucide-react";
import type { KeyboardEvent, ReactNode, Ref } from "react";

type CampSettingsForm = {
  campId: string;
  code: string;
  creationDate: string;
  designation: string;
  maxCapacity: string;
  latitude: string;
  longitude: string;
  state: "A" | "I";
  adminId: number | null;
};

type CampInformationPanelProps = {
  form: CampSettingsForm;
  loading: boolean;
  firstFieldRef: Ref<HTMLInputElement>;
  onFieldChange: (field: keyof CampSettingsForm, value: string) => void;
  onEnterToNextField: (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
};

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary"
    >
      {children}
      {required ? <span className="ml-1 text-accent">*</span> : null}
    </label>
  );
}

function FormField({
  id,
  label,
  value,
  type = "text",
  readOnly = false,
  required = false,
  placeholder,
  inputRef,
  onKeyDown,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  type?: string;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <input
        ref={inputRef}
        id={id}
        type={type}
        aria-label={label}
        title={label}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange?.(event.target.value)}
        className={[
          "h-12 w-full border border-border-default bg-bg-tertiary px-4",
          "font-mono text-[14px] font-bold uppercase tracking-[0.06em]",
          "text-txt-primary outline-none transition-colors",
          "placeholder:text-txt-disabled focus:border-accent",
          readOnly ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      />
    </div>
  );
}

export function CampInformationPanel({
  form,
  loading,
  firstFieldRef,
  onFieldChange,
  onEnterToNextField,
}: CampInformationPanelProps) {
  return (
    <section className="flex min-h-0 flex-col">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center border border-accent/50 bg-accent/10 text-accent">
          <Map size={20} />
        </div>

        <div>
          <h2 className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            Information
          </h2>

          <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
            Camp registry / base configuration
          </p>
        </div>
      </div>

      <div className="border border-border-default bg-bg-primary px-6 py-6">
        <div className="mb-6 border-b border-border-default pb-4">
          <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
            Camp Information
          </p>

          <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
            Register camp identity, capacity and location
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
            Loading camp settings...
          </div>
        ) : (
          <div className="space-y-5" data-enter-form>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                id="camp-id"
                label="Camp ID"
                value={form.campId}
                readOnly
              />

              <FormField
                id="camp-code"
                label="Code"
                value={form.code}
                onKeyDown={onEnterToNextField}
                onChange={(value) => onFieldChange("code", value.toUpperCase())}
              />

              <FormField
                id="creation-date"
                label="Creation Date"
                value={form.creationDate}
                readOnly
              />
            </div>

            <FormField
              id="camp-designation"
              label="Camp Designation"
              value={form.designation}
              required
              inputRef={firstFieldRef}
              onKeyDown={onEnterToNextField}
              placeholder="Example: CAMP ALPHA"
              onChange={(value) =>
                onFieldChange("designation", value.toUpperCase())
              }
            />

            <FormField
              id="max-capacity"
              label="Max Capacity"
              type="number"
              value={form.maxCapacity}
              required
              onKeyDown={onEnterToNextField}
              placeholder="Example: 250"
              onChange={(value) => onFieldChange("maxCapacity", value)}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                id="latitude"
                label="Latitude"
                value={form.latitude}
                onKeyDown={onEnterToNextField}
                placeholder="Example: -70.000"
                onChange={(value) => onFieldChange("latitude", value)}
              />

              <FormField
                id="longitude"
                label="Longitude"
                value={form.longitude}
                onKeyDown={onEnterToNextField}
                placeholder="Example: 10.000"
                onChange={(value) => onFieldChange("longitude", value)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}