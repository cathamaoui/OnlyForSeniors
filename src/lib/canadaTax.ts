// Canadian provincial sales tax rates for the $10/mo subscription.
// Effective 2026. Source: Canada Revenue Agency + provincial finance ministries.
// Rates are combined (GST/PST/HST/QST) so we can show a single number on the
// invoice. Some provinces only charge GST (5%); some charge HST (13–15%);
// some charge GST + a separate provincial tax (BC, SK, MB).
//
//   AB, NT, NU, YT  — 5% GST only
//   BC              — 5% GST + 7% PST = 12%
//   SK              — 5% GST + 6% PST = 11%
//   MB              — 5% GST + 7% RST = 12%
//   ON              — 13% HST
//   QC              — 5% GST + 9.975% QST = 14.975%
//   NB, NL, NS, PE  — 15% HST

export type ProvinceCode =
  | "AB" | "BC" | "MB" | "NB" | "NL" | "NS" | "NT" | "NU" | "ON"
  | "PE" | "QC" | "SK" | "YT";

export type Province = {
  code: ProvinceCode;
  name: string;
  rate: number;          // combined effective tax rate (decimal, e.g. 0.13 for 13%)
  label: string;         // human label like "HST 13%"
  breakdown: string;     // e.g. "5% GST + 8% PST" or "13% HST"
};

export const PROVINCES: Province[] = [
  { code: "AB", name: "Alberta",         rate: 0.05,    label: "GST 5%",          breakdown: "5% GST" },
  { code: "BC", name: "British Columbia", rate: 0.12,    label: "GST + PST 12%",   breakdown: "5% GST + 7% PST" },
  { code: "MB", name: "Manitoba",        rate: 0.12,    label: "GST + RST 12%",   breakdown: "5% GST + 7% RST" },
  { code: "NB", name: "New Brunswick",   rate: 0.15,    label: "HST 15%",         breakdown: "15% HST" },
  { code: "NL", name: "Newfoundland and Labrador", rate: 0.15, label: "HST 15%", breakdown: "15% HST" },
  { code: "NS", name: "Nova Scotia",     rate: 0.15,    label: "HST 15%",         breakdown: "15% HST" },
  { code: "NT", name: "Northwest Territories", rate: 0.05, label: "GST 5%",       breakdown: "5% GST" },
  { code: "NU", name: "Nunavut",         rate: 0.05,    label: "GST 5%",          breakdown: "5% GST" },
  { code: "ON", name: "Ontario",         rate: 0.13,    label: "HST 13%",         breakdown: "13% HST" },
  { code: "PE", name: "Prince Edward Island", rate: 0.15, label: "HST 15%",        breakdown: "15% HST" },
  { code: "QC", name: "Quebec",          rate: 0.14975, label: "GST + QST 14.975%", breakdown: "5% GST + 9.975% QST" },
  { code: "SK", name: "Saskatchewan",    rate: 0.11,    label: "GST + PST 11%",   breakdown: "5% GST + 6% PST" },
  { code: "YT", name: "Yukon",           rate: 0.05,    label: "GST 5%",          breakdown: "5% GST" },
];

export function getProvince(code: string | undefined | null): Province | undefined {
  if (!code) return undefined;
  return PROVINCES.find((p) => p.code === code);
}

/**
 * Format a dollar amount the way Canadian businesses expect on an invoice:
 *   $10.00 CAD, with two decimals and a leading $.
 */
export function formatCAD(n: number): string {
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}
