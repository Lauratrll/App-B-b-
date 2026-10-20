import { requireProfile } from "@/lib/auth";
import { PageAVenir } from "@/components/ui/page-a-venir";

// Cohérence cardiaque — bouton rond de la barre du bas (20/10/2026).
// Contenu à créer.
export default async function CoherencePage() {
  await requireProfile();
  return (
    <PageAVenir
      surtitre="Respirer"
      titre="Cohérence cardiaque"
      texte="Cet espace est en préparation."
    />
  );
}
