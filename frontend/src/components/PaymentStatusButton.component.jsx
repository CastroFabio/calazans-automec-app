const PaymentStatusButton = ({
  title,
  subtitle,
  style,
  paymentStatusBadge,
  handleSelectPay,
}) => {
  return (
    <button
      type="button"
      className={`wz-pay-opt ${paymentStatusBadge}`}
      onClick={handleSelectPay}
    >
      <div className={`wz-pay-dot ${style}`}></div>
      <div>
        <div className="wz-pay-title">{title}</div>
        <div className="wz-pay-sub">{subtitle}</div>
      </div>
    </button>
  );
};

export default PaymentStatusButton;
