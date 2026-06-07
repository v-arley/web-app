import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type Ref,} from "react";
import { AlertTriangle, Map, Power, RotateCcw, Save, Search, Shield } from "lucide-react";

import { ModalSearchPerson } from "./ModalSearchPerson";
import { CampService } from "../../services/CampService";
import { getAuthContextFromToken } from "../utils/authAccess";
import { useToast } from "../hooks/useToast";
import type { Camp, UpdateCamp } from "../../models/Camp";
import type { Person } from "../../models/Person";

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

const emptyForm: CampSettingsForm = {
  campId: "",
  code: "",
  creationDate: "",
  designation: "",
  maxCapacity: "",
  latitude: "",
  longitude: "",
  state: "A",
  adminId: null,
};

const campService = new CampService();

function getList<T>(response: any): T[] {
  const registros = response.getResultado?.("registros") as T[] | undefined;
  const items = response.getResultado?.("items") as T[] | undefined;
  const resultadoItems = response.getResultado?.("resultado")?.items as
    | T[]
    | undefined;

  return registros ?? items ?? resultadoItems ?? [];
}

function getItem<T>(response: any): T | null {
  const registro = response.getResultado?.("registro") as T | undefined;
  const item = response.getResultado?.("item") as T | undefined;
  const resultadoItem = response.getResultado?.("resultado")?.item as
    | T
    | undefined;

  return registro ?? item ?? resultadoItem ?? null;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toISOString().slice(0, 10);
}

function mapCampToForm(camp: Camp): CampSettingsForm {
  const raw = camp as any;

  return {
    campId: `CMP-${String(raw.id ?? "").padStart(3, "0")}`,
    code: String(raw.code ?? ""),
    creationDate: formatDate(raw.created_at ?? raw.createdAt),
    designation: String(raw.description ?? ""),
    maxCapacity: String(raw.capacity ?? ""),
    latitude: String(raw.location_x ?? raw.locationX ?? ""),
    longitude: String(raw.location_y ?? raw.locationY ?? ""),
    state: raw.state === "I" ? "I" : "A",
    adminId:
      raw.admin_id !== undefined && raw.admin_id !== null
        ? Number(raw.admin_id)
        : raw.adminId !== undefined && raw.adminId !== null
          ? Number(raw.adminId)
          : null,
  };
}

function getPersonDisplayName(person: Person | null, fallbackId: number | null) {
  if (!person) {
    return fallbackId ? `Administrator ID: ${fallbackId}` : "No administrator selected";
  }

  const raw = person as any;
  const name = raw.name ?? "";
  const surname = raw.surname ?? raw.lastName ?? "";

  return `${name} ${surname}`.trim() || `Administrator ID: ${fallbackId}`;
}

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

