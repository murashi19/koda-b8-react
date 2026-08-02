# Ringkasan Refactor — BeliMudah

Refactor ini fokus di 2 hal besar: **struktur folder** dan **state management**.
Semua perubahan sudah dicek: `npm run build` sukses, `npm run lint` bersih (0 error).

## 1. Struktur folder baru (feature-based)

Sebelumnya semua komponen ditumpuk rata di `components/`, `pages/`, `hooks/`, `data/`
tanpa pengelompokan. Sekarang dikelompokkan per fitur:

```
src/
  app/            <- App.jsx, store.js, rootReducer.js (setup aplikasi)
  components/
    common/       <- komponen kecil yang dipakai di mana saja (Button, StarRating, LoginModal)
    layout/       <- Header, Footer (bagian "bingkai" tiap halaman)
  features/
    auth/         <- authSlice.js, useAuth.js, validasi login/register
    cart/         <- useCart.js
    wishlist/     <- useWishlist.js
    modal/        <- modalSlice.js, useModal.js
    products/     <- ProductCard, filter produk, data produk
    checkout/     <- OrderSummary, ProgressBar, validasi checkout
    orders/       <- ordersSlice.js (+ thunk placeOrder)
    profile/      <- halaman profil & alamat
    admin/        <- semua yang khusus admin (sidebar, dashboard, dll)
    landing/      <- section-section landing page
  pages/          <- tetap sama, cuma "merakit" komponen dari features/
  lib/            <- axios.js (dulu di api/)
  hooks/          <- cuma hook generik yang benar-benar dipakai lintas fitur
```

**Kenapa begini?** Kalau mau ubah sesuatu soal "cart", kamu tinggal buka
`features/cart/`, gak perlu nebak-nebak file mana yang relevan di antara
puluhan file yang di-flatten.

Semua import path sekarang pakai alias `@/...` (contoh: `@/features/cart/useCart`)
supaya gak ada lagi `../../../../` yang bikin pusing kalau file dipindah.

## 2. State management: Redux jadi satu-satunya sumber

**Masalah sebelumnya:** ada 2 sistem state sekaligus — Redux (auth, products,
dashboard) *dan* React Context (Auth/Cart/Wishlist/Modal) — padahal Context-nya
cuma pembungkus tipis yang sebenarnya nyimpen semua logic bisnis (`addToCart`,
`toggleWishlist`, `placeOrder`, dst) langsung di `App.jsx`. Efeknya `App.jsx`
jadi ratusan baris "God Component".

**Sekarang:**
- Logic cart & wishlist pindah ke `authSlice.js` (karena memang datanya nempel
  di data user yang login)
- Modal login pindah ke `modalSlice.js`
- Order pindah ke `ordersSlice.js`, plus ada **thunk** `placeOrder` yang
  ngurus 2 hal sekaligus: nyimpen order baru & ngosongin cart — ini pola
  standar Redux Toolkit kalau satu aksi user perlu nyentuh 2 slice.
- `App.jsx` sekarang cuma ~15 baris: setup `<Provider>` dan router, titik.
- Ada 4 hook custom yang gantiin Context lama, dan sengaja API-nya sama
  persis biar gampang dipahami: `useAuth()`, `useCart()`, `useWishlist()`,
  `useModal()`.

**Bug yang ikut kebetulan ketemu & dibetulkan:** dulu pesanan customer
(`placeOrder`) ditulis manual ke `localStorage`, sementara halaman admin
(`OrderList`) cuma nampilin data mock yang gak pernah nyambung ke pesanan
asli. Sekarang keduanya baca dari `ordersSlice` yang sama.

## 3. Bersih-bersih lain
- `data/Admin/NavItemss.js` (typo double-s) → `navItems.js`
- File mock yang gak dipakai dihapus: `data/wishlist.js`, `data/addressList.js`
- State `avatarFile` yang gak pernah dipakai di `EditProfile.jsx` dihapus
  (ini nongol sebagai error waktu lint)

## Yang sengaja TIDAK diubah (di luar scope refactor ini)
- Ada inkonsistensi kosakata status order antar halaman (`OrderList` admin
  pakai `pending/packed/shipped/delivered`, `OrderCard` customer cuma cek
  `status === "sent"`). Ini bug logic lama, bukan soal struktur/state — saya
  kasih fallback biar gak crash, tapi belum saya rapikan penuh.
- `ProfileSidebar.jsx` menghitung jumlah wishlist dari
  `useLocalStorage("wishlist")`, padahal wishlist aslinya ada di Redux
  (`auth.user.wishlist`). Kelihatannya sudah salah dari awal (localStorage
  key itu gak pernah ditulis di mana pun), jadi statistiknya kemungkinan
  selalu nunjukin 0. Perlu dicek ulang maksud aslinya sebelum dibetulkan.
- Bundle size warning (`index.js` ~999 kB) dari Vite — soal code-splitting,
  bukan soal kerapian kode. Bisa dibereskan lain waktu dengan `React.lazy()`
  per halaman kalau perlu.
