import { requireUser } from "@/lib/auth";
import { PageAVenir } from "@/components/ui/page-a-venir";

// « Mentions légales » (menu des réglages, 20/10/2026). À remplir.
export default async function MentionsLegalesPage() {
  await requireUser();
  return (
    <PageAVenir
      surtitre="Réglages"
      titre="Mentions légales"
      texte="Cette page est en préparation."
    />
  );
}
