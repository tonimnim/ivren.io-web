import { ReactNode } from "react";
import { Container } from "@/components/container";
import { DocsToc } from "@/components/docs-toc";
import { DocsSidebar, DocsMobileNav } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-12 md:py-16">
      <DocsMobileNav />
      <div className="flex gap-12">
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-56 shrink-0 overflow-y-auto md:block">
          <DocsSidebar />
        </aside>
        <div className="min-w-0 flex-1">
          <div data-docs-content className="prose-docs max-w-2xl">
            {children}
          </div>
        </div>
        <DocsToc />
      </div>
    </Container>
  );
}
