import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { href?: string; label: string };

export default function PageHeader({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="border-b border-line bg-card">
      <div className="container-page py-10 sm:py-14">
        {crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} />}
        <h1 className="heading mt-3 sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
      </div>
    </div>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all = [{ href: "/", label: "Home" }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted">
      {all.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {c.href ? (
            <Link href={c.href} className="hover:text-ink">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
