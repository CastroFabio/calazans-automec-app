import React, { useState } from "react";
import { PATHS } from "../utils/paths";
import {
  paymentStatusMap,
  paymentStatusReverseMap,
  paymentStatusReverseMapBadge,
} from "../utils/paymentStatusMap";

const PaymentStatusSelector = ({
  handleFormFieldChange,
  isPaidFully,
  setIsPaidFully,
  newOrderPaidValue,
  grandTotalValue,
}) => {
  const [paymentStatus, setPaymentStatus] = useState(
    paymentStatusReverseMapBadge[1],
  );

  const handleSelectPay = (status) => {
    if (newOrderPaidValue < grandTotalValue) {
      setPaymentStatus(paymentStatusReverseMapBadge[status]);
      handleFormFieldChange("paymentStatus", status);
      status != paymentStatusMap["Pago Integralmente"]
        ? setIsPaidFully(false)
        : setIsPaidFully(true);
      return;
    }

    setPaymentStatus(paymentStatusReverseMapBadge[3]);
    handleFormFieldChange(
      "paymentStatus",
      paymentStatusMap["Pago Integralmente"],
    );
  };

  return (
    <div className="field field-margin-bottom">
      <label>Status de pagamento *</label>
      <div className="wz-pay-options-grid">
        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === paymentStatusReverseMapBadge[1] && !isPaidFully ? "active" : ""}`}
          id="wzPayOpt-awaiting-payment"
          onClick={() =>
            handleSelectPay(paymentStatusMap["Aguardando Pagamento"])
          }
        >
          <div className="wz-pay-dot wz-pay-dot-yellow"></div>
          <div>
            <div className="wz-pay-title">Aguardando pagamento</div>
            <div className="wz-pay-sub">Cliente ainda não pagou</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${
            paymentStatus === paymentStatusReverseMapBadge[2] && !isPaidFully
              ? "active"
              : ""
          }`}
          id="wzPayOpt-partial"
          onClick={() => handleSelectPay(paymentStatusMap["Pago Parcialmente"])}
        >
          <div className="wz-pay-dot wz-pay-dot-orange"></div>
          <div>
            <div className="wz-pay-title">Pago parcialmente</div>
            <div className="wz-pay-sub">Parte do valor já foi paga</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === paymentStatusReverseMapBadge[3] || isPaidFully ? "active" : ""}`}
          id="wzPayOpt-done"
          onClick={() =>
            handleSelectPay(paymentStatusMap["Pago Integralmente"])
          }
        >
          <div className="wz-pay-dot wz-pay-dot-green"></div>
          <div>
            <div className="wz-pay-title">Pago integralmente</div>
            <div className="wz-pay-sub">OS totalmente quitada</div>
          </div>
        </button>

        <button
          type="button"
          className={`wz-pay-opt ${paymentStatus === paymentStatusReverseMapBadge[4] && !isPaidFully ? "active" : ""}`}
          id="wzPayOpt-pending"
          onClick={() => handleSelectPay(paymentStatusMap["Sem Pagamento"])}
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
