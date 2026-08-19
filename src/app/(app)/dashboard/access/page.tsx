import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/app/page-header";
import { VerdictBadge } from "@/components/app/verdict-badge";
import { RoleBadge } from "@/components/app/role-badge";
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
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Access log", robots: { index: false } };

export default async function AccessPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const { data, error } = await controlPlane.GET("/auth/access/events", {
    headers: authHeader(token!),
  });
  const events = data?.events ?? [];

  return (
    <>
      <PageHeader
        title="Access log"
        description="Refusals and role changes on this organisation, newest first."
        action={
          <div className="rounded-lg border border-hairline bg-paper px-3.5 py-2 text-right">
            <p className="font-tabular text-[15px] font-medium text-ink">
              {(data?.count ?? 0).toLocaleString("en-US")}
            </p>
            <p className="text-[11.5px] text-ink-label">recorded</p>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
        {error ? (
          <EmptyState
            title="This log is not yours to read"
            body="The access log is read by auditors and by administrative roles."
          />
        ) : events.length === 0 ? (
          <EmptyState
            title="Nothing refused yet"
            body="An empty log means no request has been turned down and no role has changed."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Credential</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wanted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-tabular whitespace-nowrap text-[13px] text-ink-secondary">
                      {formatDateTime(e.created_at)}
                    </TableCell>
                    <TableCell>
                      <VerdictBadge verdict={e.verdict} />
                    </TableCell>
                    <TableCell className="font-mono text-[12.5px] text-ink-secondary">
                      {e.credential}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={e.role} />
                    </TableCell>
                    <TableCell className="min-w-0">
                      <p className="text-[13px] text-ink">{e.permission}</p>
                      <p className="truncate font-mono text-[12px] text-ink-label">
                        {e.path}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-label">
        Scoped to {me.name} by the credential you signed in with. This endpoint
        has no input through which another organisation could be asked for.
      </p>
    </>
  );
}
