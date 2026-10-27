import { APERCU_MOIS_MAX, type Genre } from "@/lib/auth";
import type { Season } from "@/lib/utils";
import { ApercuAutoForm } from "@/components/modules/apercu-auto-form";

// Bandeau réservé aux admins : naviguer librement entre les mois, les
// genres et les saisons, sur une seule ligne. Chaque choix s'applique tout
// de suite (pas de bouton). Rendu uniquement quand getApercu() confirme le
// statut admin.
export function ApercuAdminBar({
  mois,
  genre,
  saison,
}: {
  mois: number;
  genre: Genre | null;
  // null = la saison du moment.
  saison: Season | null;
}) {
  const selectClass =
    "min-h-[34px] rounded-[9px] border border-[#C8D8DC] bg-white px-1.5 text-xs text-[#3A3228]";

  return (
    <div className="border-b border-[#C8D8DC] bg-[#E8F0F2] px-4 py-2">
      <ApercuAutoForm>
        <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#3A5A64]">
          Admin
        </span>
        <select
          name="mois"
          defaultValue={Math.min(mois, APERCU_MOIS_MAX)}
          aria-label="Mois à afficher"
          className={selectClass}
        >
          {Array.from({ length: APERCU_MOIS_MAX + 1 }, (_, m) => (
            <option key={m} value={m}>
              M{m}
            </option>
          ))}
        </select>
        {/* Plus de « Non renseigné » (27/10) : sans genre, le contenu est au
            masculin, comme pour Garçon. */}
        <select
          name="genre"
          defaultValue={genre ?? "garcon"}
          aria-label="Genre à afficher"
          className={selectClass}
        >
          <option value="garcon">Garçon</option>
          <option value="fille">Fille</option>
        </select>
        <select
          name="saison"
          defaultValue={saison ?? ""}
          aria-label="Saison à afficher"
          className={selectClass}
        >
          <option value="">Présent</option>
          <option value="printemps">Printemps</option>
          <option value="ete">Été</option>
          <option value="automne">Automne</option>
          <option value="hiver">Hiver</option>
        </select>
      </ApercuAutoForm>
    </div>
  );
}
