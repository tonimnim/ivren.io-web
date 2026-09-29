import { company } from "@/lib/company";

/**
 * What a hospital downloads: the desktop app, which is the console and the
 * engine in one, built as a per-user installer and as an MSI for managed
 * deployment.
 *
 * Only builds that exist are listed. An operating system without a published
 * build is absent rather than marked "coming soon" — this page describes what
 * ships.
 */
export type Artifact = {
  file: string;
  label: string;
  detail: string;
};

export const artifacts: Artifact[] = [
  {
    file: `Ivren_${company.version}_x64-setup.exe`,
    label: "Windows installer",
    detail: "Installs for the signed-in user; no administrator rights",
  },
  {
    file: `Ivren_${company.version}_x64_en-US.msi`,
    label: "Windows MSI",
    detail: "For managed deployment across a fleet",
  },
];

/** A published artifact's URL, or null while no public build exists. */
export function artifactHref(file: string): string | null {
  // Widened: `company` is `as const`, so its empty string is a literal type.
  const base: string = company.downloadUrl;
  return base ? `${base.replace(/\/+$/, "")}/${file}` : null;
}

/** Where an installer is asked for while no public build URL exists. */
export const installerRequestHref = `mailto:${company.email}?subject=${encodeURIComponent(
  `Ivren ${company.version} installer request`,
)}`;
