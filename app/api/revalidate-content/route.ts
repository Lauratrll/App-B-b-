import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Endpoint POST /api/revalidate-content
// Invalide le cache du contenu (tag "content" utilisé par tous les
// helpers de lib/content.ts).
// Appelé automatiquement par scripts/import-content.mjs après import.
//
// Authentification : header "x-revalidate-secret" = process.env.REVALIDATE_SECRET
// Réponse : { ok: true } en cas de succès, 401 si secret invalide.

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET non configuré côté serveur" },
      { status: 500 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret");
  if (provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "Secret invalide" },
      { status: 401 },
    );
  }

  revalidateTag("content");
  return NextResponse.json({
    ok: true,
    message: "Cache content invalidé",
    timestamp: new Date().toISOString(),
  });
}
