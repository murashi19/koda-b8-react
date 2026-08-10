export const TAG_CONFIG = {
  new: { label: "Baru", bg: "bg-primary-light", text: "text-primary" },
  flash: { label: "Flash Sale", bg: "bg-red-100", text: "text-red-600" },
  best: { label: "Terlaris", bg: "bg-amber-100", text: "text-amber-600" },
  "star-seller": {
    label: "Star Seller",
    bg: "bg-amber-100",
    text: "text-amber-600",
  },
  "free-shipping": {
    label: "Gratis Ongkir",
    bg: "bg-success-light",
    text: "text-success",
  },
};

export function tagLabel(name) {
  return TAG_CONFIG[name]?.label ?? name;
}
