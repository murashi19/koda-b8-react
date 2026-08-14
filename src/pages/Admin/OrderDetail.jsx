import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderDetailAdmin,
  ORDER_STATUS_LABELS,
} from "../../features/orders/ordersSlice";
import { FiX } from "react-icons/fi";
import { PAYMENT_METHOD_LABELS } from "../../features/checkout/data/paymentMethods";
import { SHIPPING_METHOD_LABELS } from "../../features/checkout/data/shippingMethods";

const formatRp = (n) => "Rp " + Number(n ?? 0).toLocaleString("id-ID");
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

const statusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-600" },
  PAID: { bg: "bg-primary-light", text: "text-primary" },
  PROCESSING: { bg: "bg-indigo-100", text: "text-indigo-600" },
  SHIPPED: { bg: "bg-indigo-100", text: "text-indigo-600" },
  DELIVERED: { bg: "bg-success-light", text: "text-success" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-600" },
};
export default function OrderDetailModal({ orderId, onClose }) {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.adminDetailsById[orderId]);
  const detailStatus = useSelector(
    (state) => state.orders.adminDetailStatusById[orderId],
  );

  useEffect(() => {
    if (!order) dispatch(fetchOrderDetailAdmin(orderId));
  }, [orderId, order, dispatch]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <header className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-text-primary">
            Detail Pesanan {order ? `#${order.orderCode}` : ""}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiX className="text-[18px] text-text-secondary" />
          </button>
        </header>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto text-sm">
          {detailStatus === "loading" && !order && (
            <p className="text-text-secondary text-center py-8">Memuat...</p>
          )}
          {detailStatus === "failed" && !order && (
            <p className="text-red-500 text-center py-8">
              Gagal memuat detail pesanan.
            </p>
          )}
          {order && (
            <>
              <div>
                <p className="font-semibold text-text-primary">
                  {order.customer?.full_name}
                </p>
                <p className="text-text-secondary text-xs">
                  {order.user?.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Tanggal</p>
                  <p className="text-text-primary">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Pengiriman</p>
                  <p className="text-text-primary">
                    {SHIPPING_METHOD_LABELS[order.shippingMethod] ??
                      order.shippingMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Pembayaran</p>
                  <p className="text-text-primary">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Status</p>
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${(statusConfig[order.status] ?? statusConfig.PENDING).bg} ${(statusConfig[order.status] ?? statusConfig.PENDING).text}`}
                  >
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>

              {order.address && (
                <div>
                  <p className="text-xs text-text-secondary mb-1">
                    Alamat Pengiriman
                  </p>
                  <p className="text-text-primary">
                    {order.address.detail}
                    {order.address.subdistrict
                      ? `, ${order.address.subdistrict}`
                      : ""}
                    {order.address.district
                      ? `, ${order.address.district}`
                      : ""}
                    {`, ${order.address.city}, ${order.address.province}`}
                    {order.address.postalCode
                      ? ` ${order.address.postalCode}`
                      : ""}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-text-secondary mb-2">Item Pesanan</p>
                <ul className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b border-border last:border-0 pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                        <div>
                          <p className="text-text-primary">{item.name}</p>
                          <p className="text-xs text-text-secondary">
                            {item.qty} x {formatRp(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-text-primary">
                        {formatRp(item.subtotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between pt-2 border-t border-border font-semibold text-text-primary">
                <span>Total</span>
                <span className="text-primary">{formatRp(order.total)}</span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
