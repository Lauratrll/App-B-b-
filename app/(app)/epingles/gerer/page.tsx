import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getContentById } from "@/lib/content";
import {
  getPins,
  PIN_QUOTAS,
  PINNABLE_MODULES,
  type PinnableModule,
} from "@/lib/pinned";
import { RemovePinButton } from "@/components/modules/remove-pin-button";

const MODULE_LABELS: Record<PinnableModule, string> = {
  guide: "🧭 Guide-moi !",
  coucher: "🌙 Préparer le coucher",
};

export default async function GererEpinglesPage({
  searchParams,
}: {
  searchParams: { pending?: string; module?: string; return?: string };
}) {
  const { profile } = await requireProfile();
  const moisActuel = getBabyMonth(new Date(profile.birthdate));

  const moduleParam = searchParams.module as PinnableModule | undefined;
  if (!moduleParam || !PINNABLE_MODULES.includes(moduleParam)) {
    return (
      <section className="space-y-5">
        <h1 className="text-2xl font-semibold">Gestion des épingles</h1>
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          Module invalide.
        </p>
        <Link href="/epingles" className="text-sm underline">
          Retour aux épingles
        </Link>
      </section>
    );
  }

  const pendingId = searchParams.pending;
  const returnUrl = searchParams.return ?? "/epingles";

  // Charge le contenu en attente pour l'afficher
  const pending = pendingId ? await getContentById(pendingId) : null;

  // Liste des épingles existantes du module
  const pins = (await getPins()).filter((p) => p.module === moduleParam);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          href={returnUrl}
          className="inline-flex items-center gap-1 text-xs text-neutral-500"
        >
          ← Annuler
        </Link>
        <h1 className="text-2xl font-semibold leading-tight">
          Limite d&apos;épingles atteinte
        </h1>
        <p className="text-sm text-neutral-600">
          Tu as déjà <strong>{pins.length}</strong> épingle(s)
          {" "}{MODULE_LABELS[moduleParam]} (max {PIN_QUOTAS[moduleParam]}).
          Retire-en une pour épingler ce nouveau contenu.
        </p>
      </header>

      {pending ? (
        <section className="space-y-2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            En attente d&apos;être épinglé
          </p>
          <p className="text-sm font-medium text-amber-950">
            {String((pending.data as { titre?: string })?.titre ?? "Contenu")}
          </p>
          <p className="text-xs text-amber-800">
            Mois {pending.mois} · {MODULE_LABELS[pending.module as PinnableModule]}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Tes épingles actuelles {MODULE_LABELS[moduleParam]}
        </h2>
        <ul className="space-y-2">
          {pins.map((pin) => {
            const titre =
              ((pin.data as { titre?: string }).titre as string) ??
              pin.situation ??
              "Sans titre";
            const moisDepasse = pin.mois !== moisActuel;
            const confirmMsg = moisDepasse
              ? `Bébé a maintenant ${moisActuel} mois, ce contenu était pour le mois ${pin.mois}. Si tu le retires, tu perdras l'accès. Confirmer ?`
              : `Retirer "${titre}" des épingles et la remplacer par le nouveau ?`;

            return (
              <li
                key={pin.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {titre}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Mois {pin.mois}
                      {moisDepasse ? (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900">
                          bébé a {moisActuel} mois
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <RemovePinButton
                    pinId={pin.id}
                    confirmMessage={confirmMsg}
                    pendingContentId={pendingId}
                    returnUrl={returnUrl}
                    label="Remplacer"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
