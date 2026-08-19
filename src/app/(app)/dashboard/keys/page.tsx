import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/app/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { getMe } from "@/lib/me";
import { formatDate } from "@/lib/format";

export const metadata = { title: "API keys", robots: { index: false } };

export default async function KeysPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const { data, error } = await controlPlane.GET("/auth/keys", {
    headers: authHeader(token!),
  });
  const keys = data ?? [];
  const active = keys.filter((k) => k.active).length;

  return (
    <>
      <PageHeader
        title="API keys"
        description="Credentials for CI and integrations. Engine installs carry their own credential — these are not it."
        action={
          <div className="rounded-lg border border-hairline bg-paper px-3.5 py-2 text-right">
            <p className="font-tabular text-[15px] font-medium text-ink">
              {active}
            </p>
            <p className="text-[11.5px] text-ink-label">active</p>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
        {error ? (
          <EmptyState
            title="This list is not yours to read"
            body="Key administration belongs to owners and admins."
          />
        ) : keys.length === 0 ? (
          <EmptyState
            title="No keys yet"
            body="A key is named when it is created and its secret is shown once, never again."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Last used</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id} className={k.active ? "" : "opacity-60"}>
                    <TableCell className="text-[13.5px] font-medium text-ink">
                      {k.name}
                    </TableCell>
                    <TableCell className="font-mono text-[12.5px] text-ink-secondary">
                      {k.display}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[12.5px] ${
                          k.active ? "text-ink-secondary" : "text-ink-label"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full ${
                            k.active ? "bg-ok" : "bg-ink-label"
                          }`}
                        />
                        {k.active
                          ? "Active"
                          : `Revoked ${formatDate(k.revoked_at)}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink-secondary">
                      {k.last_used_at ? formatDate(k.last_used_at) : "Never"}
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink-secondary">
                      {formatDate(k.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Revoked keys stay listed on purpose — the control plane says why. */}
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-label">
        Revoked keys stay in this list. A key that disappears takes its audit
        trail with it, and when it was last used is exactly what an incident
        review needs.
      </p>
    </>
  );
}
