import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Root not-found handles unmatched URLs anywhere, so it sits outside the
 * (site) group and brings its own chrome.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="flex min-h-[60vh] flex-col items-start justify-center py-20">
          <p className="font-mono text-sm text-ink-label">404</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink md:text-4xl">
            This page is not in the estate.
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Home</Button>
            <Button href="/download" variant="secondary">
              Download
            </Button>
            <Button href="/docs" variant="secondary">
              Docs
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
