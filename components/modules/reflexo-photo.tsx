import Image from "next/image";
import { PLAYFAIR, REFLEXO_MUTED, REFLEXO_TEXT } from "@/components/modules/reflexo-design";

// Photo en haut de la page 1 de la Réflexologie (Laura, 21/11/2026), bord à bord,
// moins haute que celle de l'accueil, coupée juste sous les yeux du papa. Le titre
// reste centré et peut passer sur le visage de bébé : cela préserve son anonymat
// (choix de Laura). Le bloc Introduction chevauche la photo.

/** De combien (px) le bloc Introduction remonte sur la photo. */
export const REFLEXO_PHOTO_CHEVAUCHEMENT = 26;

export function ReflexoPhoto() {
  return (
    <header
      style={{
        position: "relative",
        // Annule les marges du <main> (20 px) et de la page (8 px).
        margin: "-24px -28px 0",
        height: "clamp(150px, 23dvh, 195px)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Image
        src="/images/reflexologie/canape-papa.jpg"
        alt=""
        fill
        priority
        // Moins compressée que le réglage par défaut (75) : peau, cheveux et maille.
        quality={90}
        sizes="(max-width: 430px) 100vw, 430px"
        style={{ objectFit: "cover", objectPosition: "50% 0%" }}
      />
      {/* Centré en hauteur et en largeur dans la partie visible de la photo,
          c'est-à-dire au-dessus du bloc Introduction qui la chevauche. */}
      <div
        style={{
          position: "absolute",
          inset: `0 0 ${REFLEXO_PHOTO_CHEVAUCHEMENT}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: REFLEXO_TEXT,
            letterSpacing: "-.015em",
            lineHeight: 1.1,
            margin: "0 0 8px 0",
          }}
        >
          Réflexologie plantaire
        </h1>
        <p
          style={{
            fontSize: 9,
            color: REFLEXO_MUTED,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Apaiser bébé
        </p>
      </div>
    </header>
  );
}
