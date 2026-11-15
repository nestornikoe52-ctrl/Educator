import Link from "next/link";

export function FilAriane({
  liens,
}: {
  liens: { href?: string; label: string }[];
}) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
      {liens.map((lien, index) => (
        <span key={`${lien.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? <span aria-hidden>/</span> : null}
          {lien.href ? (
            <Link href={lien.href} className="text-green">
              {lien.label}
            </Link>
          ) : (
            <span className="text-ink">{lien.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
