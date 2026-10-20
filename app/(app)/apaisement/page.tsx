import { requireProfile } from "@/lib/auth";
import { PageAVenir } from "@/components/ui/page-a-venir";

// Gestes d'apaisement — boîte à outils (case de l'accueil, 20/10/2026).
// Contenu à construire.
export default async function ApaisementPage() {
  await requireProfile();
  return (
    <PageAVenir
      surtitre="Boîte à outils"
      titre="Gestes d'apaisement"
      texte="Cette boîte à outils est en préparation."
    />
  );
}
