import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getContenuSignaux } from "@/lib/signaux-bebe-contenu";
import { SignauxBebeOutil } from "@/components/modules/signaux-bebe-outil";

// « Que me dit bébé ? » (05/11/2026) : outil d'analyse du comportement.
// Spécification : PROMPT_que_me_dit_bebe.md. Ouvert à tous les comptes
// (Laura, 05/11 : l'app n'est pas encore commercialisée).
// Rien n'est enregistré : l'âge du profil sert seulement de valeur de départ,
// les réponses et le résultat vivent en mémoire dans la page.

export default async function QueMeDitBebePage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  return <SignauxBebeOutil contenu={getContenuSignaux()} ageProfil={mois} />;
}
