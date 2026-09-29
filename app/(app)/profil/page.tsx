import { getRealProfile, isCurrentUserAdmin, requireUser } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { upsertProfile } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir le prénom et la date de naissance.",
  date_invalide: "La date de naissance est invalide.",
  date_future: "La date de naissance ne peut pas être dans le futur.",
  confirmation_manquante:
    "Merci de cocher la case pour confirmer que les informations sont exactes.",
  profil_verrouille:
    "Le profil ne peut plus être modifié. Écrivez-nous pour toute correction.",
  sauvegarde_echouee: "L'enregistrement a échoué. Réessayez dans un instant.",
};

const GENRE_LABELS: Record<string, string> = {
  garcon: "Garçon",
  fille: "Fille",
};

function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireUser();
  const profile = await getRealProfile();
  const isAdmin = await isCurrentUserAdmin();
  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  const babyMonth = profile
    ? getBabyMonth(new Date(profile.birthdate))
    : null;

  const today = new Date().toISOString().split("T")[0];
  const verrouille = profile !== null && !isAdmin;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>
          👶
        </p>
        <h1 className="text-2xl font-semibold">
          {profile ? "Profil bébé" : "Bienvenue !"}
        </h1>
        <p className="text-sm text-neutral-600">
          {profile
            ? `Actuellement ${babyMonth} mois.`
            : "Renseignez les infos de votre bébé pour adapter tout le contenu."}
        </p>
      </header>

      {errorMsg ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          {errorMsg}
        </p>
      ) : null}

      {verrouille ? (
        <div className="space-y-4">
          <dl className="space-y-3 rounded-[14px] border border-[#C8D8DC] p-4">
            <div>
              <dt className="text-xs text-neutral-500">Prénom</dt>
              <dd className="text-base text-neutral-900">
                {profile.baby_name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Date de naissance</dt>
              <dd className="text-base text-neutral-900">
                {formatDateFr(profile.birthdate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Genre</dt>
              <dd className="text-base text-neutral-900">
                {profile.genre ? GENRE_LABELS[profile.genre] : "Non renseigné"}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-neutral-600">
            Une erreur dans ces informations ? Écrivez-nous : nous la
            corrigerons pour vous.
          </p>
        </div>
      ) : (
        <form action={upsertProfile} className="space-y-4">
          {!profile ? (
            <p className="rounded-xl bg-[#F8E0D8] p-4 text-sm text-[#3A3228]">
              Prenez le temps de bien vérifier : le prénom, la date de
              naissance et le genre ne pourront plus être modifiés ensuite.
            </p>
          ) : null}
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Prénom du bébé
            </span>
            <input
              type="text"
              name="baby_name"
              required
              maxLength={50}
              defaultValue={profile?.baby_name ?? ""}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Date de naissance
            </span>
            <input
              type="date"
              name="birthdate"
              required
              max={today}
              defaultValue={profile?.birthdate ?? ""}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
            />
          </label>
          <fieldset className="block space-y-1.5">
            <legend className="text-sm font-medium text-neutral-700">
              Genre{" "}
              <span className="font-normal text-neutral-400">(optionnel)</span>
            </legend>
            <p className="text-xs text-neutral-500">
              Pour accorder les textes personnalisés (berceuse, formulations).
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { value: "garcon", label: "Garçon" },
                { value: "fille", label: "Fille" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 text-base has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white"
                >
                  <input
                    type="radio"
                    name="genre"
                    value={opt.value}
                    defaultChecked={profile?.genre === opt.value}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          {!profile ? (
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="confirmation"
                value="oui"
                required
                className="mt-0.5 h-5 w-5 shrink-0"
              />
              <span>
                J&apos;ai vérifié : ces informations sont exactes et je sais
                qu&apos;elles ne pourront plus être modifiées.
              </span>
            </label>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
          >
            {profile ? "Enregistrer (admin)" : "C'est parti"}
          </button>
        </form>
      )}
    </section>
  );
}
