import { useState } from "react";
import { CreditCard, ChevronRight, Lock } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PAYMENT_METHODS as paymentMethods } from "@/features/checkout/data/paymentMethods";

export default function CheckoutStep2() {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData } = useOutletContext();
  const [selectedPayment, setSelectedPayment] = useState(
    checkoutData.paymentMethod ?? "bca",
  );

  const handleContinue = () => {
    updateCheckoutData({ paymentMethod: selectedPayment });
    navigate("/checkout/step3");
  };

  return (
    <>
      {/* Left: Payment Methods */}
      <div className="flex-1 w-full card-base p-6 flex flex-col gap-6">
        {/* Heading */}
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" strokeWidth={2} />
          <span className="text-base font-medium text-text-primary">
            Metode Pembayaran
          </span>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedPayment === method.id ? "border-primary bg-primary-light" : "border-border hover:border-border bg-white"}`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span className="text-lg leading-5">{method.icon}</span>
              <span className="text-xs font-medium text-text-primary">
                {method.label}
              </span>
            </label>
          ))}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2.5 bg-primary-light border border-primary-light rounded-xl px-4 py-3">
          <Lock className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2} />
          <span className="text-xs font-semibold text-text-secondary">
            Informasi pembayaranmu dienkripsi dengan SSL 256-bit. Kami tidak
            menyimpan data kartu kreditmu.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/checkout/step1")}
            className="w-24 h-12 border border-border rounded-xl text-sm font-medium text-text-primary bg-white hover:bg-surface transition-colors"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 h-12 rounded-xl btn-primary text-base font-medium flex items-center justify-center gap-2"
          >
            <span>Lanjut Ke Pembayaran</span>
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </>
  );
}
