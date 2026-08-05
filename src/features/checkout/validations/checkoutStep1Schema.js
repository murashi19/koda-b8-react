import * as yup from "yup";

export const checkoutStep1Schema = yup.object({
    nama: yup
        .string()
        .trim()
        .min(3, "Nama minimal 3 karakter")
        .required("Nama penerima wajib diisi"),

    telepon: yup
        .string()
        .matches(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid")
        .required("Nomor telepon wajib diisi"),

    email: yup
        .string()
        .trim()
        .lowercase()
        .email("Format email tidak valid")
        .required("Email wajib diisi"),

    alamat: yup
        .string()
        .trim()
        .min(5, "Alamat terlalu pendek")
        .required("Alamat lengkap wajib diisi"),

    kota: yup
        .string()
        .trim()
        .required("Kota wajib diisi"),

    provinsi: yup
        .string()
        .trim()
        .required("Provinsi wajib diisi"),

    kodePos: yup
        .string()
        .matches(/^[0-9]{5}$/, "Kode pos harus 5 digit angka")
        .required("Kode pos wajib diisi"),

    catatan: yup
        .string()
        .nullable(),
});