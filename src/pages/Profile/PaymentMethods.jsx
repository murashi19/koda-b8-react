import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, History } from "lucide-react";

import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";

import { fetchOrders } from "@/features/orders/ordersSlice";
import { PAYMENT_METHODS } from "@/features/checkout/data/paymentMethods";

const formatRp = (n) => "Rp " + Number(n ?? 0).toLocaleString("id-ID");
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function PaymentMethods() {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);

  useEffect(() => {
    if (status === "idle") dispatch(fetchOrders());
  }, [status, dispatch]);

  // Riwayat pemakaian dihitung dari order asli (bukan data dummy) —
  // di-group per metode: berapa kali dipakai, total nilainya, dan terakhir dipakai kapan.
  const usageByMethod = useMemo(() => {
    const map = {};
    for (const order of orders) {
      const key = order.paymentMethod;
      if (!key) continue;
      if (!map[key]) {
        map[key] = { count: 0, total: 0, lastUsedAt: order.createdAt };
      }
      map[key].count += 1;
      map[key].total += order.total;
      if (new Date(order.createdAt) > new Date(map[key].lastUsedAt)) {
        map[key].lastUsedAt = order.createdAt;
      }
    }
    return map;
  }, [orders]);

  return (
    <>
      <Header />
      <ButtonMessage />
      <main className="min-h-screen bg-surface">
        <div className="container-page grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 px-4 xl:px-0 py-8">
          <ProfileSidebar activeNav="payment" />

          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Metode yang didukung */}
            <div className="flex flex-col gap-4 card-base p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" strokeWidth={2} />
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Metode Pembayaran
                </h2>
              </div>
              <p className="text-sm text-text-secondary -mt-2">
                Metode pembayaran ini bisa kamu pilih setiap kali checkout.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-white p-4"
                  >
                    <span className="text-2xl leading-6">{method.icon}</span>
                    <span className="text-sm font-medium text-text-primary">
                      {method.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat pemakaian, dari data order asli */}
            <div className="flex flex-col gap-4 card-base p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" strokeWidth={2} />
                <h2 className="font-display text-lg font-bold text-text-primary">
                  Riwayat Pemakaian
                </h2>
              </div>

              {status === "loading" && (
                <p className="text-sm text-text-secondary py-6 text-center">
                  Memuat riwayat...
                </p>
              )}

              {status === "succeeded" &&
                Object.keys(usageByMethod).length === 0 && (
                  <p className="text-sm text-text-secondary py-6 text-center">
                    Belum ada transaksi. Riwayat metode pembayaran akan muncul
                    di sini setelah kamu checkout.
                  </p>
                )}

              {Object.keys(usageByMethod).length > 0 && (
                <div className="flex flex-col divide-y divide-border">
                  {PAYMENT_METHODS.filter((m) => usageByMethod[m.id]).map(
                    (method) => {
                      const usage = usageByMethod[method.id];
                      return (
                        <div
                          key={method.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl leading-5">
                              {method.icon}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-text-primary">
                                {method.label}
                              </span>
                              <span className="text-xs text-text-secondary">
                                Dipakai {usage.count}x · Terakhir{" "}
                                {formatDate(usage.lastUsedAt)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {formatRp(usage.total)}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
