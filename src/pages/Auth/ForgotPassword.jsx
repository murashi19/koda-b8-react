import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import BgImage from "@/assets/img-forgot.jpg";
function ForgotPassword() {
  return (
    <>
      <div className="h-screen flex justify-between">
        <div
          className="w-1/2 h-full p-30 bg-cover bg-center flex flex-col"
          style={{
            backgroundImage: `linear-gradient(rgba(37,99,235,0.85),rgba(15,23,42,0.9)), url(${BgImage})`,
          }}
        >
          <div className="w-140 cursor-pointer">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <img src={Logo} alt="Logo BeliMudah" className="w-12 h-12" />
              <span className="flex justify-center items-center font-semibold text-white text-2xl whitespace-nowrap">
                BeliMudah
              </span>
            </div>
          </div>
          <div className="w-md flex flex-col justify-center my-auto mx-0 text-white">
            <div className="w-18 h-18 flex rounded-lg justify-center items-center p-3 bg-[#FFFFFF1A] mb-5">
              <span className="text-5xl">🔐</span>
            </div>
            <div className="text-5xl font-bold  mb-5">
              Akun kamu aman bersama kami
            </div>
            <div className="flex justify-center items-center text-lg">
              Kami menggunakan enkripsi tingkat militer untuk menjaga keamanan
              data dan transaksimu.
            </div>

            <div className="flex flex-col justify-center items-start gap-5 mt-5 text-2xl">
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
          <div className="text-lg text-text-secondary flex justify-start mt-auto">
            © 2026 BeliMudah. Seluruh hak cipta dilindungi.
          </div>
        </div>
        <div className="w-1/2 h-full p-30 flex flex-col justify-center items-center">
          <div className="w-2/3 flex flex-col gap-4 justify-center items-start mb-10">
            <Link
              to="/auth/login"
              className="flex justify-between gap-4 items-center "
            >
              <ArrowLeft />
              <span> Kembali ke Login </span>
            </Link>
            <div className="w-full flex flex-col justify-center items-start gap-2 mt-4 mb-2">
              <div className="text-3xl font-bold text-black ">
                Lupa Kata Sandi?
              </div>
              <div className="text-xl text-text-secondary mb-1">
                Tidak perlu khawatir. Masukkan email yang terdaftar dan kami
                akan mengirimkan tautan untuk membuat kata sandi baru.
              </div>
            </div>

            <form
              id="form-forgot"
              action=""
              className="w-full flex flex-col justify-center gap-8"
            >
              <div className="w-full flex flex-col gap-1 ">
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
                    placeholder="email.@contoh.com"
                  />
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center bg-primary rounded-lg p-3 hover:bg-primary-dark gap-3 cursor-pointer">
                <Send className="w-5 h-5 text-white" />
                <button
                  className="text-md text-white justify-center items-center font-md border-none"
                  type="submit"
                >
                  Kirim Tautan Reset
                </button>
              </div>

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

              <div className="flex justify-center items-center text-center text-md  mb-1 gap-2">
                <span className="flex justify-center items-center text-center">
                  Ingat kata sandi kamu?
                </span>
                <span>
                  <Link className="text-primary" to="/auth/login">
                    Masuk sekarang{" "}
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
