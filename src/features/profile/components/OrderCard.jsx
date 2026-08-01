import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { CircleCheckBig, Truck } from "lucide-react";

function StatusBadge({ status }) {
  if (status === "sent") {
    return (
      <span className="flex items-center gap-1.5 bg-border rounded-full px-3 py-1 text-xs text-success">
        <CircleCheckBig className="w-3 h-3 text-success" strokeWidth={2} />
        Terkirim
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 bg-border rounded-full px-3 py-1 text-xs text-primary">
      <Truck className="w-3 h-3 text-primary" strokeWidth={2} />
      Dikirim
    </span>
  );
}

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const displayId = order.orderId ?? order.id;

  return (
    <div className="w-full flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-medium text-text-primary">
            #{displayId}
          </h3>
          <span className="text-xs text-text-secondary">{order.date}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Products */}
      {order.products.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <img
            src={p.img}
            alt={p.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-text-primary">
              {p.name}
            </h3>
            <span className="text-xs text-text-secondary">
              ×{p.qty} · {p.price}
            </span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-between items-end pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-text-secondary">Total:</span>
          <span className="text-sm text-primary">{order.total}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`#`)} ///track/${displayId}
            className="text-sm text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
          >
            Lacak
          </button>
          {order.canReview && (
            <button
              onClick={() => navigate(`#`)} ///review/${displayId}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-colors"
            >
              <Star className="w-3 h-3" strokeWidth={2} />
              Beri Ulasan
            </button>
          )}
          <button className="text-sm font-medium text-text-secondary border border-border rounded-lg px-3 py-1.5 hover:bg-surface transition-colors">
            Beli Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
