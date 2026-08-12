import { Container } from "@/components/container";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
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
  );
}
