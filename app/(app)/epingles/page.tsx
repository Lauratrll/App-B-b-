import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getPins, PIN_QUOTAS, type PinnedItem } from "@/lib/pinned";
import { RemovePinButton } from "@/components/modules/remove-pin-button";

export default async function EpinglesPage() {
  const { profile } = await requireProfile();
  const moisActuel = getBabyMonth(new Date(profile.birthdate));
  const pins = await getPins();

  const guides = pins.filter((p) => p.module === "guide");
  const couchers = pins.filter((p) => p.module === "coucher");

  // Grouper les guides par catégorie
  const guidesByCategorie = guides.reduce<Record<string, PinnedItem[]>>(
    (acc, p) => {
      const key = p.categorie ?? "_autre";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {},
  );

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>📌</p>
        <h1 className="text-2xl font-semibold">Mes épingles</h1>
        <p className="text-sm text-neutral-600">
          {couchers.length}/{PIN_QUOTAS.coucher} Coucher{" "}
          · {guides.length}/{PIN_QUOTAS.guide} Guide-moi !
        </p>
      </header>

      {pins.length === 0 ? (
        <p className="rounded-xl bg-neutral-50 p-5 text-sm text-neutral-700">
          Aucune épingle pour le moment. Tu peux épingler jusqu&apos;à{" "}
          {PIN_QUOTAS.coucher} rituels Coucher et{" "}
          {PIN_QUOTAS.guide} protocoles du Guide-moi ! pour les retrouver ici en un clic.
        </p>
      ) : null}

      {/* Section Coucher (en premier) */}
      {couchers.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            🌙 Préparer le coucher
          </h2>
          <ul className="space-y-2">
            {couchers.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                moisActuel={moisActuel}
                href={`/epingle/${pin.content_id}`}
                fallbackTitre={`Rituel du coucher du mois ${pin.mois}`}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {/* Section Guide-moi ! */}
      {guides.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            🧭 Guide-moi !
          </h2>
          {Object.entries(guidesByCategorie).map(([cat, items]) => (
            <div key={cat} className="space-y-2">
              <h3 className="text-xs font-medium text-neutral-600">
                {(cat.charAt(0).toUpperCase() + cat.slice(1)).replaceAll(
                  "_",
                  " ",
                )}
              </h3>
              <ul className="space-y-2">
                {items.map((pin) => (
                  <PinCard
                    key={pin.id}
                    pin={pin}
                    moisActuel={moisActuel}
                    href={`/epingle/${pin.content_id}`}
                  />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}
    </section>
  );
}

function PinCard({
  pin,
  moisActuel,
  href,
  fallbackTitre,
}: {
  pin: PinnedItem;
  moisActuel: number;
  href: string;
  fallbackTitre?: string;
}) {
  const titre =
    ((pin.data as { titre?: string }).titre as string) ??
    fallbackTitre ??
    pin.situation ??
    "Sans titre";
  const moisDepasse = pin.mois !== moisActuel;
  const confirmMessage = moisDepasse
    ? `Bébé a maintenant ${moisActuel} mois, ce contenu était pour le mois ${pin.mois}. Si tu le retires, tu perdras l'accès. Confirmer ?`
    : undefined;

  return (
    <li className="rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={href}
          className="flex-1 text-sm font-medium leading-tight text-neutral-900"
        >
          {titre}
        </Link>
        <RemovePinButton pinId={pin.id} confirmMessage={confirmMessage} />
      </div>
      <p className="mt-1.5 text-xs text-neutral-500">
        Mois {pin.mois}
        {moisDepasse ? (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900">
            bébé a {moisActuel} mois
          </span>
        ) : null}
      </p>
    </li>
  );
}
