// Common cities in each Canadian province / territory, ordered roughly by
// population so the most relevant ones show first in the dropdown. The list
// is intentionally non-exhaustive — users can still type a city manually
// in the search-style combobox. Used by the new-listing form (and any other
// form that needs province-aware city suggestions).

import type { ProvinceCode } from "./canadaTax";

export const PROVINCE_CITIES: Record<ProvinceCode, string[]> = {
  ON: [
    "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London",
    "Markham", "Vaughan", "Kitchener", "Windsor", "Richmond Hill", "Oakville",
    "Burlington", "Oshawa", "Barrie", "St. Catharines", "Cambridge", "Kingston",
    "Guelph", "Thunder Bay", "Sudbury", "Waterloo", "Peterborough", "Sault Ste. Marie",
  ],
  QC: [
    "Montréal", "Québec", "Laval", "Gatineau", "Longueuil", "Sherbrooke",
    "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne", "Saint-Jean-sur-Richelieu",
    "Drummondville", "Saint-Hyacinthe", "Granby", "Shawinigan", "Rimouski",
  ],
  BC: [
    "Vancouver", "Surrey", "Burnaby", "Richmond", "Coquitlam", "Langley",
    "Saanich", "Delta", "Kelowna", "Kamloops", "Victoria", "Nanaimo",
    "Chilliwack", "Prince George", "Vernon", "Courtenay", "Penticton", "Campbell River",
  ],
  AB: [
    "Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat",
    "Grande Prairie", "Airdrie", "Spruce Grove", "Leduc", "Fort Saskatchewan",
    "Cochrane", "Camrose", "Brooks", "Canmore", "Redcliff",
  ],
  MB: [
    "Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie",
    "Winkler", "Selkirk", "Morden", "Dauphin", "The Pas", "Flin Flon",
  ],
  SK: [
    "Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current",
    "Yorkton", "North Battleford", "Estevan", "Weyburn", "Lloydminster",
  ],
  NS: [
    "Halifax", "Cape Breton", "Dartmouth", "Truro", "New Glasgow", "Sydney",
    "Glace Bay", "Kentville", "Amherst", "Bridgewater", "Yarmouth",
  ],
  NB: [
    "Moncton", "Saint John", "Fredericton", "Dieppe", "Miramichi", "Edmundston",
    "Bathurst", "Campbellton", "Oromocto", "Grand Falls",
  ],
  NL: [
    "St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South",
    "Paradise", "Grand Falls-Windsor", "Gander", "Stephenville", "Clarenville",
  ],
  PE: [
    "Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague",
    "Kensington", "Souris", "Alberton",
  ],
  NT: ["Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Norman Wells"],
  YT: ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction"],
  NU: ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay"],
};

export function citiesFor(province: ProvinceCode | "" | undefined): string[] {
  if (!province) return [];
  return PROVINCE_CITIES[province] ?? [];
}
