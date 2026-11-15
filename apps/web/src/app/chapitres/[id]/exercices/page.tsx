import { notFound } from "next/navigation";
import { ExercicesJeu } from "@/components/ExercicesJeu";
import { FilAriane } from "@/components/FilAriane";
import { chapitreParId, chapitresDuCatalogue } from "@/lib/catalogue";

export function generateStaticParams() {
  return chapitresDuCatalogue().map((chapitre) => ({ id: chapitre.id }));
}

export default async function ExercicesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapitre = chapitreParId(id);
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
          { href: `/chapitres/${chapitre.id}`, label: chapitre.titre },
          { label: "Exercices" },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Exercices</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{chapitre.titre}</h1>
      <p className="mt-4 text-muted">
        Rédige ta réponse. La piste du chapitre s’affiche ensuite, et ta réponse est gardée pour le professeur.
      </p>
      <ExercicesJeu chapitreId={chapitre.id} />
    </article>
  );
}
