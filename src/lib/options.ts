export const COUNTIES = ["Nordland", "Troms", "Finnmark", "Svalbard", "Annet"] as const;

export const GENDERS = [
  { value: "kvinne", label: "Kvinne" },
  { value: "mann", label: "Mann" },
  { value: "annet", label: "Annet" },
  { value: "vil_ikke_oppgi", label: "Vil ikke oppgi" },
] as const;

export const INDUSTRIES = [
  "Fiskeri og havbruk",
  "Energi og kraft",
  "Olje og gass",
  "Bygg og anlegg",
  "Reiseliv",
  "Handel",
  "Transport og logistikk",
  "Finans og forsikring",
  "IT og teknologi",
  "Helse",
  "Offentlig sektor",
  "Utdanning og forskning",
  "Kultur og frivillighet",
  "Landbruk",
  "Industri",
  "Eiendom",
  "Annet",
] as const;

export const COMPETENCES = [
  "Økonomi og finans",
  "Juss",
  "HR og organisasjon",
  "Strategi",
  "Digitalisering og IT",
  "Salg og marked",
  "Bærekraft",
  "Eiendom",
  "Offentlig sektor",
  "Ledelse",
] as const;

export const BOARD_EXPERIENCE = [
  { value: "ingen", label: "Ingen styreverv ennå" },
  { value: "1-2", label: "1–2 verv" },
  { value: "3-5", label: "3–5 verv" },
  { value: "5+", label: "Over 5 verv" },
] as const;

export const BOARD_EDUCATION = [
  "Styreakademiet",
  "BI styrekurs",
  "AFF",
  "Annen styreutdanning",
] as const;

export const DESIRED_ROLES = [
  "Styremedlem",
  "Styreleder",
  "Varamedlem",
  "Rådgivende styre",
] as const;

export function label<T extends { value: string; label: string }>(
  list: readonly T[],
  value: string | null | undefined,
) {
  return list.find((o) => o.value === value)?.label ?? value ?? "";
}
