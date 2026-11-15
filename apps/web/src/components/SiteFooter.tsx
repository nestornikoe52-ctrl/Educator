import { CREATEUR } from "@education-togo/shared";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
      <p>
        {CREATEUR.nom} · {CREATEUR.titre}
      </p>
    </footer>
  );
}
