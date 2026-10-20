import Link from "next/link";
import { requireUser } from "@/lib/auth";

// « Mes informations » (menu des réglages, 20/10/2026) : l'adresse du compte.
export default async function ComptePage() {
  const user = await requireUser();
  return (
    <section className="space-y-5">
      <Link href="/dashboard" className="text-xs text-eucal">
        ← Accueil
      </Link>
      <h1 className="font-display text-2xl font-semibold text-charcoal">
        Mes informations
      </h1>
      <dl className="space-y-3 rounded-[14px] border border-[#C8D8DC] p-4">
        <div>
          <dt className="text-xs text-neutral-500">Adresse e-mail</dt>
          <dd className="text-base text-neutral-900">{user.email}</dd>
        </div>
      </dl>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="min-h-[44px] text-sm text-eucal underline underline-offset-2"
        >
          Se déconnecter
        </button>
      </form>
    </section>
  );
}
