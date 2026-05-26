import { X } from "lucide-react";
import { useRequestResourcesQuery } from "../hooks/useRequestResourcesQuery";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";

const resourceService = new ResourceService();

interface RequestDetailModalProps {
  requestId: number;
  onClose: () => void;
}

export function RequestDetailModal({ requestId, onClose }: RequestDetailModalProps) {
  const { data: resources = [], isLoading } = useRequestResourcesQuery(requestId);

  const { data: availableResources = [] } = useQuery({
    queryKey: ["resources-list"],
    queryFn: async () => {
      const res = await resourceService.findAll();
      return res.getResultado<any[]>("registros") ?? [];
    }
  });

  const getResourceName = (id: number) => {
    return availableResources.find((r: any) => r.id === id)?.name || `ID: ${id}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl border border-border-default shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-primary">
          <div>
            <h2 className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-[0.2em]">
              Detalle de Solicitud #{requestId}
            </h2>
            <p className="font-mono text-[9px] text-txt-secondary mt-1">Recursos solicitados para transferencia</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary border border-border-default transition-colors txt-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="h-10 w-10 border-4 border-accent/30 border-t-accent animate-spin" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary animate-pulse">Cargando recursos...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-bg-tertiary/20 border-2 border-dashed border-border-default">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary italic">
                No se encontraron recursos para esta solicitud
              </p>
            </div>
          ) : (
            <div className="bg-bg-tertiary border border-border-default overflow-hidden">
              <div className="bg-bg-primary border-b border-border-default px-4 py-3 grid grid-cols-[1fr_0.6fr] gap-4">
                <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest">RECURSO</div>
                <div className="font-mono text-[9px] font-bold text-txt-secondary uppercase tracking-widest text-center">CANTIDAD</div>
              </div>

              <div className="divide-y divide-border-default">
                {resources.map((item) => (
                  <div 
                    key={item.id} 
                    className="px-4 py-3 grid grid-cols-[1fr_0.6fr] gap-4 items-center hover:bg-bg-primary/30 transition-colors"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-txt-primary">{getResourceName(item.resource_id)}</span>
                    </div>
                    
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-accent/10 border border-accent/30 font-mono text-[10px] font-bold text-accent">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-bg-primary border-t border-border-default flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-bg-secondary border border-border-default font-mono text-[10px] font-bold text-txt-primary uppercase tracking-widest hover:bg-bg-tertiary transition-all"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
}
