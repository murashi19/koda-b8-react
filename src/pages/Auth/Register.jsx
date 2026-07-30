import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../services/validations/registerSchema";
// import useLocalStorage from "../../hooks/useLocalStorage";

import { CircleCheckBig, User, Lock, Mail, ArrowRight } from "lucide-react";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";
import { Link } from "react-router-dom";
import BgImage from "../../assets/img-regis.jpg";
import Logo from "../../assets/logo.svg";
import api from "../../api/axios";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "all",
  });

  async function processRegister(data) {
    try {
      await api.post("/auth/register", {
        full_name: data.name,
        email: data.email,
        password: data.password,
      });

      reset();

      navigate("/auth/login", {
        state: {
          full_name: data.name,
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Email sudah terdaftar");
        return;
      }
    }
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel: hidden on mobile, visible lg+ ── */}
      <div
        className="hidden lg:flex w-full lg:w-1/2 min-h-screen p-10 xl:p-16 bg-cover bg-center flex-col"
        style={{
          backgroundImage: `linear-gradient(rgba(20,73,230,0.85),rgba(49,44,133,0.85)), url(${BgImage})`,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          <img src={Logo} alt="Logo BeliMudah" className="w-13 h-13" />
          <span className="font-semibold text-white text-xl xl:text-2xl whitespace-nowrap">
            BeliMudah
          </span>
        </div>

        {/* Tagline + benefits */}
        <div className="flex flex-col justify-center my-auto text-white">
          <h1 className="text-3xl xl:text-5xl font-bold mb-8 leading-tight">
            Bergabung dengan 500.000+ pelanggan puas
          </h1>

          <ul className="flex flex-col gap-4 text-base xl:text-lg">
            {[
              "Akses ribuan produk dengan harga terbaik",
              "Lacak pesanan secara real-time",
              "Simpan wishlist & alamat favorit",
              "Dapatkan notifikasi promo eksklusif",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CircleCheckBig className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-gray-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-300 mt-auto">
          © 2026 BeliMudah. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 sm:px-10 md:px-16 lg:px-10 xl:px-20">
        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8 self-start">
          <img src={Logo} alt="Logo BeliMudah" className="w-9 h-9" />
          <span className="font-semibold text-blue-600 text-xl">BeliMudah</span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Heading */}
          <div className="mb-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
              Buat Akun Baru
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sudah punya akun?{" "}
              <Link
                className="ml-1 text-blue-600 font-medium hover:underline"
                to="/auth/login"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Social register */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 text-sm text-gray-600 rounded-xl border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Daftar via Google
            </button>
            <button
              type="button"
              className="flex-1 text-sm text-gray-600 rounded-xl border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Daftar via Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 whitespace-nowrap">
              atau daftar dengan email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form
            id="register-form"
            onSubmit={handleSubmit(processRegister)}
            className="flex flex-col gap-3"
          >
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type="text"
                  id="name"
                  placeholder="Nama lengkap kamu"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type="email"
                  id="email"
                  placeholder="email@contoh.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Minimal 6 karakter"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="shrink-0"
                >
                  {showPassword ? (
                    <PiEyeBold className="w-4 h-4 text-gray-400" />
                  ) : (
                    <PiEyeClosed className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Ulangi kata sandi"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="shrink-0"
                >
                  {showConfirmPassword ? (
                    <PiEyeBold className="w-4 h-4 text-gray-400" />
                  ) : (
                    <PiEyeClosed className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 cursor-pointer rounded border-gray-300 shrink-0"
              />
              <span>
                Saya menyetujui{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Syarat &amp; Ketentuan
                </span>{" "}
                dan{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Kebijakan Privasi
                </span>{" "}
                BeliMudah
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl py-3 font-medium transition-colors mt-1"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>Data kamu aman dan terenkripsi</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
