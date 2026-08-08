import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema } from "@/features/profile/validations/editProfileSchema";

import { updateUser } from "@/features/auth/authSlice";

import { Camera, Pencil } from "lucide-react";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";
import api from "@/lib/axios";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal text-text-primary outline-none focus:border-primary transition-colors";
const labelClass = "text-sm font-medium text-text-primary";
const displayLabelClass = "text-xs font-medium text-text-secondary";
const displayValueClass = "text-sm font-medium text-text-primary";

async function updateProfile(id, formData) {
  const payload = {
    full_name: formData.name,
    phone_number: formData.phone_number,
    birth_date: formData.birth_date,
    gender: formData.gender,
  };
  const { data } = await api.patch(`/profiles/${id}`, payload);
  return data.data; // updatedProfile dari backend
}
async function uploadAvatar(id, file) {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await api.put(`/profiles/${id}/avatar`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data; // updatedProfile dengan avatar baru
}

async function getProfile(id) {
  const { data } = await api.get(`/profiles/${id}`);
  return data.data; // sesuaikan kalau shape response beda
}

export default function EditProfile() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false); // <-- toggle view/edit
  const [selectedImage, setSelectedImage] = useState(auth?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isNaN(d.getTime())) return "";

    const thn = d.getFullYear();
    const bln = String(d.getMonth() + 1).padStart(2, "0");
    const tgl = String(d.getDate()).padStart(2, "0");

    return `${thn}-${bln}-${tgl}`;
  };

  useEffect(() => {
    if (!auth?.id) return;
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(auth.id);

        dispatch(
          updateUser({
            full_name: profile.full_name,
            email: profile.email,
            phone_number: profile.phone_number,
            birth_date: profile.birth_date,
            gender: profile.gender,
            avatar: profile.avatar,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [auth?.id, dispatch]);

  // Isi form dari data auth yang sedang login
  useEffect(() => {
    if (auth) {
      reset({
        name: auth.full_name || "",
        email: auth.email || "",
        phone_number: auth.phone_number || "",
        birth_date: formatDate(auth.birth_date) || "",
        gender: auth.gender || "",
      });
    }
  }, [auth, auth?.email, reset]);

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      let updated = await updateProfile(auth.id, data);

      if (avatarFile) {
        updated = await uploadAvatar(auth.id, avatarFile);
      }

      dispatch(updateUser(updated));
      setAvatarFile(null);
      setNotification({
        type: "success",
        message: "Profile berhasil diperbarui",
      });
      setIsEditing(false); // <-- balik ke view mode setelah sukses simpan
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "Gagal memperbarui profile";
      setNotification({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // reset form & preview foto ke data auth semula
    reset({
      name: auth.full_name || "",
      email: auth.email || "",
      phone_number: auth.phone_number || "",
      birth_date: formatDate(auth.birth_date) || "",
      gender: auth.gender || "",
    });
    setSelectedImage(auth.avatar || "");
    setAvatarFile(null);
    setIsEditing(false);
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

  const character = auth?.full_name?.charAt(0).toUpperCase();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const genderLabel = (value) => {
    if (value === "male") return "Laki-laki";
    if (value === "female") return "Perempuan";
    return "-";
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

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-medium text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    form="edit-profile-form"
                    disabled={isSubmitting}
                    className="border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" strokeWidth={2} />
                  Edit
                </button>
              )}
            </div>

            {notification.message && (
              <div
                className={`mb-1 rounded-lg p-3 text-sm font-medium ${notification.type === "success" ? "bg-success-light text-success" : "bg-red-100 text-red-700"}`}
              >
                {notification.message}
              </div>
            )}

            {isEditing ? (
              /* ---------- FORM (EDIT MODE) ---------- */
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
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0812-3456-7890"
                    className={inputClass}
                    {...register("phone_number")}
                  />
                  {errors.phone_number && (
                    <span className="text-xs text-red-600">
                      {errors.phone_number.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Tanggal Lahir</label>
                  <input
                    type="date"
                    className={inputClass}
                    {...register("birth_date")}
                  />
                  {errors.birth_date && (
                    <span className="text-xs text-red-600">
                      {errors.birth_date.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Jenis Kelamin</label>
                  <select {...register("gender")} className={inputClass}>
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                  {errors.gender && (
                    <span className="text-xs text-red-600">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </form>
            ) : (
              /* ---------- DISPLAY (VIEW MODE) ---------- */
              <div className="w-full flex flex-col gap-4 bg-white border border-border rounded-2xl p-6">
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
                  <div>
                    <p className="text-base font-semibold text-text-primary">
                      {auth?.full_name || "-"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {auth?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={displayLabelClass}>
                      Nomor phone_number
                    </span>
                    <span className={displayValueClass}>
                      {auth?.phone_number || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={displayLabelClass}>Tanggal Lahir</span>
                    <span className={displayValueClass}>
                      {formatDate(auth?.birth_date) || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={displayLabelClass}>Jenis Kelamin</span>
                    <span className={displayValueClass}>
                      {genderLabel(auth?.gender)}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
}
