import { BoutonValiderInstaller } from "@/components/ui/installer-app";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";
import { upsertProfile } from "@/app/(app)/profil/actions";

// ----- « Présentez votre bébé » (premier profil), au fond rose ----------
// Mêmes couleurs que l'inscription (slot 2 de Guide-moi, Laura 18/11/2026).
// Le profil est définitif : il fixe les contenus. Le bouton le valide puis
// propose d'installer l'app (components/ui/installer-app.tsx).

const champ =
  "w-full rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-base outline-none transition focus:border-[#9A5444] focus:bg-white focus:ring-2 focus:ring-[#9A5444]/15";
const champStyle = {
  background: "rgba(255,255,255,.62)",
  borderColor: C.soutenu,
  color: C.texte,
};

/** Visage de bébé au trait, même style que les autres pictos de l'app. */
export function PictoBebe({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 5.5c0-1.6 1.2-2.6 2.6-2.2" />
      <circle cx="9.3" cy="12.2" r=".7" fill={color} stroke="none" />
      <circle cx="14.7" cy="12.2" r=".7" fill={color} stroke="none" />
      <path d="M9.6 15.6c1.3 1.1 3.5 1.1 4.8 0" />
    </svg>
  );
}

function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-bold uppercase tracking-[.08em]"
      style={{ color: C.accent }}
    >
      {children}
    </span>
  );
}

export function PresentezVotreBebe({
  errorMsg,
  today,
  codeRequis,
}: {
  errorMsg: string | null;
  today: string;
  codeRequis: boolean;
}) {
  return (
    <div
      className="relative -mx-5 -mb-4 -mt-6 min-h-full flex-1 overflow-hidden px-5 pb-8 pt-8"
      style={{ background: C.fond, color: C.texte }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
        style={{ background: C.clair, opacity: 0.7 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[50%] h-56 w-56 rounded-full"
        style={{ background: C.soutenu, opacity: 0.45 }}
      />

      <section className="relative space-y-4">
        <header className="space-y-1.5 text-center">
          <div
            className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,.5)" }}
            aria-hidden
          >
            <PictoBebe className="h-7 w-7" color={C.accent} />
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[24px] font-semibold leading-tight">
            Présentez votre bébé
          </h1>
          <p className="text-[13px]" style={{ color: C.accent }}>
            Tout le contenu de l&apos;app s&apos;adaptera à son âge.
          </p>
        </header>

        {errorMsg ? (
          <p
            className="rounded-[14px] p-3 text-sm"
            style={{ background: "#FFF4F1", color: "#8A2E1E" }}
          >
            {errorMsg}
          </p>
        ) : null}

        <form action={upsertProfile} className="space-y-3">
          <div
            className="space-y-3 rounded-[22px] p-4"
            style={{ background: "rgba(255,255,255,.38)" }}
          >
            <label className="block space-y-1">
              <Etiquette>Son prénom</Etiquette>
              <input
                type="text"
                name="baby_name"
                required
                maxLength={50}
                className={champ}
                style={champStyle}
              />
            </label>
            <label className="block space-y-1">
              <Etiquette>Sa date de naissance</Etiquette>
              <input
                type="date"
                name="birthdate"
                required
                max={today}
                className={champ}
                style={champStyle}
              />
            </label>
            <fieldset className="space-y-1">
              <legend className="mb-1">
                <Etiquette>
                  Genre{" "}
                  <span className="font-normal normal-case tracking-normal">
                    (facultatif, pour accorder les textes)
                  </span>
                </Etiquette>
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: "garcon", label: "Garçon" },
                  { value: "fille", label: "Fille" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center justify-center rounded-[14px] border-[1.5px] border-[#EABDB1] bg-white/60 px-3 py-2.5 text-base text-[#5E3328] transition has-[:checked]:border-[#9A5444] has-[:checked]:bg-[#9A5444] has-[:checked]:text-white"
                  >
                    <input
                      type="radio"
                      name="genre"
                      value={opt.value}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
            {codeRequis ? (
              <label className="block space-y-1">
                <Etiquette>Code d&apos;activation</Etiquette>
                <input
                  type="text"
                  name="code"
                  required
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className={`${champ} text-center font-semibold uppercase tracking-[.2em]`}
                  style={champStyle}
                />
              </label>
            ) : null}
          </div>

          <label
            className="flex cursor-pointer items-start gap-3 rounded-[22px] border-[1.5px] border-dashed px-4 py-3 text-[13px] leading-snug"
            style={{ background: C.moyen, borderColor: C.profond }}
          >
            <input
              type="checkbox"
              name="confirmation"
              value="oui"
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#9A5444]"
            />
            <span>
              J&apos;ai vérifié : ces informations sont exactes. Je sais
              qu&apos;elles ne pourront plus être modifiées.
            </span>
          </label>

          <BoutonValiderInstaller
            className="w-full rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_-8px_rgba(94,51,40,.55)] transition active:scale-[.98] disabled:opacity-70"
            style={{ background: C.accent }}
          />
        </form>
      </section>
    </div>
  );
}
