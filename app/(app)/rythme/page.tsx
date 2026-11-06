import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getBabyMonth } from "@/lib/utils";
import { fenetreEveil, type JourneeEnregistree } from "@/lib/rythme";
import { RythmeOutil } from "@/components/modules/rythme-outil";
import { NavBack } from "@/components/ui/nav-context";

// Le rythme de bébé (06/11/2026) : ouvert par le bouton « Enregistrer le rythme
// de mon bébé » de Repères clés (Sommeil). Nom de l'écran provisoire.
// Une roue par jour du calendrier, lue dans journees_rythme (migration 0006). Tant que la migration
// n'est pas passée, la roue fonctionne mais l'enregistrement est masqué.

export const dynamic = "force-dynamic";

export default async function RythmePage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));

  const supabase = createClient();
  const { data, error } = await supabase
    .from("journees_rythme")
    .select("id, jour, mois_bebe, evenements")
    .order("jour", { ascending: false })
    .limit(200);

  const journees = (data ?? []) as unknown as JourneeEnregistree[];

  return (
    <>
      <NavBack href="/coucher?slot=reperes-cles" label="Sommeil" />
      <RythmeOutil
        prenom={profile.baby_name}
        mois={mois}
        fenetre={fenetreEveil(mois)}
        journees={journees}
        disponible={!error}
        genre={profile.genre}
      />
    </>
  );
}
