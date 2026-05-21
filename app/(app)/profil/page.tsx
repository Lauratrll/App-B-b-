import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { upsertProfile } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir le prénom et la date de naissance.",
  date_invalide: "La date de naissance est invalide.",
  date_future: "La date de naissance ne peut pas être dans le futur.",
  sauvegarde_echouee: "L'enregistrement a échoué. Réessayez dans un instant.",
};

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireUser();
  const profile = await getCurrentProfile();
  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  const babyMonth = profile
    ? getBabyMonth(new Date(profile.birthdate))
    : null;

  const today = new Date().toISOString().split("T")[0];

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
            ? `Prénom et date de naissance — actuellement ${babyMonth} mois.`
            : "Renseignez les infos de votre bébé pour adapter tout le contenu."}
        </p>
      </header>

      {errorMsg ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          {errorMsg}
        </p>
      ) : null}

      <form action={upsertProfile} className="space-y-4">
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
        <button
          type="submit"
          className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
        >
          {profile ? "Enregistrer les modifications" : "C'est parti"}
        </button>
      </form>
    </section>
  );
}
