export const MENS_PICKUP_LOCATIONS = [
  { value: "d-annex", label: "D-Annex" },
  { value: "amazon", label: "Amazon" },
];
export const WOMENS_PICKUP_LOCATIONS = [
  { value: "e-block", label: "E-Block" },
  { value: "amazon", label: "Amazon" },
];
export const PICKUP_LOCATIONS_MAPPED = [
  ...MENS_PICKUP_LOCATIONS,
  ...WOMENS_PICKUP_LOCATIONS,
].reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  },
  {} as Record<string, string>,
);
