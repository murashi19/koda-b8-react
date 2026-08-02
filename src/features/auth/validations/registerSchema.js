import * as yup from "yup";

export const registerSchema = yup.object({
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

    password: yup
        .string()
        .min(6, "Password minimal 6 karakter")
        .required("Password wajib diisi"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Konfirmasi password tidak cocok")
        .required("Konfirmasi password wajib diisi"),
});