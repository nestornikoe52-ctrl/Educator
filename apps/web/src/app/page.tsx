import { ACTIVITES, MATIERES, NIVEAUX, PARCOURS } from "@education-togo/shared";
import Link from "next/link";

const subjectTone: Record<(typeof MATIERES)[number]["code"], string> = {
  MATHEMATIQUES: "border-maths",
  PCT: "border-pct",
  SVT: "border-svt",
};

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-green">
          6e · 5e · 4e · 3e
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
          Le collège, chapitre par chapitre.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Résumés de cours, exercices, QCM et trivia pour réviser les Mathématiques,
          la PCT et la SVT selon l&apos;Approche Par Compétences du Togo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {MATIERES.map((matiere) => (
          <article
            key={matiere.code}
            className={`rounded-3xl border border-line border-l-4 bg-card p-5 shadow-card ${subjectTone[matiere.code]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {matiere.court}
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink">{matiere.nom}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{matiere.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-line bg-card p-6 shadow-card">
        <p className="text-sm text-muted">Choisis ton niveau pour ouvrir les matières, puis les chapitres.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {NIVEAUX.map((niveau) => (
            <Link
              key={niveau.code}
              href={`/niveaux/${niveau.code}`}
              className="rounded-full bg-paper px-4 py-2 text-sm text-ink transition hover:bg-green hover:text-card"
            >
              {niveau.libelle}
              <span className="ml-2 opacity-70">{niveau.code}</span>
            </Link>
          ))}
        </div>
        <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink">
          {PARCOURS.map((etape, index) => (
            <li key={etape} className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-green-deep text-xs text-card">
                {index + 1}
              </span>
              {etape}
              {index < PARCOURS.length - 1 ? <span className="text-line">/</span> : null}
            </li>
          ))}
        </ol>
        <ul className="mt-5 flex flex-wrap gap-2">
          {ACTIVITES.map((activite) => (
            <li
              key={activite.code}
              className="rounded-full border border-line px-3 py-1 text-sm text-muted"
            >
              {activite.nom}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
