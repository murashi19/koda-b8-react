import * as yup from "yup";

export const editProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama terlalu panjang")
    .required("Nama wajib diisi"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),

  telepon: yup
    .string()
    .matches(/^(\+62|62|0)[0-9]{9,13}$/, "Nomor telepon tidak valid")
    .nullable(),

  tanggalLahir: yup
    .date()
    .max(new Date(), "Tanggal lahir tidak valid")
    .nullable(),

  jenisKelamin: yup
    .string()
    .oneOf(["laki-laki", "perempuan"], "Pilih jenis kelamin yang valid")
    .nullable(),
});
