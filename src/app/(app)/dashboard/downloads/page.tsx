import Link from "next/link";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Notice } from "@/components/app/notice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMe } from "@/lib/me";
import { company } from "@/lib/company";
import { artifactHref, artifacts, installerRequestHref } from "@/lib/releases";

export const metadata = { title: "Downloads", robots: { index: false } };

export default async function DownloadsPage() {
  const me = await getMe();
  if (!me) redirect("/login");

  const published = artifacts.some((a) => artifactHref(a.file) !== null);

  return (
    <>
      <PageHeader
        title="Downloads"
        description="The desktop app — console and engine in one — for every machine in this organisation."
      />

      <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>For</TableHead>
                <TableHead className="text-right">Version</TableHead>
                {published && <TableHead className="text-right" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {artifacts.map((a) => {
                const href = artifactHref(a.file);
                return (
                  <TableRow key={a.file}>
                    <TableCell>
                      <p className="text-[13.5px] font-medium text-ink">
                        {a.label}
                      </p>
                      <p className="font-mono text-[12px] text-ink-label">
                        {a.file}
                      </p>
                    </TableCell>
                    <TableCell className="text-[13px] text-ink-secondary">
                      {a.detail}
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink-secondary">
                      {company.version}
                    </TableCell>
                    {published && (
                      <TableCell className="text-right">
                        {href && (
                          <a
                            href={href}
                            className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-strong"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden />
                            Download
                          </a>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {!published && (
          <Notice title="Installers are sent on request">
            Signed builds aren&apos;t published for download yet. Ask and
            we&apos;ll send the installer for this version with its SHA-256
            checksum.{" "}
            <a
              href={installerRequestHref}
              className="text-accent hover:text-accent-strong"
            >
              Request the installer
            </a>
          </Notice>
        )}
        <Notice title="What changed">
          Every release is listed with what it changed.{" "}
          <Link href="/changelog" className="text-accent hover:text-accent-strong">
            Read the changelog
          </Link>
        </Notice>
      </div>
    </>
  );
}
