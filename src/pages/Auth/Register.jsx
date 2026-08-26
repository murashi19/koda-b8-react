import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";
import toast from "react-hot-toast";

import { registerSchema } from "@/features/auth/validations/registerSchema";
import api from "@/lib/axios";
import BgImage from "@/assets/img-regis.jpg";
import Logo from "@/assets/logo.svg";

const benefits = [
  "Akses ribuan produk dengan harga terbaik",
  "Lacak pesanan secara real-time",
  "Simpan wishlist & alamat favorit",
  "Dapatkan notifikasi promo eksklusif",
];

const fieldClass = (hasError) =>
  `group flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-all focus-within:ring-4 ${
    hasError
      ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-50"
      : "border-border hover:border-slate-300 focus-within:border-primary focus-within:ring-primary-light"
  }`;

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: "password" });
  const passwordChecks = [
    { label: "6+ karakter", valid: password.length >= 6 },
    { label: "Ada huruf", valid: /[a-zA-Z]/.test(password) },
    { label: "Ada angka", valid: /\d/.test(password) },
  ];

  async function processRegister(data) {
    try {
      await api.post("/auth/register", {
        full_name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      toast.success(`Akun ${data.name.trim()} berhasil dibuat!`);
      navigate("/auth/login", {
        replace: true,
        state: { email: data.email.trim().toLowerCase() },
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Pendaftaran gagal. Coba lagi.";

      if (error.response?.status === 409) {
        setError(
          "email",
          { type: "server", message: "Email sudah terdaftar" },
          { shouldFocus: true },
        );
      }

      toast.error(message);
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section
        className="relative hidden min-h-screen overflow-hidden bg-cover bg-center p-10 text-white lg:flex lg:flex-col xl:p-16"
        style={{ backgroundImage: `url(${BgImage})` }}
        aria-label="Keunggulan BeliMudah"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-700/95 via-blue-800/90 to-slate-950/95" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

        <Link
          to="/"
          className="relative z-10 flex w-fit items-center gap-3"
          aria-label="Kembali ke beranda BeliMudah"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <img src={Logo} alt="" className="h-8 w-8" />
          </span>
          <span className="text-2xl font-semibold tracking-tight">BeliMudah</span>
        </Link>

        <div className="relative z-10 my-auto max-w-xl">
          <h1 className="font-display text-4xl font-bold leading-tight xl:text-5xl">
            Bergabung dengan 500.000+ pelanggan puas
          </h1>

          <ul className="mt-9 grid gap-4">
            {benefits.map((item) => (
              <li key={item} className="flex items-center gap-3 text-blue-50">
                <CircleCheckBig className="h-5 w-5 shrink-0 text-orange-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-blue-200">
          © 2026 BeliMudah. Seluruh hak cipta dilindungi.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-surface px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
        <div className="w-full max-w-lg">
          <Link
            to="/"
            className="mb-8 flex w-fit items-center gap-2.5 lg:hidden"
            aria-label="Kembali ke beranda BeliMudah"
          >
            <img src={Logo} alt="" className="h-9 w-9" />
            <span className="text-xl font-semibold text-primary">BeliMudah</span>
          </Link>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-7">
              <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Buat Akun Baru
              </h2>
              <p className="mt-2 text-sm text-text-secondary sm:text-base">
                Sudah punya akun?{" "}
                <Link
                  className="font-semibold text-primary hover:text-primary-dark hover:underline"
                  to="/auth/login"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>

            <form
              onSubmit={handleSubmit(processRegister)}
              className="space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Nama lengkap
                </label>
                <div className={fieldClass(errors.name)}>
                  <User className="h-4.5 w-4.5 shrink-0 text-text-secondary group-focus-within:text-primary" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Email
                </label>
                <div className={fieldClass(errors.email)}>
                  <Mail className="h-4.5 w-4.5 shrink-0 text-text-secondary group-focus-within:text-primary" />
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Kata sandi
                </label>
                <div className={fieldClass(errors.password)}>
                  <Lock className="h-4.5 w-4.5 shrink-0 text-text-secondary group-focus-within:text-primary" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Buat kata sandi"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-hint password-error"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    aria-pressed={showPassword}
                    className="rounded-md p-1 text-text-secondary hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {showPassword ? (
                      <PiEyeBold className="h-4.5 w-4.5" />
                    ) : (
                      <PiEyeClosed className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.password.message}
                  </p>
                )}
                <div
                  id="password-hint"
                  className="mt-2 flex flex-wrap gap-x-4 gap-y-1"
                >
                  {passwordChecks.map((check) => (
                    <span
                      key={check.label}
                      className={`flex items-center gap-1 text-xs ${
                        check.valid ? "text-emerald-600" : "text-text-secondary"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {check.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Konfirmasi kata sandi
                </label>
                <div className={fieldClass(errors.confirmPassword)}>
                  <Lock className="h-4.5 w-4.5 shrink-0 text-text-secondary group-focus-within:text-primary" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ulangi kata sandi"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi kata sandi"
                        : "Tampilkan konfirmasi kata sandi"
                    }
                    aria-pressed={showConfirmPassword}
                    className="rounded-md p-1 text-text-secondary hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {showConfirmPassword ? (
                      <PiEyeBold className="h-4.5 w-4.5" />
                    ) : (
                      <PiEyeClosed className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-text-secondary">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={
                      errors.acceptTerms ? "terms-error" : undefined
                    }
                    {...register("acceptTerms")}
                  />
                  <span>
                    Saya menyetujui{" "}
                    <a
                      href="#terms"
                      className="font-medium text-primary hover:underline"
                    >
                      Syarat &amp; Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a
                      href="#privacy"
                      className="font-medium text-primary hover:underline"
                    >
                      Kebijakan Privasi
                    </a>
                    .
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p
                    id="terms-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
                    Membuat akun...
                  </>
                ) : (
                  <>
                    Daftar sekarang
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-text-secondary">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Data kamu diproses dengan aman
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
