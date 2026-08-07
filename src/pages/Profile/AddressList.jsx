import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";
import AddressModal from "@/features/profile/components/AddressModal";

// Hooks (Redux)
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/features/address/addressSlice";

// Main Page
export default function AddressList() {
  const dispatch = useDispatch();
  const {
    items: addresses,
    status,
    mutationStatus,
  } = useSelector((state) => state.addresses);

  const [modalMode, setModalMode] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [pendingId, setPendingId] = useState(null); // id yg lagi diproses (delete/set main)

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!notification.message) return;
    const timer = setTimeout(
      () => setNotification({ type: "", message: "" }),
      3000,
    );
    return () => clearTimeout(timer);
  }, [notification]);

  const showError = (fallback, error) => {
    setNotification({
      type: "error",
      message: typeof error === "string" ? error : fallback,
    });
  };

  const handleSetMain = async (id) => {
    setPendingId(id);
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
    } catch (err) {
      showError("Gagal menjadikan alamat utama", err);
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id) => {
    setPendingId(id);
    try {
      await dispatch(deleteAddress(id)).unwrap();
      setNotification({ type: "success", message: "Alamat berhasil dihapus" });
    } catch (err) {
      showError("Gagal menghapus alamat", err);
    } finally {
      setPendingId(null);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await dispatch(createAddress(formData)).unwrap();
      setNotification({
        type: "success",
        message: "Alamat berhasil ditambahkan",
      });
      setModalMode(null);
    } catch (err) {
      showError("Gagal menambahkan alamat", err);
    }
  };

  const handleEdit = async (updatedAddress) => {
    try {
      await dispatch(
        updateAddress({ id: modalMode.data.id, ...updatedAddress }),
      ).unwrap();
      setNotification({
        type: "success",
        message: "Alamat berhasil diperbarui",
      });
      setModalMode(null);
    } catch (err) {
      showError("Gagal memperbarui alamat", err);
    }
  };

  const isSavingModal = mutationStatus === "loading" && modalMode !== null;

  return (
    <>
      <Header />
      <ButtonMessage />
      <main className="min-h-screen bg-surface">
        <div className="container-page grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 px-4 xl:px-0 py-8">
          {/* ── Left: Sidebar ── */}
          <ProfileSidebar activeNav="address" />

          {/* ── Right: Address List ── */}
          <div className="lg:col-span-3 flex flex-col gap-4 card-base p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-text-primary">
                Alamat Saya
              </h2>
              <button
                type="button"
                onClick={() => setModalMode("add")}
                className="flex items-center gap-2 h-10 px-4 btn-primary text-sm font-medium rounded-xl"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Tambah Alamat
              </button>
            </div>

            {notification.message && (
              <div
                className={`rounded-lg p-3 text-sm font-medium ${notification.type === "success" ? "bg-success-light text-success" : "bg-red-100 text-red-700"}`}
              >
                {notification.message}
              </div>
            )}

            {/* Loading state */}
            {status === "loading" && (
              <div className="flex items-center justify-center py-16 text-text-secondary text-sm">
                Memuat alamat...
              </div>
            )}

            {/* Failed to load */}
            {status === "failed" && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-secondary">
                <p className="text-sm text-red-500">Gagal memuat alamat.</p>
                <button
                  type="button"
                  onClick={() => dispatch(fetchAddresses())}
                  className="text-xs text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Address Cards */}
            {status === "succeeded" &&
              (addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-secondary">
                  <MapPin className="w-12 h-12" strokeWidth={1} />
                  <p className="text-sm">Belum ada alamat tersimpan.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`flex flex-col gap-3 rounded-2xl border p-5 transition-colors ${addr.isDefault ? "border-primary bg-primary-light/40" : "border-border bg-white"}`}
                    >
                      {/* Label row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-medium text-text-primary">
                            {addr.label}
                          </h3>
                          {addr.isDefault && (
                            <span className="flex items-center justify-center h-6 px-3 rounded-full text-xs font-normal text-white bg-primary">
                              Utama
                            </span>
                          )}
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetMain(addr.id)}
                              disabled={pendingId === addr.id}
                              className="text-xs text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors disabled:opacity-60"
                            >
                              Jadikan Utama
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setModalMode({ mode: "edit", data: addr })
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-surface transition-colors"
                          >
                            <Pencil
                              className="w-3.5 h-3.5 text-text-secondary"
                              strokeWidth={2}
                            />
                          </button>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleDelete(addr.id)}
                              disabled={pendingId === addr.id}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-red-50 transition-colors disabled:opacity-60"
                            >
                              <Trash2
                                className="w-3.5 h-3.5 text-red-500"
                                strokeWidth={2}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Address detail */}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-text-secondary">
                          {addr.address}
                          {addr.subdistrict ? `, ${addr.subdistrict}` : ""}
                          {addr.district ? `, ${addr.district}` : ""}
                          {`, ${addr.city}, ${addr.province}`}
                          {addr.postalCode ? ` ${addr.postalCode}` : ""}
                        </p>
                        {addr.note && (
                          <p className="text-xs text-text-secondary italic">
                            Catatan: {addr.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal Tambah */}
      {modalMode === "add" && (
        <AddressModal
          onClose={() => setModalMode(null)}
          onSave={handleAdd}
          isSaving={isSavingModal}
        />
      )}

      {/* Modal Edit */}
      {modalMode?.mode === "edit" && (
        <AddressModal
          initialData={modalMode.data}
          onClose={() => setModalMode(null)}
          onSave={handleEdit}
          isSaving={isSavingModal}
        />
      )}
    </>
  );
}
