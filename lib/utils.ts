export type Season = "printemps" | "ete" | "automne" | "hiver";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing";

export type Subscription = {
  status: SubscriptionStatus;
  current_period_end: string | Date;
};

export function getBabyMonth(birthdate: Date): number {
  const today = new Date();
  const months =
    (today.getFullYear() - birthdate.getFullYear()) * 12 +
    (today.getMonth() - birthdate.getMonth());
  return Math.max(0, Math.min(24, months));
}

export function getSeason(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "printemps";
  if (month >= 6 && month <= 8) return "ete";
  if (month >= 9 && month <= 11) return "automne";
  return "hiver";
}

export function isSubscriptionActive(subscription: Subscription): boolean {
  return (
    subscription.status === "active" &&
    new Date(subscription.current_period_end) > new Date()
  );
}
