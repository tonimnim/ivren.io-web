import * as Icons from "lucide-react";

type IconComponent = React.ComponentType<{ className?: string }>;

/** Resolve a lucide icon by the name the nav array declares. */
export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon =
    (Icons as unknown as Record<string, IconComponent>)[name] ?? Icons.Circle;
  return <Icon className={className} />;
}
