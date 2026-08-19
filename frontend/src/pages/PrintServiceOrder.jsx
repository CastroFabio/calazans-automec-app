import React, { useEffect, useState } from "react";
import { formatarCelular } from "../utils/convertCel";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusReverseMap } from "../utils/statusMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { formattedPrice } from "../utils/convertPrice";
import logo from "../../public/LogoCalazansAutomec.png";

const INFO_MEC = {
  nomeOficina: "Calazans Automec",
  endereco: "Rua Professora Emylce, 126 - Ponto Cem Réis",
  cidade: "Niterói - RJ - CEP 24060-011",
  celular: 21964219426,
  email: "calazansautomec@gmail.com",
  subtitulo: "Oficina & Automecânica",
};

const PrintServiceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceOrder, setServiceOrder] = useState(null);
  const [isClear, setIsClear] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { getServiceOrderById } = useServiceOrders();

  const safeArray = (value) => {
    return Array.isArray(value) ? value : [];
  };

  const formatServiceOrderTitle = (order) => {
    const maintenances = safeArray(order?.itemMaintenances);
    const count = maintenances.length;

    if (count === 0) {
      return `Ordem de Serviço #${order?.id || ""}`;
    }

    if (count === 1) {
      return maintenances[0]?.maintenancejob?.name || "Serviço";
    }

    const firstName = maintenances[0]?.maintenancejob?.name || "Serviço";
    return `${firstName} +${count - 1}`;
  };

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar ordem de serviço
        let found = getServiceOrderById(Number(id));

        const { data } = await orderApi.getById(Number(id));
        setServiceOrder(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id, getServiceOrderById]);

  if (loading) return <div>Carregando ordem de serviço...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!serviceOrder) return <div>Ordem de serviço não encontrada</div>;

  return (
    <div className="page" id="page-os-print">
      <div className="print-wrap">
        <div className="print-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>
          <button className="btn btn-secondary">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="print-page-wpp-btn"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Enviar WhatsApp
          </button>
          <button className="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Imprimir
          </button>
        </div>
        <div className="print-doc" id="printDoc">
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
                <div className="print-field-val">
                  {serviceOrder.professional}
                </div>
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
                    <th className="print-mat-table-header-receipt">
                      Nº Recibo
                    </th>
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
                          Number(element.value_unity) *
                            Number(element.quantity),
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
    </div>
  );
};

export default PrintServiceOrder;
