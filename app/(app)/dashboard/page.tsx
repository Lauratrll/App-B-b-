import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { AccueilVue } from "@/components/modules/accueil-vue";

// Accueil : la mise en page et ses décisions sont dans components/modules/accueil-vue.tsx.
export default async function DashboardPage() {
  const [{ profile }, season] = await Promise.all([
    requireProfile(),
    getCurrentSeason(),
  ]);
  return (
    <AccueilVue
      prenom={profile.baby_name}
      mois={getBabyMonth(new Date(profile.birthdate))}
      saison={season}
    />
  );
}
