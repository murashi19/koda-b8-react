import { useNavigate } from "react-router-dom";
import { CircleCheckBig, Truck, Package, Clock, XCircle } from "lucide-react";

const formatRp = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const STATUS_CONFIG = {
  PENDING: {
    label: "Menunggu Pembayaran",
    icon: Clock,
    className: "text-text-secondary",
  },
  PAID: { label: "Dibayar", icon: CircleCheckBig, className: "text-success" },
  PROCESSING: { label: "Diproses", icon: Package, className: "text-primary" },
  SHIPPED: { label: "Dikirim", icon: Truck, className: "text-primary" },
  DELIVERED: {
    label: "Terkirim",
    icon: CircleCheckBig,
    className: "text-success",
  },
  CANCELLED: { label: "Dibatalkan", icon: XCircle, className: "text-red-500" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  return (
    <span
      className={`flex items-center gap-1.5 bg-border rounded-full px-3 py-1 text-xs ${config.className}`}
    >
      <Icon className="w-3 h-3" strokeWidth={2} />
      {config.label}
    </span>
  );
}

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-medium text-text-primary">
            #{order.orderCode}
          </h3>
          <span className="text-xs text-text-secondary">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {(order.items ?? []).map((p) => (
        <div key={p.productId} className="flex items-center gap-3">
          <img
            src={p.image}
            alt={p.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-text-primary">
              {p.name}
            </h3>
            <span className="text-xs text-text-secondary">
              ×{p.qty} · {formatRp(p.price)}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-end pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-text-secondary">Total:</span>
          <span className="text-sm text-primary">{formatRp(order.total)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`#`)}
            className="text-sm text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
          >
            Lacak
          </button>
          {order.status === "DELIVERED" && (
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-colors">
              Beri Ulasan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
