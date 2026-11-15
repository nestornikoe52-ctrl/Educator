import Link from "next/link";
import { AuthMenu } from "@/components/AuthMenu";

export function SiteHeader() {
  return (
    <header className="mb-10 flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green-deep text-sm font-semibold tracking-wide text-gold">
          ET
        </span>
        <span>
          <span className="block font-serif text-lg leading-none text-ink">Éducation Togo</span>
          <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-muted">
            Collège · APC
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/a-propos"
          className="rounded-full border border-line bg-card px-4 py-2 text-ink transition hover:border-green"
        >
          À propos
        </Link>
        <AuthMenu />
      </nav>
    </header>
  );
}
