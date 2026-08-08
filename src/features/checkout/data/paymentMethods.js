// Satu sumber data buat semua metode pembayaran yang didukung.
// Dulu list ini ke-copy manual di Step2, Step3, dan (sekarang) halaman
// Profile/PaymentMethods -> gampang beda-beda & typo. Sekarang cukup di sini,
// yang lain tinggal import.
export const PAYMENT_METHODS = [
  { id: "bca", icon: "🏦", label: "Virtual Account BCA" },
  { id: "bni", icon: "🏦", label: "Virtual Account BNI" },
  { id: "card", icon: "💳", label: "Kartu Kredit / Debit" },
  { id: "gopay", icon: "📱", label: "GoPay" },
  { id: "ovo", icon: "📱", label: "OVO" },
  { id: "dana", icon: "📱", label: "Dana" },
];

// id -> label, buat ditampilin di Step3/Success/riwayat tanpa nulis object baru tiap kali
export const PAYMENT_METHOD_LABELS = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m.label]),
);
