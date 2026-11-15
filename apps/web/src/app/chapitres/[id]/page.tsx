import { ACTIVITES } from "@education-togo/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilAriane } from "@/components/FilAriane";
import { Telechargement } from "@/components/Telechargement";
import { lireChapitre } from "@/lib/api";

export default async function ChapitrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapitre = await lireChapitre(id).catch(() => null);
  if (!chapitre) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <FilAriane
        liens={[
          { href: "/", label: "Accueil" },
          { href: `/niveaux/${chapitre.niveau.code}`, label: chapitre.niveau.libelle },
          {
            href: `/niveaux/${chapitre.niveau.code}/${chapitre.matiere.code}`,
            label: chapitre.matiere.nom,
          },
          { label: chapitre.titre },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">
        {chapitre.niveau.code} · chapitre {chapitre.ordre}
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{chapitre.titre}</h1>
      <p className="mt-8 text-lg leading-relaxed text-ink">{chapitre.resumeCours}</p>
      <ul className="mt-10 flex flex-wrap gap-2">
        {ACTIVITES.map((activite) => {
          if (activite.code === "trivia" || activite.code === "qcm" || activite.code === "exercices") {
            return (
              <li key={activite.code}>
                <Link
                  href={`/chapitres/${chapitre.id}/${activite.code}`}
                  className="inline-block rounded-full border border-green px-4 py-2 text-sm text-green"
                >
                  {activite.nom}
                </Link>
              </li>
            );
          }
          return (
            <li
              key={activite.code}
              className={`rounded-full px-4 py-2 text-sm ${
                activite.code === "resume"
                  ? "bg-green-deep text-card"
                  : "border border-line text-muted"
              }`}
            >
              {activite.nom}
              {activite.code === "resume" ? "" : " · bientôt"}
            </li>
          );
        })}
      </ul>
      <Telechargement chapitreId={chapitre.id} />
    </article>
  );
}
