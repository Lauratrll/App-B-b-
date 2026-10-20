import { requireUser } from "@/lib/auth";
import { PageAVenir } from "@/components/ui/page-a-venir";

// « Nous contacter » (menu des réglages, 20/10/2026). À remplir : l'adresse
// de contact n'est pas encore arrêtée.
export default async function ContactPage() {
  await requireUser();
  return (
    <PageAVenir
      surtitre="Réglages"
      titre="Nous contacter"
      texte="Cette page est en préparation."
    />
  );
}
