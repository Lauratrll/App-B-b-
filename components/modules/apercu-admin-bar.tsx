import { APERCU_MOIS_MAX, type Genre } from "@/lib/auth";
import { setApercu } from "@/app/(app)/apercu-actions";

// Bandeau réservé aux admins : naviguer librement entre les mois et les
// genres. Rendu uniquement quand getApercu() confirme le statut admin.
export function ApercuAdminBar({
  mois,
  genre,
}: {
  mois: number;
  genre: Genre | null;
}) {
  const selectClass =
    "min-h-[36px] rounded-[9px] border border-[#C8D8DC] bg-white px-2 text-xs text-[#3A3228]";

  return (
    <div className="border-b border-[#C8D8DC] bg-[#E8F0F2] px-4 py-2">
      <form action={setApercu} className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#3A5A64]">
          Aperçu admin
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
        <select
          name="genre"
          defaultValue={genre ?? "aucun"}
          aria-label="Genre à afficher"
          className={selectClass}
        >
          <option value="garcon">Garçon</option>
          <option value="fille">Fille</option>
          <option value="aucun">Non renseigné</option>
        </select>
        <button
          type="submit"
          className="min-h-[36px] rounded-[9px] bg-[#3A5A64] px-3 text-xs font-medium text-white"
        >
          Voir
        </button>
      </form>
    </div>
  );
}
