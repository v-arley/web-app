import { useState } from "react";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCampRequestMutation } from "../hooks/useCampRequestMutation";
import { ResourceSelector } from "../components/ResourceSelector";
import { requestResourceService } from "../services/RequestResourceService";
import { CampService } from "../../../../services/CampService";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { Camp } from "../../../../models/Camp";

const campService = new CampService();

export function CreateRequestPage() {
  const authContext = getAuthContextFromToken();
  const originCampId = authContext.campId ?? 0;
  
  const [destinationCampId, setDestinationCampId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [resources, setResources] = useState<Array<{ resource_id: number; amount: number }>>([]);

  const { createRequest } = useCampRequestMutation();

  const { data: camps = [], isLoading: isLoadingCamps } = useQuery({
    queryKey: ["camps-list-for-requests"],
    queryFn: async () => {
      const res = await campService.findAllForRequests();
      return res.getResultado<Camp[]>("registros") ?? [];
    }
  });

  // Obtener nombre del campamento origen
  const originCampName = camps.find(c => c.id === originCampId)?.code ?? "Cargando...";
  
  // Campamentos disponibles como destino (excluye el origen)
  const availableDestinations = camps.filter(c => c.id !== originCampId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationCampId === 0) {
      alert("Debes seleccionar un campamento destino");
      return;
    }

    if (originCampId === destinationCampId) {
      alert("El campamento de origen y destino no pueden ser el mismo");
      return;
    }

    if (resources.length === 0) {
      alert("Debes seleccionar al menos un recurso");
      return;
    }

    try {
      const request = await createRequest.mutateAsync({
        origin_camp_id: originCampId,
        destination_camp_id: destinationCampId,
        request_type: 'R',
        status: 'P',
        origin_approval_status: 'P',
        destination_approval_status: 'P',
        description: description.trim() || null,
      });

      if (request.id) {
        await requestResourceService.createRequestResources(request.id, resources.map(r => ({
          resource_id: r.resource_id,
          amount: r.amount
        })));
        alert("Solicitud creada exitosamente");
        setDestinationCampId(0);
        setDescription("");
        setResources([]);
      }
    } catch (error) {
      alert(`Error al crear solicitud: ${error}`);
    }
  };

  return (
    <div className="rmm-scope flex h-full flex-col bg-bg-app gap-4">
      {/* <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
          Gestión Inter-Campamento / Crear Solicitud
        </div>
        
      </div> */}

      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* <div className="bg-status-info/10 border border-status-info/30 p-4 mb-6">
                <div className="font-mono text-[10px] font-bold text-status-info mb-2 uppercase tracking-widest">
                  NEW REQUEST
                </div>
                <div className="font-mono text-[9px] text-txt-secondary leading-relaxed">
                  Complete el formulario para solicitar recursos de otro campamento. La solicitud requiere aprobación del campamento destino y del campamento origen.
                </div>
              </div> */}
              <div className="flex flex-col gap-2 p-4">
                <div>
                  <label htmlFor="origin-camp" className="block font-mono text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                    MY CAMP ID
                  </label>
                  <input
                    id="origin-camp"
                    type="text"
                    value={originCampName}
                    disabled
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-default font-mono text-[11px] text-txt-disabled cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="destination-camp" className="block font-mono text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                    TARGET CAMP
                  </label>
                  {isLoadingCamps ? (
                    <div className="w-full px-3 py-2 bg-bg-tertiary border border-border-default font-mono text-[11px] text-txt-disabled flex items-center gap-2">
                      <div className="h-3 w-3 border-2 border-accent/30 border-t-accent animate-spin" />
                      LOADING CAMPS...
                    </div>
                  ) : (
                    <select
                      id="destination-camp"
                      value={destinationCampId}
                      onChange={(e) => setDestinationCampId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-bg-primary border border-border-default font-mono text-[11px] text-txt-primary focus:outline-none focus:border-accent"
                      required
                    >
                      <option value={0}>Seleccione destino...</option>
                      {availableDestinations.map(c => (
                        <option key={c.id ?? 0} value={c.id ?? 0}>{c.code}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {originCampId === destinationCampId && destinationCampId !== 0 && (
                <div className="p-4 font-mono text-[11px] uppercase tracking-widest bg-status-critical/10 border-status-critical/30 text-status-critical">
                  ERROR: El campamento origen y destino deben ser diferentes.
                </div>
              )}

              <div>
                <label htmlFor="description" className="block font-mono text-[10px] font-bold text-txt-secondary uppercase tracking-widest">
                  DESCRIPTION (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-3 bg-bg-primary border border-border-default font-mono text-[10px] text-txt-primary focus:outline-none focus:border-accent resize-none"
                  rows={3}
                  placeholder="Explique el motivo de esta solicitud..."
                />
              </div>

              <div className="p-4">
                <label className="block font-mono text-[10px] font-bold text-txt-secondary uppercase tracking-widest mb-4">
                  LIST OF RESOURCES TO REQUEST
                </label>
                <ResourceSelector resources={resources} onChange={setResources} />
              </div>

              <div className="flex justify-end pt-6 border-t border-border-default">
                <button
                  type="submit"
                  disabled={createRequest.isPending || destinationCampId === 0 || resources.length === 0 || originCampId === destinationCampId}
                  className="px-6 py-3 bg-accent/10 border border-accent/30 font-mono text-[10px] font-bold text-accent uppercase tracking-widest hover:bg-accent/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createRequest.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-accent/30 border-t-accent animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      SEND REQUEST
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
