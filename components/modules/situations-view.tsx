"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CategorieGuide, SituationListItem } from "@/lib/content";
import {
  CategoryIcon,
  GUIDE_MUTED,
  GUIDE_TEXT,
  parseSituation,
  slotFor,
} from "@/components/modules/guide-design";

// Page 2 « Situations » — liste des 4 situations d'une catégorie.
// Design : skills/CONSIGNES_CLAUDE_CODE_guide_moi_page2.md (V2).
// Client component car le saut conditionnel mesure le DOM (wrap de la ligne 1).

const PLAYFAIR = "var(--font-playfair), Georgia, serif";

const FIRST_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: GUIDE_TEXT,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  fontWeight: 600,
  lineHeight: "normal",
};

const SECOND_STYLE: React.CSSProperties = {
  fontSize: 14,
  color: GUIDE_TEXT,
  fontWeight: 400,
  fontStyle: "italic",
  lineHeight: "normal",
};

function SituationButton({
  href,
  situation,
  bgColor,
}: {
  href: string;
  situation: string;
  bgColor: string;
}) {
  const { firstPart, secondPart } = parseSituation(situation);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [firstWraps, setFirstWraps] = useState(false);

  useEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const measure = () => {
      const cs = window.getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize) || 12;
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.2;
      setFirstWraps(el.offsetHeight > lineHeight * 1.5);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [firstPart]);

  return (
    <Link
      href={href}
      style={{
        background: bgColor,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        width: "78%",
        textDecoration: "none",
      }}
    >
      <span style={{ flex: 1, color: GUIDE_TEXT, position: "relative" }}>
        {/* Probe invisible : mesure la hauteur réelle de la ligne 1 seule. */}
        <span
          ref={probeRef}
          aria-hidden
          style={{
            ...FIRST_STYLE,
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          {firstPart} /
        </span>

        {!secondPart ? (
          <span style={{ ...FIRST_STYLE, display: "block" }}>{firstPart}</span>
        ) : firstWraps ? (
          // Ligne 1 wrap : enchaînement en flux continu.
          <span style={{ display: "block" }}>
            <span style={FIRST_STYLE}>{firstPart} / </span>
            <span style={SECOND_STYLE}>{secondPart}</span>
          </span>
        ) : (
          // Cas standard : deux blocs empilés, saut de ligne visuel.
          <span style={{ display: "block" }}>
            <span style={{ ...FIRST_STYLE, display: "block" }}>
              {firstPart} /
            </span>
            <span style={{ ...SECOND_STYLE, display: "block", marginTop: 2 }}>
              {secondPart}
            </span>
          </span>
        )}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={GUIDE_TEXT}
        strokeWidth="1.7"
        strokeLinecap="round"
        style={{ flexShrink: 0 }}
        aria-hidden
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export function SituationsView({
  categorie,
  slotIndex,
  situations,
}: {
  categorie: CategorieGuide;
  slotIndex: number;
  situations: SituationListItem[];
}) {
  const slot = slotFor(slotIndex);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Breadcrumb retour */}
      <Link
        href="/guide"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: GUIDE_MUTED,
          fontSize: 11,
          textDecoration: "none",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={GUIDE_MUTED}
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <span>Guide-moi !</span>
      </Link>

      {/* Bloc titre : picto + nom catégorie + sous-titre fixe */}
      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <span style={{ display: "block", margin: "0 auto 10px", width: 32 }}>
          <CategoryIcon
            categoryKey={categorie.id}
            color={slot.bg}
            size={32}
            emoji={categorie.icone}
          />
        </span>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: GUIDE_TEXT,
            letterSpacing: "-.015em",
            margin: "0 0 8px 0",
            lineHeight: 1.1,
          }}
        >
          {categorie.nom}
        </h1>
        <div
          style={{
            fontSize: 9,
            color: GUIDE_MUTED,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Dans quelles situations ?
        </div>
      </div>

      {/* 4 cases — camaïeu par position */}
      {situations.length === 0 ? (
        <p
          style={{
            background: "#EDE9E4",
            borderRadius: 12,
            padding: "14px 18px",
            fontSize: 12,
            color: GUIDE_TEXT,
            textAlign: "center",
          }}
        >
          Aucune situation disponible pour cette catégorie.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 11,
            alignItems: "center",
          }}
        >
          {situations.map((s, i) => (
            <SituationButton
              key={s.id}
              href={`/guide/${categorie.id}/${s.ordre}`}
              situation={s.situation}
              bgColor={slot.camaieu[i % slot.camaieu.length]}
            />
          ))}
        </div>
      )}

      {/* Mention préventive */}
      <div
        style={{
          padding: "32px 4px 8px",
          fontSize: 9,
          color: GUIDE_MUTED,
          lineHeight: 1.4,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        En cas de doute médical, contacte le 15 ou ton pédiatre.
      </div>
    </div>
  );
}
