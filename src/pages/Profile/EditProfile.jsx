<<<<<<< HEAD
import { useState, useEffect, useContext } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema } from "../../services/validations/editProfileSchema";

import AuthContext from "../../context/AuthContext";
=======
import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema } from "@/features/profile/validations/editProfileSchema";

import useAuth from "@/features/auth/useAuth";
>>>>>>> feat/newVersion

import { Camera } from "lucide-react";

// Components
<<<<<<< HEAD
import Header from "../../components/Header";
import ButtonMessage from "../../components/ButtonMessage";
import Footer from "../../components/Footer";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";

const inputClass = "w-full rounded-lg border border-black/10 bg-gray-100 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-[#1a73e8] transition-colors";
const labelClass = "text-sm font-medium text-gray-900";

export default function EditProfile() {
	const { auth, updateAuth } = useContext(AuthContext);
	const [selectedImage, setSelectedImage] = useState(auth?.image || "");

	const [notification, setNotification] = useState({
		type: "",
		message: "",
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(editProfileSchema),
	});
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const d = new Date(dateString);
		if (isNaN(d.getTime())) return ""; // Mencegah error jika data tanggal tidak valid

		const thn = d.getFullYear();
		const bln = String(d.getMonth() + 1).padStart(2, "0");
		const tgl = String(d.getDate()).padStart(2, "0");

		return `${thn}-${bln}-${tgl}`; // Menghasilkan yyyy-mm-dd
	};

	// Isi form dari data auth yang sedang login
	useEffect(() => {
		if (auth) {
			reset({
				name: auth.name || "",
				email: auth.email || "",
				telepon: auth.telepon || "",
				tanggalLahir: formatDate(auth.tanggalLahir) || "",
				jenisKelamin: auth.jenisKelamin || "",
			});
		}
	}, [auth, auth.email, reset]);

	const handleSave = (data) => {
		try {
			updateAuth({
				name: data.name,
				email: data.email,
				image: selectedImage,
				telepon: data.telepon,
				tanggalLahir: data.tanggalLahir,
				jenisKelamin: data.jenisKelamin,
			});

			// alert("Profile berhasil diperbarui");
			setNotification({
				type: "success",
				message: "Profile berhasil diperbarui",
			});
		} catch (error) {
			console.error(error);
			// alert("Gagal memperbarui profile");
			setNotification({
				type: "error",
				message: `${error} = Gagal memperbarui profile`,
			});
		}
	};
	useEffect(() => {
		if (!notification.message) return;

		const timer = setTimeout(() => {
			setNotification({
				type: "",
				message: "",
			});
		}, 3000);

		return () => clearTimeout(timer);
	}, [notification]);

	const character = auth?.name?.charAt(0).toUpperCase();
	const handleImageChange = (e) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const reader = new FileReader();

		reader.onload = () => {
			setSelectedImage(reader.result);
		};

		reader.readAsDataURL(file);
	};

	return (
		<>
			<Header />
			<ButtonMessage />
			<main className='min-h-screen max-w-[1728px] mx-auto'>
				<div className='max-w-6xl mx-auto grid grid-cols-4 gap-8 px-4 py-8'>
					<ProfileSidebar activeNav='settings' />

					<div className='col-span-3 flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-5'>
						{/* Heading */}
						<div className='flex items-center justify-between gap-4'>
							<h2 className='text-2xl font-semibold text-gray-900'>Pengaturan Profile</h2>
							<button
								type='submit'
								form='edit-profile-form'
								className='border border-[#1a73e8] text-[#1a73e8] text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer'>
								Simpan
							</button>
						</div>
						{notification.message && <div className={`mb-5 rounded-lg p-3 text-sm font-medium ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{notification.message}</div>}

						{/* Form */}
						<form
							id='edit-profile-form'
							onSubmit={handleSubmit(handleSave)}
							className='w-full flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-6'>
							{/* Avatar */}
							<div className='flex items-center gap-4'>
								<div className='w-20 h-20 rounded-full overflow-hidden bg-blue-100'>
									{selectedImage ? (
										<img
											src={selectedImage}
											alt='Profile'
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center text-2xl font-bold text-[#1a73e8]'>{character}</div>
									)}
								</div>
								<label
									htmlFor='unggah-foto'
									className='flex items-center gap-2 text-sm font-medium text-[#1a73e8] cursor-pointer hover:underline'>
									<Camera
										className='w-4 h-4'
										strokeWidth={2}
									/>
									Ganti Foto Profile
								</label>
								<input
									id='unggah-foto'
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleImageChange}
									{...register("image")}
								/>
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className={labelClass}>Nama Lengkap</label>
								<input
									type='text'
									placeholder='Budi Santoso'
									className={inputClass}
									{...register("name")}
								/>
								{errors.name && <span className='text-xs text-red-600'>{errors.name.message}</span>}
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className={labelClass}>Email</label>
								<input
									type='email'
									placeholder='budi@email.com'
									className={inputClass}
									{...register("email")}
								/>
								{errors.email && <span className='text-xs text-red-600'>{errors.email.message}</span>}
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className={labelClass}>Nomor Telepon</label>
								<input
									type='tel'
									placeholder='0812-3456-7890'
									className={inputClass}
									{...register("telepon")}
								/>
								{errors.telepon && <span className='text-xs text-red-600'>{errors.telepon.message}</span>}
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className={labelClass}>Tanggal Lahir</label>
								<input
									type='date'
									className={inputClass}
									{...register("tanggalLahir")}
								/>
								{errors.tanggalLahir && <span className='text-xs text-red-600'>{errors.tanggalLahir.message}</span>}
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className={labelClass}>Jenis Kelamin</label>
								<select
									{...register("jenisKelamin")}
									className={inputClass}>
									<option value=''>Pilih jenis kelamin</option>
									<option value='laki-laki'>Laki-laki</option>
									<option value='perempuan'>Perempuan</option>
								</select>
								{errors.jenisKelamin && <span className='text-xs text-red-600'>{errors.jenisKelamin.message}</span>}
							</div>
						</form>

						{/* Account security */}
						<div className='w-full flex flex-col gap-4 border border-black/10 rounded-lg p-6 bg-white'>
							<h3 className='text-sm font-semibold text-gray-900'>Keamanan Akun</h3>
							<button
								type='button'
								className='text-sm font-medium text-[#1a73e8] text-left hover:underline cursor-pointer bg-transparent border-none'>
								Ubah Kata Sandi
							</button>
							<button
								type='button'
								className='text-sm font-medium text-[#1a73e8] text-left hover:underline cursor-pointer bg-transparent border-none'>
								Aktifkan Verifikasi 2 Langkah
							</button>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
=======
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal text-text-primary outline-none focus:border-primary transition-colors";
const labelClass = "text-sm font-medium text-text-primary";

export default function EditProfile() {
  const { auth, updateAuth } = useAuth();
  const [selectedImage, setSelectedImage] = useState(auth?.image || "");

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(editProfileSchema),
  });
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return ""; // Mencegah error jika data tanggal tidak valid

    const thn = d.getFullYear();
    const bln = String(d.getMonth() + 1).padStart(2, "0");
    const tgl = String(d.getDate()).padStart(2, "0");

    return `${thn}-${bln}-${tgl}`; // Menghasilkan yyyy-mm-dd
  };

  // Isi form dari data auth yang sedang login
  useEffect(() => {
    if (auth) {
      reset({
        name: auth.full_name || "",
        email: auth.email || "",
        telepon: auth.telepon || "",
        tanggalLahir: formatDate(auth.tanggalLahir) || "",
        jenisKelamin: auth.jenisKelamin || "",
      });
    }
  }, [auth, auth.email, reset]);

  const handleSave = (data) => {
    try {
      updateAuth({
        name: data.name,
        email: data.email,
        image: selectedImage,
        telepon: data.telepon,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin,
      });

      // alert("Profile berhasil diperbarui");
      setNotification({
        type: "success",
        message: "Profile berhasil diperbarui",
      });
    } catch (error) {
      console.error(error);
      // alert("Gagal memperbarui profile");
      setNotification({
        type: "error",
        message: `${error} = Gagal memperbarui profile`,
      });
    }
  };
  useEffect(() => {
    if (!notification.message) return;

    const timer = setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification]);

  const character = auth?.name?.charAt(0).toUpperCase();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <Header />
      <ButtonMessage />
      <main className="min-h-screen bg-surface">
        <div className="container-page grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 px-4 xl:px-0 py-8">
          <ProfileSidebar activeNav="settings" />

          <div className="lg:col-span-3 flex flex-col gap-4 card-base p-5 shadow-sm">
            {/* Heading */}
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-text-primary">
                Pengaturan Profile
              </h2>
              <button
                type="submit"
                form="edit-profile-form"
                className="border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
            {notification.message && (
              <div
                className={`mb-5 rounded-lg p-3 text-sm font-medium ${notification.type === "success" ? "bg-success-light text-success" : "bg-red-100 text-red-700"}`}
              >
                {notification.message}
              </div>
            )}

            {/* Form */}
            <form
              id="edit-profile-form"
              onSubmit={handleSubmit(handleSave)}
              className="w-full flex flex-col gap-4 bg-white border border-border rounded-2xl p-6"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-light">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                      {character}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="unggah-foto"
                  className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer hover:underline"
                >
                  <Camera className="w-4 h-4" strokeWidth={2} />
                  Ganti Foto Profile
                </label>
                <input
                  id="unggah-foto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  {...register("image")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Budi Santoso"
                  className={inputClass}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-xs text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="budi@email.com"
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="0812-3456-7890"
                  className={inputClass}
                  {...register("telepon")}
                />
                {errors.telepon && (
                  <span className="text-xs text-red-600">
                    {errors.telepon.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Tanggal Lahir</label>
                <input
                  type="date"
                  className={inputClass}
                  {...register("tanggalLahir")}
                />
                {errors.tanggalLahir && (
                  <span className="text-xs text-red-600">
                    {errors.tanggalLahir.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Jenis Kelamin</label>
                <select {...register("jenisKelamin")} className={inputClass}>
                  <option value="">Pilih jenis kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
                {errors.jenisKelamin && (
                  <span className="text-xs text-red-600">
                    {errors.jenisKelamin.message}
                  </span>
                )}
              </div>
            </form>

            {/* Account security */}
            <div className="w-full flex flex-col gap-4 border border-border rounded-lg p-6 bg-white">
              <h3 className="text-sm font-semibold text-text-primary">
                Keamanan Akun
              </h3>
              <button
                type="button"
                className="text-sm font-medium text-primary text-left hover:underline cursor-pointer bg-transparent border-none"
              >
                Ubah Kata Sandi
              </button>
              <button
                type="button"
                className="text-sm font-medium text-primary text-left hover:underline cursor-pointer bg-transparent border-none"
              >
                Aktifkan Verifikasi 2 Langkah
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
>>>>>>> feat/newVersion
}
