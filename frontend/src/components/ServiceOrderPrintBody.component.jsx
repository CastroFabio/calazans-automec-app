import { formatarCelular } from "../utils/convertCel";
import { formatServiceOrderTitle } from "../utils/formatServiceOrderTitle";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { formattedPrice } from "../utils/convertPrice";
import { statusReverseMap } from "../utils/statusMap";
import logo from "../assets/LogoCalazansAutomec.png";

const INFO_MEC = {
  nomeOficina: "Calazans Automec",
  endereco: "Rua Professora Emylce, 126 - Ponto Cem Réis",
  cidade: "Niterói - RJ - CEP 24060-011",
  celular: 21964219426,
  email: "calazansautomec@gmail.com",
  subtitulo: "Oficina & Automecânica",
};

const ServiceOrderPrintBody = ({ componentRef, serviceOrder }) => {
  const calculateTotalMaintenanceJob = () => {
    return serviceOrder.itemMaintenances.reduce((total, job) => {
      return total + (parseFloat(job.value_unity) || 0);
    }, 0);
  };

  const calculateTotalMaterials = () => {
    return serviceOrder.itemMaterials.reduce((total, material) => {
      const materialTotal =
        (parseFloat(material.value_unity) || 0) *
        (parseFloat(material.quantity) || 0);
      return total + materialTotal;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalMaintenanceJob() + calculateTotalMaterials();
  };

  const totalIsPaid = () => {
    return calculateGrandTotal() - serviceOrder.paid ? true : false;
  };

  return (
    <div className="print-doc" id="printDoc" ref={componentRef}>
      <div className="print-header">
        <div>
          <div className="print-logo">
            <img
              src={logo}
              alt="Company Logo"
              className="print-header-logo-image"
            />
          </div>
          <div className="print-subtitulo">{INFO_MEC.subtitulo}</div>
        </div>
        <div className="print-shop-info">
          <div>{INFO_MEC.endereco}</div>
          <div>{INFO_MEC.cidade}</div>
          <div>{formatarCelular(INFO_MEC.celular)}</div>
          <div>{INFO_MEC.email}</div>
        </div>
      </div>
      <div className="print-section-body">
        <div className="print-section print-section-container">
          <div className="print-section-info">
            <div>
              <div className="print-os-id">{`#${serviceOrder.id}`}</div>
              <div className="print-os-info-serviço">
                {formatServiceOrderTitle(serviceOrder)}
              </div>
            </div>
            <div className="print-os-info-status-entry">
              <span className="print-os-info-status">
                {statusReverseMap[serviceOrder.status]}
              </span>
              <div className="print-os-info-entry">{`Entrada: ${formatLocalDateTimeStringISO(serviceOrder.arrived_at)}`}</div>
            </div>
          </div>
        </div>
        <div className="print-section">
          <div className="print-section-title">Cliente</div>
          <div className="print-grid">
            <div>
              <div className="print-field-label">Nome</div>
              <div className="print-field-val">
                {serviceOrder.customer.name}
              </div>
            </div>
            <div>
              <div className="print-field-label">Celular</div>
              <div className="print-field-val">
                {formatarCelular(serviceOrder.customer.cell)}
              </div>
            </div>
          </div>
        </div>
        <div className="print-section">
          <div className="print-section-title">Veículo</div>
          <div className="print-grid">
            <div>
              <div className="print-field-label">Placa</div>
              <div className="print-field-val print-field-val-placa">
                {serviceOrder.vehicle.license_plate}
              </div>
            </div>
            <div>
              <div className="print-field-label">Modelo</div>
              <div className="print-field-val">{`${serviceOrder.vehicle.brand} ${serviceOrder.vehicle.model}`}</div>
            </div>
            {/* <div>
                <div className="print-field-label">Ano</div>
                <div className="print-field-val">Ano</div>
              </div>
              <div>
                <div className="print-field-label">Cor</div>
                <div className="print-field-val">Cor</div>
              </div> */}
            <div>
              <div className="print-field-label">Km entrada</div>
              <div className="print-field-val">{serviceOrder.entry_km}</div>
            </div>
            <div>
              <div className="print-field-label">Técnico</div>
              <div className="print-field-val">{serviceOrder.professional}</div>
            </div>
          </div>
        </div>
        {serviceOrder.diagnosis ? (
          <div className="print-section">
            <div className="print-section-title">Observações</div>
            <div className="print-section-title-text">
              {serviceOrder.diagnosis}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="print-section">
          <div className="print-section-title">Serviços</div>
          {serviceOrder.itemMaintenances.length > 0 ? (
            <table className="print-mat-table">
              <thead>
                <tr>
                  <th className="print-mat-table-servico">Serviço</th>
                  <th className="print-mat-table-mao-de-obra">Mão de obra</th>
                </tr>
              </thead>
              <tbody>
                {serviceOrder.itemMaintenances.map((element) => (
                  <tr key={element.id}>
                    <td>{element.maintenancejob.name || "—"}</td>
                    <td className="print-mat-table-value-price">
                      {formattedPrice(element.value_unity)}
                    </td>
                  </tr>
                ))}

                {calculateTotalMaintenanceJob() > 0 ? (
                  <tr className="print-mat-table-value-mao-de-obra-total-container">
                    <td className="print-mat-table-value-mao-de-obra-total-title">
                      Total mão de obra
                    </td>
                    <td className="print-mat-table-value-mao-de-obra-total">
                      {formattedPrice(calculateTotalMaintenanceJob())}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          ) : (
            <div className="print-mat-table-nenhum-valor">
              Nenhum serviço registrado.
            </div>
          )}
        </div>
        <div className="print-section">
          <div className="print-section-title">Materiais & Peças</div>
          {serviceOrder.itemMaterials.length > 0 ? (
            <table className="print-mat-table">
              <thead>
                <tr>
                  <th className="print-mat-table-header-material">
                    Material / Peça
                  </th>
                  <th className="print-mat-table-header-qty">Qtd.</th>
                  <th className="print-mat-table-header-unt">Unit.</th>
                  <th className="print-mat-table-header-total">Total</th>
                  <th className="print-mat-table-header-supplier">
                    Fornecedor
                  </th>
                  <th className="print-mat-table-header-receipt">Nº Recibo</th>
                </tr>
              </thead>
              <tbody>
                {serviceOrder.itemMaterials.map((element) => (
                  <tr key={element.id}>
                    <td>{element.material.name}</td>
                    <td className="print-material-table-quantidade">
                      {element.quantity}
                    </td>
                    <td className="print-material-table-unit-value">
                      {element.value_unity > 0
                        ? formattedPrice(Number(element.value_unity))
                        : "—"}
                    </td>
                    <td className="print-material-table-total">
                      {formattedPrice(
                        Number(element.value_unity) * Number(element.quantity),
                      ) || 0}
                    </td>
                    <td className="print-material-table-supplier">
                      {element.supplier || "—"}
                    </td>
                    <td className="print-material-table-receipt">
                      {element.receipt || "—"}
                    </td>
                  </tr>
                ))}
                <tr className="print-material-table-value-total-container">
                  <td
                    className="print-material-table-value-total-title"
                    colSpan="3"
                  >
                    Total peças / materiais
                  </td>
                  <td className="print-material-table-value-total-value">
                    {formattedPrice(calculateTotalMaterials())}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="print-mat-table-nenhum">
              Nenhum material registrado.
            </div>
          )}
        </div>
        <div className="print-totals">
          <div className="print-total-row">
            <span>Mão de obra</span>
            <span className="print-total-row-value">
              {calculateTotalMaintenanceJob() > 0
                ? formattedPrice(calculateTotalMaintenanceJob())
                : formattedPrice(0)}
            </span>
          </div>
          <div className="print-total-row">
            <span>Peças / materiais</span>
            <span className="print-total-row-value">
              {calculateTotalMaterials() > 0
                ? formattedPrice(calculateTotalMaterials())
                : formattedPrice(0)}
            </span>
          </div>
          <div className="print-total-row grand">
            <span>Total</span>
            <span className="print-total-row-value">
              {calculateGrandTotal() > 0
                ? formattedPrice(calculateGrandTotal())
                : formattedPrice(0)}
            </span>
          </div>
          <div className="print-total-row paid">
            <span>Valor pago</span>
            <span className="print-total-row-value">
              {formattedPrice(serviceOrder.paid)}
            </span>
          </div>
          <div
            className={`print-total-row ${totalIsPaid() ? "due" : "paid"} grand`}
          >
            <span>
              {serviceOrder.paid >= calculateGrandTotal()
                ? "Quitado"
                : "Saldo a pagar"}
            </span>
            <span className="print-total-saldo">
              {serviceOrder.paid >= calculateGrandTotal()
                ? "—"
                : formattedPrice(calculateGrandTotal() - serviceOrder.paid)}
            </span>
          </div>
        </div>
        <div className="print-footer">
          {`Documento gerado por ${INFO_MEC.nomeOficina} — ${INFO_MEC.endereco} — ${formatarCelular(INFO_MEC.celular)}`}
          <br />
          Agradecemos a preferência!
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderPrintBody;
