type Props = {
  totalCamps: number;
  totalActive: number;
  totalCapacity: number;
};

const metricCardClass =
  "border border-[#d7d7d7] bg-[#f7f7f7] px-6 py-5 shadow-sm";

export default function CampStats({
  totalCamps,
  totalActive,
  totalCapacity,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className={metricCardClass}>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
          Total camps
        </p>
        <p className="mt-3 text-4xl font-bold text-[#111]">
          {totalCamps}
        </p>
      </div>

      <div className={metricCardClass}>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
          Active camps
        </p>
        <p className="mt-3 text-4xl font-bold text-[#f05a28]">
          {totalActive}
        </p>
      </div>

      <div className={metricCardClass}>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
          Total capacity
        </p>
        <p className="mt-3 text-4xl font-bold text-[#111]">
          {totalCapacity}
        </p>
      </div>
    </div>
  );
}