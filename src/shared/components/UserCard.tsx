import { Activity, BriefcaseBusiness, IdCard, Timer } from "lucide-react";

type UserCardProps = {
  name: string;
  lastName: string;
  role: string;
  id: string;
  active: boolean;
  profession?: string;
  temporaryProfession?: string | null;
  temporaryUntil?: string | null;
  imageUrl?: string;
};

function formatTemporaryDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
}

export function UserCard({
  name,
  lastName,
  role,
  id,
  active,
  profession,
  temporaryProfession,
  temporaryUntil,
  imageUrl,
}: UserCardProps) {
  const hasTemporaryProfession = Boolean(temporaryProfession?.trim());

  return (
    <article
      className={`group overflow-hidden border bg-bg-secondary transition-colors ${
        active
          ? "border-border-default hover:border-accent"
          : "border-border-default opacity-70 hover:border-status-critical"
      }`}
    >
      <div className="relative h-[205px] overflow-hidden bg-bg-primary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} ${lastName}`}
            className={`h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03] ${
              active ? "opacity-85" : "grayscale opacity-55"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-primary">
            <IdCard className="h-14 w-14 text-txt-disabled" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/55 to-transparent" />

        <div
          className={`absolute right-4 top-4 flex items-center gap-2 border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] ${
            active
              ? "border-accent/50 bg-bg-primary/85 text-accent"
              : "border-status-critical/50 bg-bg-primary/85 text-status-critical"
          }`}
        >
          <Activity size={15} />
          {active ? "Active" : "Inactive"}
        </div>

        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-accent">
            {profession || "No profession"}
          </p>

          <h3 className="mt-2 text-[24px] font-bold uppercase leading-tight tracking-[0.14em] text-txt-primary">
            {name} {lastName}
          </h3>
        </div>
      </div>

      <div className="border-t border-border-default px-5 py-4">
        <div className="flex items-start gap-3">
          <BriefcaseBusiness size={18} className="mt-0.5 shrink-0 text-accent" />

          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
              Role assignment
            </p>

            <p className="mt-2 text-[15px] font-black uppercase tracking-[0.12em] text-txt-primary">
              {role || "No role"}
            </p>

            {hasTemporaryProfession ? (
              <div className="mt-3 border border-accent/40 bg-accent/10 px-3 py-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-accent">
                  <Timer size={12} />
                  Temporary profession
                </div>

                <p className="mt-1 text-[13px] font-black uppercase tracking-[0.12em] text-txt-primary">
                  {temporaryProfession}
                </p>

                {temporaryUntil ? (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-txt-secondary">
                    Until: {formatTemporaryDate(temporaryUntil)}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-border-default px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-txt-disabled">
              Identity
            </p>

            <p className="mt-2 truncate text-[15px] font-black uppercase tracking-[0.12em] text-txt-primary">
              {id || "N/A"}
            </p>
          </div>

          <IdCard
            size={24}
            className={active ? "shrink-0 text-accent" : "shrink-0 text-txt-disabled"}
          />
        </div>
      </div>
    </article>
  );
}