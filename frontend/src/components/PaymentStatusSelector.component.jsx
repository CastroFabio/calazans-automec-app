import { useState } from "react";

import {
  paymentStatusMap,
  paymentStatusReverseMapBadge,
} from "../utils/paymentStatusMap";

import PaymentStatusButton from "./PaymentStatusButton.component";
import { getNumberValue, parseInputValue } from "../utils/parseValue";

const PaymentStatusSelector = ({
  handleFormFieldChange,
  newOrderPaidValue,
  grandTotalValue,
  paymentStatus,
}) => {
  const handleSelectPay = (status) => {
    const newOrderPaidValueParsed = parseInputValue(newOrderPaidValue);
    const newOrderPaidValueNumber = getNumberValue(newOrderPaidValueParsed);

    if (
      newOrderPaidValueNumber >= grandTotalValue() &&
      grandTotalValue() !== 0
    ) {
      handleFormFieldChange(
        "paymentStatus",
        paymentStatusMap["Pago Integralmente"],
      );
      return;
    }
    handleFormFieldChange("paymentStatus", status);
  };

  const PAYMENT_TYPE = [
    {
      title: "Aguardando pagamento",
      subtitle: "Cliente ainda não pagou",
      style: "wz-pay-dot-yellow",
      paymentStatusBadge:
        paymentStatus === paymentStatusMap["Aguardando Pagamento"]
          ? "active"
          : "",
      handleSelectPay: () =>
        handleSelectPay(paymentStatusMap["Aguardando Pagamento"]),
    },
    {
      title: "Pago parcialmente",
      subtitle: "Parte do valor já foi paga",
      style: "wz-pay-dot-orange",
      paymentStatusBadge:
        paymentStatus == paymentStatusMap["Pago Parcialmente"] ? "active" : "",
      handleSelectPay: () =>
        handleSelectPay(paymentStatusMap["Pago Parcialmente"]),
    },
    {
      title: "Pago integralmente",
      subtitle: "OS totalmente quitada",
      style: "wz-pay-dot-green",
      paymentStatusBadge:
        paymentStatus == paymentStatusMap["Pago Integralmente"] ? "active" : "",
      handleSelectPay: () =>
        handleSelectPay(paymentStatusMap["Pago Integralmente"]),
    },
    {
      title: "Sem pagamento",
      subtitle: "A combinar",
      style: "wz-pay-dot-gray",
      paymentStatusBadge:
        paymentStatus == paymentStatusMap["Sem Pagamento"] ? "active" : "",
      handleSelectPay: () => handleSelectPay(paymentStatusMap["Sem Pagamento"]),
    },
  ];

  return (
    <div className="field field-margin-bottom">
      <label>Status de pagamento *</label>
      <div className="wz-pay-options-grid">
        {PAYMENT_TYPE.map((element, index) => (
          <PaymentStatusButton
            key={index}
            handleSelectPay={element.handleSelectPay}
            title={element.title}
            subtitle={element.subtitle}
            style={element.style}
            paymentStatusBadge={element.paymentStatusBadge}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentStatusSelector;
