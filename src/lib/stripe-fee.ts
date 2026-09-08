/** Display-only 2% fee helpers. The Stripe Worker recalculates the fee. */

export const FEE_RATE = 0.02;
export const MIN_DONATION_CENTS = 100;
export const STRIPE_MIN_CHARGE_CENTS = 50;

export function donationDollarsToCents(value: string | number): number | null {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function feeCentsFromDonation(donationCents: number): number {
  return Math.max(Math.round(donationCents * FEE_RATE), STRIPE_MIN_CHARGE_CENTS);
}

export function formatUsdFromCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
