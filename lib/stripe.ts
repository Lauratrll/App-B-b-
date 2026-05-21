import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY est manquant dans les variables d'environnement.",
    );
  }

  stripeClient = new Stripe(secretKey, {
    typescript: true,
  });

  return stripeClient;
}

export const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY ?? "",
  annual: process.env.STRIPE_PRICE_ID_ANNUAL ?? "",
} as const;
