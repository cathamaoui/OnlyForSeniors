import { getProvince, type ProvinceCode, formatCAD } from "./canadaTax";

// The signup flow is a 4-step process. Each step writes its slice of data to
// localStorage so the user can refresh and resume. There is no real backend
// in this static export — the final step would, in production, hit an API
// that creates the account, charges the card, and writes the subscription
// to a database. Here we collect everything and present a clear invoice.

export const PLAN_BASE_CAD = 10; // $10.00 / month, before tax

export type Account = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  password: string; // never displayed back; in production this is hashed
};

export type BusinessProfile = {
  street: string;
  city: string;
  province: ProvinceCode | "";
  postalCode: string;
  website: string;
  categorySlug: string;
  subcategorySlug: string;
  serviceArea: string;
  description: string;
  logoUrl: string;
};

export type Checkout = {
  plan: "monthly";
  cardName: string;
  cardNumberMasked: string; // we only store last 4
  cardLast4: string;
  cardExp: string; // MM/YY
  billingStreet: string;
  billingCity: string;
  billingProvince: ProvinceCode | "";
  billingPostal: string;
  agreedToTerms: boolean;
};

export type SignupState = {
  account: Partial<Account>;
  profile: Partial<BusinessProfile>;
  checkout: Partial<Checkout>;
  completedSteps: number; // 0–4
  updatedAt: string;
};

const STORAGE_KEY = "ofs-signup";

const EMPTY: SignupState = {
  account: {},
  profile: {},
  checkout: {},
  completedSteps: 0,
  updatedAt: "",
};

export function loadSignup(): SignupState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as SignupState;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function saveSignup(next: SignupState) {
  if (typeof window === "undefined") return;
  const payload = { ...next, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearSignup() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function markStep(state: SignupState, step: number): SignupState {
  return { ...state, completedSteps: Math.max(state.completedSteps, step) };
}

export function totalWithTax(province: ProvinceCode | "" | undefined): {
  subtotal: number;
  tax: number;
  total: number;
  rate: number;
  label: string;
} {
  const p = getProvince(province);
  const rate = p?.rate ?? 0;
  const tax = PLAN_BASE_CAD * rate;
  return {
    subtotal: PLAN_BASE_CAD,
    tax,
    total: PLAN_BASE_CAD + tax,
    rate,
    label: p?.label ?? "No tax",
  };
}

export { formatCAD };
