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
    .min(8, "Kata sandi minimal 8 karakter")
    .matches(/[a-zA-Z]/, "Kata sandi harus memiliki huruf")
    .matches(/\d/, "Kata sandi harus memiliki angka")
    .required("Kata sandi wajib diisi"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Konfirmasi kata sandi tidak cocok")
    .required("Konfirmasi kata sandi wajib diisi"),

  acceptTerms: yup
    .boolean()
    .oneOf([true], "Kamu perlu menyetujui syarat dan kebijakan privasi"),
});
