import { useState, useEffect } from "react";

// react-dom
import { useNavigate, Link, useLocation } from "react-router-dom";

// Hooks
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../services/validations/loginSchema";
// import useLocalStorage from "../../hooks/useLocalStorage";

// Context
// import AuthContext from "../../context/AuthContext";

// Redux
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/auth";

// react-icons
import { Lock, Mail, SquareArrowRightEnter } from "lucide-react";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";

// Images
import BgImage from "../../assets/img-login.jpg";
import Logo from "../../assets/logo.svg";
import api from "../../api/axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  //const { setAuth } = useContext(AuthContext);
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
      });
      const { token, user } = response.data.result;

      dispatch(
        login({
          token: token,
          user,
        }),
      );

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Email atau password salah");
      console.log(error);
    }
  }

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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
        <p className="text-sm text-white mt-auto">
          © 2026 BeliMudah. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 sm:px-10 md:px-16 lg:px-20 xl:px-28">
        {/* Mobile-only logo */}
        <div className="flex md:hidden items-center gap-2 mb-8 self-start">
          <img src={Logo} alt="Logo BeliMudah" className="w-9 h-9" />
          <span className="font-semibold text-blue-600 text-xl">BeliMudah</span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Heading */}
          <div className="mb-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Masuk Akun
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Belum punya akun?{" "}
              <Link
                className="ml-1 text-blue-600 font-medium hover:underline"
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
              className="flex-1 text-sm text-gray-600 rounded-xl border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              className="flex-1 text-sm text-gray-600 rounded-xl border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 whitespace-nowrap">
              atau masuk dengan email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
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
                  className="text-sm font-medium text-gray-700"
                >
                  Kata Sandi
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs sm:text-sm text-blue-600 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
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

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-gray-300 cursor-pointer"
                required
              />
              Ingat saya selama 30 hari
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl py-3 font-medium transition-colors"
            >
              <SquareArrowRightEnter className="w-4 h-4" />
              Masuk
            </button>
          </form>

          {/* Footer notes */}
          <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>Login aman dengan enkripsi SSL 256-bit</span>
          </p>
          <p className="text-xs text-center text-gray-400">
            Dengan masuk, kamu menyetujui{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Syarat &amp; Ketentuan
            </span>{" "}
            dan{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
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
