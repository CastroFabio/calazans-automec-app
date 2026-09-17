import { formattedPrice } from "../utils/convertPrice";
import { getNumberValue } from "../utils/parseValue";
import { paymentStatusMap } from "../utils/paymentStatusMap";
import CurrencyInput from "./CurrencyInput.component";
import FormSectionHeader from "./FormSectionHeader.component";
import PaymentStatusSelector from "./PaymentStatusSelector.component";

const PaymentStatusForm = ({
  headerTitle,
  headerIcon,
  formDataPaymentStatus,
  calculateGrandTotal,
  formDataPaid,
  payment,
  handlePaymentOnChange,
  handleAddPayment,
  handlePayFully,
  handleFormFieldChange,
}) => {
  return (
    <div className="form-section">
      <FormSectionHeader title={headerTitle} icon={headerIcon} />
      <div className="fs-body">
        <div className="status-card-body status-card-body-container">
          <div className="payment-container">
            {/* Totais e Valores */}
            {formDataPaymentStatus === paymentStatusMap["Sem Pagamento"] ? (
              <div className="grand-total os-new-status-card-title">
                Não requer pagamento
              </div>
            ) : (
              <div id="editPaymentRows" className="status-card-row-container">
                <div className="payment-row payment-row-item">
                  <span className="payment-row-total-os">Total da OS</span>
                  <span className="payment-total payment-total-value">
                    {formattedPrice(calculateGrandTotal())}
                  </span>
                </div>

                <div className="payment-row payment-row-item">
                  <span className="payment-row-total-pago">Total pago</span>
                  <span className="payment-row-total-pago-value">
                    {formattedPrice(formDataPaid)}
                  </span>
                </div>

                <div className="payment-divider"></div>

                <div className="payment-row payment-row-item">
                  <span className="payment-row-saldo-restante">
                    Saldo restante
                  </span>
                  <span
                    className={`payment-row-saldo-restante-value ${
                      getNumberValue(formDataPaid) >= calculateGrandTotal()
                        ? "payment-saldo-ok"
                        : "payment-saldo-due"
                    }`}
                  >
                    {getNumberValue(formDataPaid) >= calculateGrandTotal()
                      ? "Quitado"
                      : formattedPrice(
                          calculateGrandTotal() - getNumberValue(formDataPaid),
                        )}
                  </span>
                </div>
              </div>
            )}
            {/* Campo Registrar Pagamento */}
            <div className="status-card-body-container-registrar-pagamento">
              <div className="status-card-body-container-registrar-pagamento-input-container">
                <div className="status-card-body-container-registrar-pagamento-input">
                  <CurrencyInput
                    value={payment}
                    handleFormFieldChange={handlePaymentOnChange}
                    label={"Registrar pagamento"}
                  />

                  <div className="status-card-body-container-registrar-pagamento-input-container-btns">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={handleAddPayment}
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={handlePayFully}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PaymentStatusSelector
          handleFormFieldChange={handleFormFieldChange}
          newOrderPaidValue={formDataPaid}
          grandTotalValue={calculateGrandTotal}
          paymentStatus={formDataPaymentStatus}
        />
      </div>
    </div>
  );
};

export default PaymentStatusForm;
