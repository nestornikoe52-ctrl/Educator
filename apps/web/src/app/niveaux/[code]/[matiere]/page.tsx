import { MATIERES, NIVEAUX } from "@education-togo/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilAriane } from "@/components/FilAriane";
import { listerChapitres } from "@/lib/api";

export default async function ChapitresPage({
  params,
}: {
  params: Promise<{ code: string; matiere: string }>;
}) {
  const { code, matiere: codeMatiere } = await params;
  const niveau = NIVEAUX.find((item) => item.code === code);
  const matiere = MATIERES.find((item) => item.code === codeMatiere);
  if (!niveau || !matiere) {
    notFound();
  }

  const chapitres = await listerChapitres(niveau.code, matiere.code);

  return (
    <section>
      <FilAriane
        liens={[
          { href: "/", label: "Accueil" },
          { href: `/niveaux/${niveau.code}`, label: niveau.libelle },
          { label: matiere.court },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">
        {niveau.code} · {matiere.court}
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">{matiere.nom}</h1>
      <ol className="mt-8 grid gap-3">
        {chapitres.map((chapitre) => (
          <li key={chapitre.id}>
            <Link
              href={`/chapitres/${chapitre.id}`}
              className="flex items-baseline gap-4 rounded-3xl border border-line bg-card px-5 py-4 shadow-card"
            >
              <span className="w-8 font-serif text-xl text-green">{chapitre.ordre}</span>
              <span className="text-lg text-ink">{chapitre.titre}</span>
            </Link>
          </li>
        ))}
      </ol>
      {chapitres.length === 0 ? (
        <p className="mt-8 text-muted">Aucun chapitre n’est encore disponible pour cette classe.</p>
      ) : null}
    </section>
  );
}
