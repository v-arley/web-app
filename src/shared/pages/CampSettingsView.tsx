import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

import {
  AlertTriangle,
  Map,
  Power,
  RotateCcw,
  Save,
  Search,
  Shield,
} from "lucide-react";

import { ModalSearchPerson } from "./ModalSearchPerson";
import { CampService } from "../../services/CampService";
import { useNavigation } from "../app/NavigationContext";
import { useToast } from "../hooks/useToast";
import type { Camp, UpdateCamp } from "../../models/Camp";
import type { Person } from "../../models/Person";
import { CampInformationPanel } from "../components/CampComponents/CampInformationPanel";
import { CampAdminControlPanel } from "../components/CampComponents/CampAdminControlPanel";

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

export function CampSettingsView() {
  const { toast } = useToast();
  const { authContext } = useNavigation();

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

  const loadCamp = useCallback(async () => {
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
          getList<Camp>(response).find(
            (item: any) => Number(item.id) === campId,
          ) ?? null;
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
  }, [authContext.campId]);

  useEffect(() => {
    void loadCamp();
  }, [loadCamp]);

  const handleEnterToNextField = (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const formContainer = event.currentTarget.closest("[data-enter-form]");

    if (!formContainer) return;

    const fields = Array.from(
      formContainer.querySelectorAll<
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | HTMLButtonElement
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
      adminId:
        Number.isFinite(personId) && personId > 0
          ? personId
          : current.adminId,
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
        const message =
          response.getMensaje() || "No se pudo actualizar el campamento.";
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
          <CampInformationPanel
            form={form}
            loading={loading}
            firstFieldRef={firstFieldRef}
            onFieldChange={handleFieldChange}
            onEnterToNextField={handleEnterToNextField}
          />

          <CampAdminControlPanel
            form={form}
            selectedAdmin={selectedAdmin}
            nodeOnline={nodeOnline}
            onOpenAdminSearch={() => setIsSearchOpen(true)}
            onToggleNode={handleToggleNode}
          />
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
