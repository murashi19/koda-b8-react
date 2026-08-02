import api from "@/lib/axios";

// GET /me
export const getMe = () => api.get("/me");

// PATCH
export const updateMyProfile = (data) =>
  api.patch("/me", {
    full_name: data.name,
    email: data.email,
    telepon: data.telepon,
    tanggalLahir: data.tanggalLahir,
    jenisKelamin: data.jenisKelamin,
  });

// PATCH /me/avatar (Upload Gambar)
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return api.patch("/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
