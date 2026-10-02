import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  center?: boolean;
};

export default function SectionHeading({ eyebrow, title, description, link, center }: Props) {
  return (
    <div className={`mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${center ? "items-center text-center sm:flex-col sm:items-center" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="heading mt-2">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>}
      </div>
      {link && (
        <Link href={link.href} className="shrink-0 text-sm underline underline-offset-4 hover:text-gold">
          {link.label}
        </Link>
      )}
    </div>
  );
}
