// Sama kayak paymentMethods.js — satu sumber data metode pengiriman,
// biar Step1, Step3, dan Success gak punya list yang beda-beda sendiri.
export const SHIPPING_METHODS = [
  {
    id: "jne-reg",
    label: "JNE Reguler",
    sub: "3 - 5 hari kerja",
    price: "GRATIS",
  },
  {
    id: "jne-exp",
    label: "JNE Express",
    sub: "1 - 2 hari kerja",
    price: "GRATIS",
  },
  {
    id: "same-day",
    label: "Same Day Delivery",
    sub: "Hari ini (sebelum 16.00)",
    price: "GRATIS",
  },
];

export const SHIPPING_METHOD_LABELS = Object.fromEntries(
  SHIPPING_METHODS.map((m) => [m.id, m.label]),
);
