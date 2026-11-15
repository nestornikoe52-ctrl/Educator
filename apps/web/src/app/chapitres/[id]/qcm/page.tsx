import { notFound } from "next/navigation";
import { FilAriane } from "@/components/FilAriane";
import { QcmJeu } from "@/components/QcmJeu";
import { chapitreParId, chapitresDuCatalogue } from "@/lib/catalogue";

export function generateStaticParams() {
  return chapitresDuCatalogue().map((chapitre) => ({ id: chapitre.id }));
}

export default async function QcmPage({
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
          { label: "QCM" },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">QCM</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{chapitre.titre}</h1>
      <p className="mt-4 text-muted">Sans chronomètre. La correction s’affiche dès que tu choisis.</p>
      <QcmJeu chapitreId={chapitre.id} />
    </article>
  );
}
