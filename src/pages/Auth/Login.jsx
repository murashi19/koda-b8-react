import { useState, useEffect } from "react";

// react-dom
import { useNavigate, Link, useLocation } from "react-router-dom";

// Hooks
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/features/auth/validations/loginSchema";

// Redux
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";

// react-icons
import { Lock, Mail, SquareArrowRightEnter } from "lucide-react";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";

// Images
import BgImage from "@/assets/img-login.jpg";
import Logo from "@/assets/logo.svg";
import api from "@/lib/axios";
import toast from "react-hot-toast";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "all",
  });
  useEffect(() => {
    if (location.state) {
      setValue("email", location.state.email);
      setValue("password", location.state.password);
    }
  }, [location.state, setValue]);

  async function processLogin(data) {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
        role: data.role,
      });

      const user = response.data.result;
      const token = response.data.token;

      // Simpan ke redux toolkit & persist
      dispatch(
        login({
          token: token,
          user,
        }),
      );

      toast.success(`Selamat datang, ${user.full_name || user.email}!`);

      // Redirect berdasarkan role
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email atau password salah");
      console.error(error);
    }
  }

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel: hidden on mobile, shown md+ ── */}
      <div
        className="hidden md:flex w-full lg:w-1/2 min-h-70 lg:min-h-screen p-8 lg:p-16 bg-cover bg-center flex-col"
        style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.88),rgba(15,23,42,0.92)), url(${BgImage})`,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          <img
            src={Logo}
            alt="Logo BeliMudah"
            className="w-10 h-10 lg:w-12 lg:h-12"
          />
          <span className="font-semibold text-white text-xl lg:text-2xl whitespace-nowrap">
            BeliMudah
          </span>
        </div>

        {/* Tagline */}
        <div className="flex flex-col justify-center my-auto text-white">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-8 leading-tight">
            Belanja lebih mudah, hidup lebih praktis
          </h1>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed">
            Ribuan produk pilihan dengan harga terbaik, pengiriman cepat, dan
            pembayaran yang aman.
          </p>

          {/* Stats */}
          <div className="flex gap-8 lg:gap-10 mt-8 lg:mt-10">
            <div className="flex flex-col gap-1">
              <span className="text-xl lg:text-2xl font-bold">10rb+</span>
              <span className="text-sm lg:text-base text-white/80">Produk</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl lg:text-2xl font-bold">500rb+</span>
              <span className="text-sm lg:text-base text-white/80">
                Pelanggan
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl lg:text-2xl font-bold">4.8★</span>
              <span className="text-sm lg:text-base text-white/80">Rating</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary mt-auto">
          © 2026 BeliMudah. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 sm:px-10 md:px-16 lg:px-20 xl:px-28">
        {/* Mobile-only logo */}
        <div className="flex md:hidden items-center gap-2 mb-8 self-start">
          <img src={Logo} alt="Logo BeliMudah" className="w-9 h-9" />
          <span className="font-semibold text-primary text-xl">BeliMudah</span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Heading */}
          <div className="mb-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-1">
              Masuk Akun
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Belum punya akun?{" "}
              <Link
                className="ml-1 text-primary font-medium hover:underline"
                to="/auth/register"
              >
                Daftar gratis
              </Link>
            </p>
          </div>

          {/* Social login */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 text-sm text-text-secondary rounded-xl border border-border py-2.5 hover:bg-surface transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              className="flex-1 text-sm text-text-secondary rounded-xl border border-border py-2.5 hover:bg-surface transition-colors"
            >
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-text-secondary whitespace-nowrap">
              atau masuk dengan email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form
            id="form-login"
            onSubmit={handleSubmit(processLogin)}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <div className="flex items-center gap-3 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light transition-all">
                <Mail className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type="email"
                  id="email"
                  placeholder="email@contoh.com"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-text-primary"
                >
                  Kata Sandi
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="flex items-center gap-3 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light transition-all">
                <Lock className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  className="w-full outline-none border-none text-sm bg-transparent"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Masukkan kata sandi"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="shrink-0"
                >
                  {showPassword ? (
                    <PiEyeBold className="w-4 h-4 text-text-secondary" />
                  ) : (
                    <PiEyeClosed className="w-4 h-4 text-text-secondary" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-border cursor-pointer"
              />
              Ingat saya selama 30 hari
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:bg-primary-dark text-white rounded-xl py-3 font-medium transition-colors"
            >
              <SquareArrowRightEnter className="w-4 h-4" />
              Masuk
            </button>
          </form>

          {/* Footer notes */}
          <p className="text-xs text-center text-text-secondary flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>Login aman dengan enkripsi SSL 256-bit</span>
          </p>
          <p className="text-xs text-center text-text-secondary">
            Dengan masuk, kamu menyetujui{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Syarat &amp; Ketentuan
            </span>{" "}
            dan{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Kebijakan Privasi
            </span>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
