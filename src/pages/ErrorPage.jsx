import { Link, useRouteError } from "react-router-dom";

import { useSelector } from "react-redux";

export default function ErrorPage() {
  const error = useRouteError();
  const auth = useSelector((state) => state.auth.user);
  const homePath = auth ? "/admin/dashboard" : "/";

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6">
        <h1 className="text-8xl font-bold text-orange-500">404</h1>
        <h2 className="mt-4 text-3xl font-semibold">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-text-secondary text-center">
          URL yang Anda tuju tidak tersedia.
        </p>
        {error?.statusText && (
          <p className="mt-2 text-red-500 text-sm">{error.statusText}</p>
        )}
        <Link
          to={homePath}
          className="mt-8 px-6 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </>
  );
}
