import { MATIERES, NIVEAUX, type MatiereCode } from "@education-togo/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilAriane } from "@/components/FilAriane";

const bordure: Record<MatiereCode, string> = {
  MATHEMATIQUES: "border-maths",
  PCT: "border-pct",
  SVT: "border-svt",
};

export function generateStaticParams() {
  return NIVEAUX.map((niveau) => ({ code: niveau.code }));
}

export default async function NiveauPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const niveau = NIVEAUX.find((item) => item.code === code);
  if (!niveau) {
    notFound();
  }

  return (
    <section>
      <FilAriane liens={[{ href: "/", label: "Accueil" }, { label: niveau.libelle }]} />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">{niveau.code}</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">{niveau.libelle}</h1>
      <p className="mt-4 max-w-2xl text-muted">Choisis une matière pour voir les chapitres.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {MATIERES.map((matiere) => (
          <Link
            key={matiere.code}
            href={`/niveaux/${niveau.code}/${matiere.code}`}
            className={`rounded-3xl border border-line border-l-4 bg-card p-5 shadow-card ${bordure[matiere.code]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{matiere.court}</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">{matiere.nom}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{matiere.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
