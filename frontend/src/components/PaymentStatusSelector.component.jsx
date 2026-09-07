import React, { useState } from "react";

const PaymentStatusSelector = () => {
  const [paymentStatus, setPaymentStatus] = useState("awaiting-payment");

  const handleSelectPay = (status) => {
    setPaymentStatus(status);
  };

  return (
    <div className="field field-margin-bottom">
      <label>Status de pagamento *</label>
      <div className="wz-pay-options-grid">
        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === "awaiting-payment" ? "active" : ""}`}
          id="wzPayOpt-awaiting-payment"
          onClick={() => handleSelectPay("awaiting-payment")}
        >
          <div className="wz-pay-dot wz-pay-dot-yellow"></div>
          <div>
            <div className="wz-pay-title">Aguardando pagamento</div>
            <div className="wz-pay-sub">Cliente ainda não pagou</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === "partial" ? "active" : ""}`}
          id="wzPayOpt-partial"
          onClick={() => handleSelectPay("partial")}
        >
          <div className="wz-pay-dot wz-pay-dot-orange"></div>
          <div>
            <div className="wz-pay-title">Pago parcialmente</div>
            <div className="wz-pay-sub">Parte do valor já foi paga</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === "done" ? "active" : ""}`}
          id="wzPayOpt-done"
          onClick={() => handleSelectPay("done")}
        >
          <div className="wz-pay-dot wz-pay-dot-green"></div>
          <div>
            <div className="wz-pay-title">Pago integralmente</div>
            <div className="wz-pay-sub">OS totalmente quitada</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === "pending" ? "active" : ""}`}
          id="wzPayOpt-pending"
          onClick={() => handleSelectPay("pending")}
        >
          <div className="wz-pay-dot wz-pay-dot-gray"></div>
          <div>
            <div className="wz-pay-title">Sem pagamento</div>
            <div className="wz-pay-sub">A combinar</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusSelector;
