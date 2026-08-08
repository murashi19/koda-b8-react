import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/layout/Header/index";
import Footer from "@/components/layout/Footer";
import ButtonMessage from "@/components/common/ButtonMessage";
import ProgressBar from "@/features/checkout/components/ProgressBar";
import OrderSummary from "@/features/checkout/components/OrderSummary";

export default function CheckoutLayout() {
  const location = useLocation();

  // Data yang dikumpulkan sepanjang flow checkout (step1 -> step2 -> step3)
  const [checkoutData, setCheckoutData] = useState({
    addressId: null,
    shippingMethod: null,
    paymentMethod: null,
  });

  // Merge partial update, supaya tiap step cukup kirim bagian yang dia isi saja
  const updateCheckoutData = (partial) => {
    setCheckoutData((prev) => ({ ...prev, ...partial }));
  };

  const getCurrentStep = () => {
    switch (location.pathname) {
      case "/checkout/step1":
        return 1;

      case "/checkout/step2":
        return 2;

      case "/checkout/step3":
        return 3;

      case "/checkout/success":
        return 4;

      default:
        return 1;
    }
  };

  return (
    <>
      <Header />
      <ButtonMessage />

      <main className="min-h-screen bg-surface">
        <div className="container-page flex flex-col items-center gap-8 px-4 xl:px-0 py-8">
          <ProgressBar currentStep={getCurrentStep()} />

          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full">
            <Outlet context={{ checkoutData, updateCheckoutData }} />

            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
