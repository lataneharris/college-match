export const REGION_TO_STATES: Record<string, string[]> = {
  Northeast: ["CT","ME","MA","NH","RI","VT","NJ","NY","PA"],
  Midwest: ["IL","IN","MI","OH","WI","IA","KS","MN","MO","NE","ND","SD"],
  Southeast: ["AL","AR","DE","DC","FL","GA","KY","LA","MD","MS","NC","SC","TN","VA","WV"],
  Southwest: ["AZ","NM","OK","TX"],
  West: ["AK","CA","CO","HI","ID","MT","NV","OR","UT","WA","WY"],
};

export const STATE_NAME_TO_ABBR: Record<string, string> = {
  "alabama":"AL","alaska":"AK","arizona":"AZ","arkansas":"AR","california":"CA","colorado":"CO","connecticut":"CT",
  "delaware":"DE","district of columbia":"DC","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID","illinois":"IL",
  "indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA","maine":"ME","maryland":"MD","massachusetts":"MA",
  "michigan":"MI","minnesota":"MN","mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV",
  "new hampshire":"NH","new jersey":"NJ","new mexico":"NM","new york":"NY","north carolina":"NC","north dakota":"ND",
  "ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA","rhode island":"RI","south carolina":"SC","south dakota":"SD",
  "tennessee":"TN","texas":"TX","utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","west virginia":"WV",
  "wisconsin":"WI","wyoming":"WY",
};

export function normalizeState(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const k = trimmed.toLowerCase();
  return STATE_NAME_TO_ABBR[k] ?? null;
}
