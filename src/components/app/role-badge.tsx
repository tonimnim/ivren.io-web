const ROLE_COPY: Record<string, string> = {
  owner: "Everything, including billing",
  admin: "Users, keys and licensing",
  operator: "Runs the engine, cannot change access",
  auditor: "Reads the evidence, changes nothing",
  viewer: "Reads, changes nothing",
};

/**
 * Role is text, never colour alone — the tone here is a grey chip because
 * a role is a fact, not a status.
 */
export function RoleBadge({ role }: { role: string | null | undefined }) {
  if (!role) return <span className="text-ink-label">—</span>;
  return (
    <span
      title={ROLE_COPY[role.toLowerCase()] ?? undefined}
      className="inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-0.5 text-[12px] font-medium text-ink-secondary capitalize"
    >
      {role}
    </span>
  );
}
