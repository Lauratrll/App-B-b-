// ----------------------------------------------------------------------------
// Rond d'un picto « une teinte au-dessus » de sa carte (Laura, 29/10).
// Même règle que les slots Réflexologie (reflexo-design.tsx, bg → avatarBg),
// mesurée en OKLCH sur ses cinq familles : clarté −0,078, intensité ×1,62,
// teinte inchangée. Le picto posé dessus est noir (#3A3228).
// ----------------------------------------------------------------------------

const versLineaire = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const versSrgb = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function versOklch(hex: string): [number, number, number] {
  const r = versLineaire(parseInt(hex.slice(1, 3), 16));
  const g = versLineaire(parseInt(hex.slice(3, 5), 16));
  const b = versLineaire(parseInt(hex.slice(5, 7), 16));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

function depuisOklch(L: number, C: number, h: number): number[] {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(versSrgb);
}

export function teinteAuDessus(hex: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const [L, C, h] = versOklch(hex);
  const L2 = L - 0.078;
  let C2 = C * 1.62;
  // Si la couleur sort de l'écran (trop vive), on baisse l'intensité, jamais la teinte.
  let rgb = depuisOklch(L2, C2, h);
  while (rgb.some((v) => v < 0 || v > 1) && C2 > 0) {
    C2 -= 0.002;
    rgb = depuisOklch(L2, C2, h);
  }
  return (
    "#" +
    rgb
      .map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
