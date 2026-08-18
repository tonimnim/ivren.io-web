/**
 * Auth screens render bare — no header, subscribe band, or footer. The
 * only job of these pages is the form, so nothing else competes with it.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main id="main">{children}</main>;
}
