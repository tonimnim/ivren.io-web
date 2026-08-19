import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/app/page-header";
import { RoleBadge } from "@/components/app/role-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { formatDate, initials } from "@/lib/format";

export const metadata = { title: "Users", robots: { index: false } };

export default async function UsersPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const { data, error } = await controlPlane.GET("/auth/users", {
    headers: authHeader(token!),
  });
  const users = data ?? [];
  const seatsLeft = Math.max(0, me.seats - me.seats_used);

  return (
    <>
      <PageHeader
        title="Users"
        description="Who may act on this organisation, and what each of them may do."
        action={
          <div className="rounded-lg border border-hairline bg-paper px-3.5 py-2 text-right">
            <p className="font-tabular text-[15px] font-medium text-ink">
              {me.seats_used}
              <span className="text-ink-label">/{me.seats}</span>
            </p>
            <p className="text-[11.5px] text-ink-label">
              {seatsLeft === 0 ? "no seats free" : `${seatsLeft} seats free`}
            </p>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
        {error ? (
          <EmptyState
            title="This list is not yours to read"
            body="Your role does not include user administration. An owner or admin can change that."
          />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users yet"
            body="Users are added by an owner or admin, one per seat."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-surface-2 text-[11px] font-medium text-ink-secondary">
                            {initials(u.display_name || u.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-medium text-ink">
                            {u.display_name || u.email}
                          </p>
                          {u.display_name && (
                            <p className="truncate text-[12.5px] text-ink-label">
                              {u.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink-secondary">
                      {formatDate(u.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
