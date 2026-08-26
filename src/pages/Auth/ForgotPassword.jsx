import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Logo from "@/assets/logo.svg";
import BgImage from "@/assets/img-forgot.jpg";

import {
  forgotPassword,
  resetPassword,
  clearForgotPasswordState,
  clearResetPasswordState,
} from "@/features/auth/authSlice";

function ForgotPassword() {
  const initialResetToken =
    new URLSearchParams(window.location.search).get("token") || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    forgotPasswordLoading,
    forgotPasswordError,
    forgotPasswordSuccess,
    resetPasswordLoading,
    resetPasswordError,
    resetPasswordSuccess,
  } = useSelector((state) => state.auth);
  const [step, setStep] = useState(initialResetToken ? 2 : 1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    dispatch(clearForgotPasswordState());
    dispatch(clearResetPasswordState());

    return () => {
      dispatch(clearForgotPasswordState());
      dispatch(clearResetPasswordState());
    };
  }, [dispatch]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const result = await dispatch(forgotPassword(normalizedEmail));
    if (forgotPassword.fulfilled.match(result)) {
      const token = result.payload?.data?.resetToken;
      if (token) {
        setResetToken(token);
        setStep(2);
      } else {
        setEmailSent(true);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return;
    }

    if (password.length < 12) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    const result = await dispatch(
      resetPassword({
        token: resetToken,
        password,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setPassword("");
    setConfirmPassword("");
    setResetToken("");
    setEmailSent(false);
    dispatch(clearForgotPasswordState());
    dispatch(clearResetPasswordState());
  };

  return (
    <div className="h-screen flex justify-between">
      {/* LEFT SIDE */}
      <div
        className="w-1/2 h-full p-30 bg-cover bg-center flex flex-col"
        style={{
          backgroundImage: `linear-gradient(
            rgba(37,99,235,0.85),
            rgba(15,23,42,0.9)
          ), url(${BgImage})`,
        }}
      >
        {/* LOGO */}
        <div className="w-140 cursor-pointer">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <img src={Logo} alt="Logo BeliMudah" className="w-12 h-12" />

            <span className="flex justify-center items-center font-semibold text-white text-2xl whitespace-nowrap">
              BeliMudah
            </span>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="w-md flex flex-col justify-center my-auto mx-0 text-white">
          <div className="w-18 h-18 flex rounded-lg justify-center items-center p-3 bg-[#FFFFFF1A] mb-5">
            <span className="text-2xl text-center">
              {step === 1 ? "🔐" : "🔑"}
            </span>
          </div>

          <div className="text-3xl font-bold mb-5">
            {step === 1
              ? "Akun kamu aman bersama kami"
              : "Buat kata sandi baru"}
          </div>

          <div className="flex justify-center items-center text-lg">
            {step === 1
              ? "Kami menggunakan enkripsi tingkat militer untuk menjaga keamanan data dan transaksimu."
              : "Gunakan kata sandi yang kuat untuk menjaga keamanan akun BeliMudah kamu."}
          </div>

          <div className="flex flex-col justify-center items-start gap-5 mt-5 text-xl">
            <div className="text-center">
              <span className="font-semibold">🔒 Enkripsi SSL 256-bit</span>
            </div>

            <div className="text-center">
              <span className="font-semibold">
                🛡️ Perlindungan data pribadi
              </span>
            </div>

            <div className="text-center">
              <span className="font-semibold">📧 Verifikasi dua langkah</span>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-lg text-text-secondary flex justify-start mt-auto">
          © 2026 BeliMudah. Seluruh hak cipta dilindungi.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 h-full p-30 flex flex-col justify-center items-center">
        <div className="w-2/3 flex flex-col gap-4 justify-center items-start mb-10">
          {/* BACK */}
          <button
            type="button"
            onClick={
              step === 1 ? () => navigate("/auth/login") : handleBackToEmail
            }
            className="flex justify-between gap-4 items-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />

            <span>{step === 1 ? "Kembali ke Login" : "Kembali"}</span>
          </button>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="w-full flex flex-col justify-center items-start gap-2 mt-4 mb-2">
                <div className="text-2xl font-bold text-black">
                  Lupa Kata Sandi?
                </div>
                <div className="text-lg text-text-secondary mb-1">
                  Tidak perlu khawatir. Masukkan email yang terdaftar dan kami
                  akan mengirimkan tautan untuk membuat kata sandi baru.
                </div>
              </div>
              <form
                onSubmit={handleForgotPassword}
                className="w-full flex flex-col justify-center gap-8"
              >
                {/* EMAIL */}
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="email" className="text-lg">
                    Alamat Email
                  </label>
                  <div className="w-full flex items-center gap-3 border border-border rounded-lg p-2">
                    <Mail className="w-5 h-5 text-text-secondary" />
                    <input
                      className="w-full outline-hidden"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="email@contoh.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* ERROR */}
                {forgotPasswordError && (
                  <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">
                    {forgotPasswordError}
                  </div>
                )}

                {forgotPasswordSuccess && emailSent && (
                  <div className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    Tautan reset sudah dikirim. Periksa inbox atau folder spam
                    email kamu.
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full flex justify-center items-center bg-primary rounded-lg p-3 hover:bg-primary-dark gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-md text-white font-medium">
                        Memproses...
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-white" />
                      <span className="text-md text-white font-medium">
                        Kirim Tautan Reset
                      </span>
                    </>
                  )}
                </button>

                {/* TIPS */}
                <div className="w-full flex flex-col gap-3 bg-border rounded-lg px-10 py-5">
                  <div className="text-xl font-bold">💡 Tips keamanan:</div>

                  <ul className="text-text-primary list-disc list-inside">
                    <li className="mb-1">
                      Pastikan kamu memeriksa folder spam/junk email
                    </li>
                    <li className="mb-1">
                      Tautan reset hanya berlaku selama 30 menit
                    </li>
                    <li className="mb-1">
                      Jangan bagikan tautan reset kepada siapapun
                    </li>
                  </ul>
                </div>

                {/* LOGIN */}
                <div className="flex justify-center items-center text-center text-md mb-1 gap-2">
                  <span>Ingat kata sandi kamu?</span>
                  <Link className="text-primary" to="/auth/login">
                    Masuk sekarang
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="w-full flex flex-col justify-center items-start gap-2 mt-4 mb-2">
                <div className="text-3xl font-bold text-black">
                  Buat Kata Sandi Baru
                </div>
                <div className="text-xl text-text-secondary mb-1">
                  Buat kata sandi baru untuk akun:
                </div>
                <div className="text-lg font-semibold text-primary">
                  {email}
                </div>
              </div>
              <form
                onSubmit={handleResetPassword}
                className="w-full flex flex-col justify-center gap-6"
              >
                {/* PASSWORD */}
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="password" className="text-lg">
                    Kata Sandi Baru
                  </label>
                  <div className="w-full flex items-center gap-3 border border-border rounded-lg p-2">
                    <Lock className="w-5 h-5 text-text-secondary" />
                    <input
                      className="w-full outline-hidden"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Masukkan kata sandi baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-text-secondary" />
                      ) : (
                        <Eye className="w-5 h-5 text-text-secondary" />
                      )}
                    </button>
                  </div>
                  <span className="text-sm text-text-secondary">
                    Minimal 8 karakter
                  </span>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="confirmPassword" className="text-lg">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="w-full flex items-center gap-3 border border-border rounded-lg p-2">
                    <Lock className="w-5 h-5 text-text-secondary" />
                    <input
                      className="w-full outline-hidden"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Ulangi kata sandi baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-text-secondary" />
                      ) : (
                        <Eye className="w-5 h-5 text-text-secondary" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PASSWORD MISMATCH */}
                {confirmPassword && password !== confirmPassword && (
                  <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">
                    Konfirmasi password tidak sama.
                  </div>
                )}

                {/* ERROR */}
                {resetPasswordError && (
                  <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">
                    {resetPasswordError}
                  </div>
                )}

                {/* SUCCESS */}
                {resetPasswordSuccess && (
                  <div className="w-full rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />

                    <span>
                      Password berhasil diubah. Mengarahkan ke halaman login...
                    </span>
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={
                    resetPasswordLoading ||
                    password.length < 8 ||
                    password !== confirmPassword
                  }
                  className="w-full flex justify-center items-center bg-primary rounded-lg p-3 hover:bg-primary-dark gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetPasswordLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-md text-white font-medium">
                        Menyimpan...
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 text-white" />
                      <span className="text-md text-white font-medium">
                        Ubah Kata Sandi
                      </span>
                    </>
                  )}
                </button>

                {/* LOGIN */}
                <div className="flex justify-center items-center text-center text-md mb-1 gap-2">
                  <span>Sudah ingat kata sandi?</span>
                  <Link className="text-primary" to="/auth/login">
                    Masuk sekarang
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
