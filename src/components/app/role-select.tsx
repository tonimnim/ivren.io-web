"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The roles offered today. The control plane holds the closed set (six roles)
 * and refuses anything outside it; the rest arrive with the features they
 * serve. Ownership is not on this menu — it is handed over, not picked.
 */
const OFFERED = [
  { value: "admin", label: "Admin" },
  { value: "engineer", label: "Engineer" },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * A role picker with an explicit Save. Changing the selection alone does
 * nothing: on Windows the arrow keys change a closed select and fire its
 * change event, and a promotion to admin should never be one stray keystroke.
 */
export function RoleSelect({
  userId,
  role,
  name,
}: {
  userId: string;
  role: string;
  name: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(role);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A current role outside the offered set is shown, never offered back.
  const options = OFFERED.some((o) => o.value === role)
    ? OFFERED
    : [{ value: role, label: cap(role) }, ...OFFERED];

  async function save() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/auth/users/${encodeURIComponent(userId)}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: draft }),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "That didn't go through. The role is unchanged.");
        setDraft(role);
        return;
      }
      router.refresh();
    } catch {
      setError("We couldn't confirm the change. Refresh to see the current role.");
    } finally {
      setPending(false);
    }
  }

  const changed = draft !== role;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={`Role for ${name}`}
          value={draft}
          disabled={pending}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          className="rounded-md border border-hairline bg-paper px-2 py-1 text-[12.5px] text-ink outline-none transition-colors hover:border-ink-label/50 focus:border-accent disabled:opacity-60"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {changed && (
          <>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-md bg-accent px-2.5 py-1 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(role)}
              disabled={pending}
              className="text-[12.5px] text-ink-label transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="max-w-[18rem] text-[12px] leading-snug text-flag">
          {error}
        </p>
      )}
    </div>
  );
}
