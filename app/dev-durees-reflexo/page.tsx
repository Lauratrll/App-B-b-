import { notFound } from "next/navigation";
import { getIdsPublies, getProtocole, getStepsAnimation } from "@/lib/reflexologie";
import { MesureDurees } from "./mesure";

// Page de MESURE des durées d'animation — hors production uniquement.
//
// Pourquoi elle existe : le bouton « Lancer le protocole » annonce une durée.
// Cette durée ne peut pas être devinée — elle sort du moteur d'animation, qui
// la calcule étape par étape à partir de la géométrie réelle des zones (longueur
// des médianes, nombre de points d'appui, nombre d'orteils…). La réestimer à
// côté, dans un script, reviendrait à recopier le moteur et à le voir dériver au
// premier réglage de mouvement.
//
// Mode d'emploi : `npm run dev`, ouvrir /dev-durees-reflexo, attendre la fin du
// balayage, copier le JSON affiché dans reflexologie/durees-protocoles.json.
// À relancer après CHAQUE modification des constantes de temps du lecteur.

export const dynamic = "force-static";

export default function PageDurees() {
  if (process.env.NODE_ENV === "production") notFound();

  const cas = getIdsPublies().flatMap((id) => {
    const p = getProtocole(id);
    if (!p) return [];
    const base = {
      cle: id,
      titre: p.titre,
      steps: getStepsAnimation(p),
      noteFin: p.note_fin,
    };
    // La variante a sa propre carte, donc sa propre durée (une ou plusieurs
    // étapes de plus) : elle se mesure sous la clé « <id>+variante ».
    if (!p.visuel_cauchemars) return [base];
    return [
      base,
      {
        cle: `${id}+variante`,
        titre: `${p.titre} (variante)`,
        steps: getStepsAnimation(p, { avecVariante: true }),
        noteFin: p.note_fin,
      },
    ];
  });

  return <MesureDurees cas={cas} />;
}