export function CampSettingsView() {
  const { toast } = useToast();
  const authContext = getAuthContextFromToken();

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [campDbId, setCampDbId] = useState<number | null>(null);
  const [form, setForm] = useState<CampSettingsForm>(emptyForm);
  const [selectedAdmin, setSelectedAdmin] = useState<Person | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastSync, setLastSync] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodeOnline = form.state === "A";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timeout);
  }, []);

  const loadCamp = async () => {
    try {
      setLoading(true);
      setError(null);

      const campId = Number(authContext.campId);

      if (!Number.isFinite(campId) || campId <= 0) {
        setError("No se pudo identificar el campamento del usuario.");
        return;
      }

      let camp: Camp | null = null;

      if (typeof (campService as any).findById === "function") {
        const response = await (campService as any).findById(campId);

        if (response.getEstado()) {
          camp = getItem<Camp>(response);
        }
      }

      if (!camp) {
        const response = await campService.findAll();

        if (!response.getEstado()) {
          setError(response.getMensaje() || "No se pudo cargar el campamento.");
          return;
        }

        camp =
          getList<Camp>(response).find((item: any) => Number(item.id) === campId) ??
          null;
      }

      if (!camp) {
        setError("No se encontró el campamento del usuario.");
        return;
      }

      setCampDbId(Number((camp as any).id));
      setForm(mapCampToForm(camp));
      setLastSync(new Date().toLocaleTimeString("en-US"));
    } catch {
      setError("No se pudo cargar la configuración del campamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCamp();
  }, []);

  const handleEnterToNextField = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const formContainer = event.currentTarget.closest("[data-enter-form]");

    if (!formContainer) return;

    const fields = Array.from(
      formContainer.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement
      >(
        "input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), select:not([disabled]), button:not([disabled])",
      ),
    ).filter((field) => field.offsetParent !== null);

    const currentIndex = fields.indexOf(event.currentTarget);

    if (currentIndex < 0) return;

    fields[currentIndex + 1]?.focus();
  };

  const handleFieldChange = (field: keyof CampSettingsForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSelectAdmin = (person: Person) => {
    const raw = person as any;
    const personId = Number(raw.id);

    setSelectedAdmin(person);
    setForm((current) => ({
      ...current,
      adminId: Number.isFinite(personId) && personId > 0 ? personId : current.adminId,
    }));
    setIsSearchOpen(false);

    toast({
      tone: "success",
      title: "Administrator selected",
      message: "Master administrator selected successfully.",
    });
  };

  const handleToggleNode = () => {
    setForm((current) => ({
      ...current,
      state: current.state === "A" ? "I" : "A",
    }));
  };

  const handleSave = async () => {
    if (!campDbId) {
      toast({
        tone: "error",
        title: "Validation error",
        message: "No camp was loaded.",
      });
      return;
    }

    const capacity = Number(form.maxCapacity);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!form.designation.trim()) {
      toast({
        tone: "error",
        title: "Validation error",
        message: "Camp designation is required.",
      });
      return;
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      toast({
        tone: "error",
        title: "Validation error",
        message: "Max capacity must be greater than zero.",
      });
      return;
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast({
        tone: "error",
        title: "Validation error",
        message: "Latitude and longitude must be valid numbers.",
      });
      return;
    }

    const payload: UpdateCamp = {
      code: form.code.trim().toUpperCase(),
      description: form.designation.trim().toUpperCase(),
      capacity,
      location_x: latitude,
      location_y: longitude,
      state: form.state,
      admin_id: form.adminId ?? undefined,
    } as UpdateCamp;

    try {
      setSaving(true);
      setError(null);

      const response = await campService.update(campDbId, payload);

      if (!response.getEstado()) {
        const message = response.getMensaje() || "No se pudo actualizar el campamento.";
        setError(message);

        toast({
          tone: "error",
          title: "Update failed",
          message,
        });

        return;
      }

      const updatedCamp = getItem<Camp>(response);

      if (updatedCamp) {
        setForm(mapCampToForm(updatedCamp));
      }

      setLastSync(new Date().toLocaleTimeString("en-US"));

      toast({
        tone: "success",
        title: "Settings saved",
        message: "Camp settings updated successfully.",
      });

      await loadCamp();
    } catch {
      const message = "No se pudo actualizar el campamento.";
      setError(message);

      toast({
        tone: "error",
        title: "Update failed",
        message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    void loadCamp();

    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border border-border-default bg-bg-app">
        {error ? (
          <div className="mx-8 mt-6 flex items-center gap-3 border border-status-critical/40 bg-status-critical/10 px-5 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-status-critical">
            <AlertTriangle size={17} />
            {error}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto px-8 py-7 xl:grid-cols-[1fr_1fr]">
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
                      readOnly={false}
                      onKeyDown={handleEnterToNextField}
                      onChange={(value) =>
                        handleFieldChange("code", value.toUpperCase())
                      }
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
                    onKeyDown={handleEnterToNextField}
                    placeholder="Example: CAMP ALPHA"
                    onChange={(value) =>
                      handleFieldChange("designation", value.toUpperCase())
                    }
                  />

                  <FormField
                    id="max-capacity"
                    label="Max Capacity"
                    type="number"
                    value={form.maxCapacity}
                    required
                    onKeyDown={handleEnterToNextField}
                    placeholder="Example: 250"
                    onChange={(value) => handleFieldChange("maxCapacity", value)}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      id="latitude"
                      label="Latitude"
                      value={form.latitude}
                      onKeyDown={handleEnterToNextField}
                      placeholder="Example: -70.000"
                      onChange={(value) => handleFieldChange("latitude", value)}
                    />

                    <FormField
                      id="longitude"
                      label="Longitude"
                      value={form.longitude}
                      onKeyDown={handleEnterToNextField}
                      placeholder="Example: 10.000"
                      onChange={(value) => handleFieldChange("longitude", value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-col">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-border-default bg-bg-tertiary text-txt-secondary">
                <Shield size={20} />
              </div>

              <div>
                <h2 className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                  Administrative Control
                </h2>

                <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                  Master administrator / node status
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="border border-border-default bg-bg-primary px-6 py-6">
                <div className="mb-6 border-b border-border-default pb-4">
                  <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    Master Administrator
                  </p>

                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                    Select the main user assigned to this camp
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                    Selected Administrator
                  </p>

                  <div className="flex h-12 border border-border-default bg-bg-tertiary">
                    <div className="flex min-w-0 flex-1 items-center px-4 font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                      <span className="truncate">
                        {getPersonDisplayName(selectedAdmin, form.adminId)}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Search administrator"
                      title="Search administrator"
                      onClick={() => setIsSearchOpen(true)}
                      className="flex w-14 items-center justify-center border-l border-border-default text-txt-secondary transition-colors hover:bg-accent hover:text-accent-fg"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-border-default bg-bg-primary px-6 py-6">
                <div className="mb-6 border-b border-border-default pb-4">
                  <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    System Node Status
                  </p>

                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                    Main connectivity toggle
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNode}
                  className={`flex w-full items-center justify-between border px-5 py-4 transition-colors ${
                    nodeOnline
                      ? "border-status-ok/40 bg-status-ok/10"
                      : "border-status-critical/40 bg-status-critical/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center ${
                        nodeOnline
                          ? "bg-status-ok/10 text-status-ok"
                          : "bg-status-critical/10 text-status-critical"
                      }`}
                    >
                      <Power size={20} />
                    </div>

                    <div className="text-left">
                      <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary">
                        {nodeOnline ? "Online" : "Offline"}
                      </p>

                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
                        {nodeOnline
                          ? "System node is active"
                          : "System node is disabled"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-8 w-16 items-center px-1 transition-colors ${
                      nodeOnline ? "bg-status-ok" : "bg-status-critical"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 bg-white shadow transition-transform ${
                        nodeOnline ? "translate-x-8" : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_180px] gap-4 border-t border-border-default bg-bg-primary px-8 py-5">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || loading}
            className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Settings"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={saving || loading}
            className="h-12 border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>

          <div className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border-default bg-transparent text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
            <RotateCcw size={14} />
            Last system sync: {lastSync || "Not synced yet"}
          </div>
        </div>
      </div>

      <ModalSearchPerson
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectAdmin}
      />
    </>
  );
}