export type AdminTab = "rsvps" | "gifts";

export function AdminTabs({
  active,
  giftsEnabled,
  onChange,
}: {
  active: AdminTab;
  giftsEnabled: boolean;
  onChange: (tab: AdminTab) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        className={active === "rsvps" ? "invite-button-primary" : "invite-button-secondary"}
        onClick={() => onChange("rsvps")}
        type="button"
      >
        Confirmações
      </button>
      {giftsEnabled ? (
        <button
          className={active === "gifts" ? "invite-button-primary" : "invite-button-secondary"}
          onClick={() => onChange("gifts")}
          type="button"
        >
          Presentes
        </button>
      ) : null}
    </div>
  );
}
