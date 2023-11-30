export const MENS_HOSTEL_BLOCKS = [
  { label: "A Block", value: "A" },
  { label: "B Block", value: "B" },
  { label: "C Block", value: "C" },
  { label: "D Block", value: "D" },
  { label: "E Block", value: "E" },
  { label: "F Block", value: "F" },
  { label: "G Block", value: "G" },
  { label: "H Block", value: "H" },
  { label: "I Block", value: "I" },
  { label: "J Block", value: "J" },
  { label: "K Block", value: "K" },
  { label: "L Block", value: "L" },
  { label: "M Block", value: "M" },
  { label: "N Block", value: "N" },
  { label: "O Block", value: "O" },
  { label: "P Block", value: "P" },
  { label: "Q Block", value: "Q" },
  { label: "R Block", value: "R" },
];
export const WOMENS_HOSTEL_BLOCKS = [
  { label: "A Block", value: "A" },
  { label: "B Block", value: "B" },
  { label: "C Block", value: "C" },
  { label: "D Block", value: "D" },
  { label: "E Block", value: "E" },
  { label: "F Block", value: "F" },
  { label: "G Block", value: "G" },
  { label: "H Block", value: "H" },
];

export const HOSTEL_BLOCKS_MAPPED = [
  ...MENS_HOSTEL_BLOCKS,
  ...WOMENS_HOSTEL_BLOCKS,
].reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  },
  {} as Record<string, string>,
);
