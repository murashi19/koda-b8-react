import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";
import AddressModal from "@/features/profile/components/AddressModal";

// Hooks (Redux)
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";

// Main Page
export default function AddressList() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const addresses = auth?.addresses ?? [];
  const [modalMode, setModalMode] = useState(null);

  const handleSetMain = (id) => {
    dispatch(
      updateUser({
        addresses: addresses.map((address) => ({
          ...address,
          isMain: address.id === id,
        })),
      }),
    );
  };

  const handleDelete = (id) => {
    dispatch(
      updateUser({
        addresses: addresses.filter((address) => address.id !== id),
      }),
    );
  };

  const handleAdd = (formData) => {
    const newAddress = {
      ...formData,
      id: Date.now(),
      isMain: addresses.length === 0,
    };

    dispatch(
      updateUser({
        addresses: [...addresses, newAddress],
      }),
    );

    setModalMode(null);
  };

  const handleEdit = (updatedAddress) => {
    dispatch(
      updateUser({
        addresses: addresses.map((address) =>
          address.id === updatedAddress.id ? updatedAddress : address,
        ),
      }),
    );

    setModalMode(null);
  };

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

            {/* Address Cards */}
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-secondary">
                <MapPin className="w-12 h-12" strokeWidth={1} />
                <p className="text-sm">Belum ada alamat tersimpan.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex flex-col gap-3 rounded-2xl border p-5 transition-colors ${addr.isMain ? "border-primary bg-primary-light/40" : "border-border bg-white"}`}
                  >
                    {/* Label row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-medium text-text-primary">
                          {addr.alamat}
                        </h3>
                        {addr.isMain && (
                          <span className="flex items-center justify-center h-6 px-3 rounded-full text-xs font-normal text-white bg-primary">
                            Utama
                          </span>
                        )}
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {!addr.isMain && (
                          <button
                            onClick={() => handleSetMain(addr.id)}
                            className="text-xs text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
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
                        {!addr.isMain && (
                          <button
                            onClick={() => handleDelete(addr.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-red-50 transition-colors"
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
                      <p className="text-sm font-medium text-text-primary">
                        {addr.name} · {addr.phone}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {addr.alamat}, {addr.kota}, {addr.provinsi}{" "}
                        {addr.kodePos}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal Tambah */}
      {modalMode === "add" && (
        <AddressModal onClose={() => setModalMode(null)} onSave={handleAdd} />
      )}

      {/* Modal Edit */}
      {modalMode?.mode === "edit" && (
        <AddressModal
          initialData={modalMode.data}
          onClose={() => setModalMode(null)}
          onSave={handleEdit}
        />
      )}
    </>
  );
}
