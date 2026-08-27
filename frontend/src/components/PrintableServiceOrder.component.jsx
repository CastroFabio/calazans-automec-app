import React from "react";
import logo from "../assets/LogoCalazansAutomec.png";
import {
  formatLocalDateTime,
  formatLocalDateTimeStringISO,
} from "../utils/convertDateTime";
import { formatarCelular } from "../utils/convertCel";
import { formattedPrice } from "../utils/convertPrice";

export const PrintableServiceOrder = ({ data, componentRef }) => {
  if (!data) return null;

  const {
    id,
    arrived_at,
    entry_km,
    labor_cost,
    customer = {},
    vehicle = {},
    itemMaintenances = [],
    itemMaterials = [],
  } = data;

  const INFO_MEC = {
    nomeOficina: "Calazans Automec",
    endereco: "Rua Professora Emylce, 126 - Ponto Cem Réis",
    cidade: "Niterói - RJ - CEP 24060-011",
    celular: 21964219426,
    email: "calazansautomec@gmail.com",
    subtitulo: "Oficina & Automecânica",
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

  // Cálculos de Totais

  const totalMaterials = itemMaterials.reduce(
    (acc, item) =>
      acc + (Number(item.quantity) || 0) * (parseFloat(item.value_unit) || 0),
    0,
  );

  const grandTotal = parseFloat(labor_cost) + totalMaterials;

  const formattedPrice = (val) =>
    Number(val || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="print-container" ref={componentRef}>
      {/* CSS embutido direto no componente */}
      <style>{`
        .print-container {
          width: 210mm;
          min-height: 297mm;
          padding: 12mm 15mm 15mm 15mm;
          margin: 0 auto;
          background: #ffffff;
          color: #111111;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10pt;
          line-height: 1.3;
          box-sizing: border-box;
        }

        /* Configurações específicas para hora de imprimir (Ctrl + P) */
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          .print-container {
            width: 100%;
            min-height: 100vh;
            padding: 10mm 12mm;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }

        .header-table {
          width: 100%;
          border-collapse: collapse;
          border-bottom: 2px solid #333;
          padding-bottom: 6px;
          margin-bottom: 10px;
        }

        .header-logo {
          max-width: 130px;
          max-height: 50px;
          vertical-align: middle;
        }

        .header-info {
          vertical-align: middle;
          text-align: right;
          font-size: 9pt;
        }

        .os-title-bar {
          background-color: #f2f2f2;
          border: 1px solid #ccc;
          padding: 6px 10px;
          margin-bottom: 10px;
        }

        .info-grid-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        .info-grid-table td {
          width: 50%;
          vertical-align: top;
          border: 1px solid #ddd;
          padding: 6px 8px;
          background-color: #fafafa;
          font-size: 9.5pt;
        }

        .section-title {
          font-size: 10pt;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 4px;
          border-bottom: 1px solid #222;
          padding-bottom: 2px;
          text-transform: uppercase;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
          font-size: 9.5pt;
        }

        .data-table th, .data-table td {
          border: 1px solid #ccc;
          padding: 4px 6px;
          text-align: left;
        }

        .data-table th {
          background-color: #eaeaea;
          font-weight: bold;
        }

        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }

        .totals-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 10pt;
        }

        .totals-table td {
          padding: 3px 6px;
        }

        .grand-total-row {
          font-size: 11pt;
          font-weight: bold;
          background-color: #e6e6e6;
          border-top: 2px solid #333;
          border-bottom: 2px solid #333;
        }

        .signatures-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 35px;
        }

        .signatures-table td {
          width: 45%;
          text-align: center;
          font-size: 9pt;
        }
      `}</style>

      {/* CABEÇALHO COM INFORMAÇÕES DA OFICINA */}
      <table className="header-table">
        <tbody>
          <tr>
            <td style={{ width: "35%" }}>
              {logo ? (
                <img src={logo} alt="Logo Oficina" className="header-logo" />
              ) : (
                <h2 style={{ margin: 0, fontSize: "14pt" }}>
                  {workshop.name || "NOME DA OFICINA"}
                </h2>
              )}
            </td>
            <td className="header-info">
              <strong>{INFO_MEC.nomeOficina}</strong>
              <br />
              {INFO_MEC.endereco} - {INFO_MEC.cidade}
              <br />
              Telefone: {formatarCelular(INFO_MEC.celular)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* IDENTIFICAÇÃO DA O.S. E DATA */}
      <div className="os-title-bar">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ fontSize: "11pt", fontWeight: "bold" }}>
                ORDEM DE SERVIÇO Nº: #{id}
              </td>
              <td className="text-right" style={{ fontSize: "9.5pt" }}>
                <strong>Entrada:</strong>{" "}
                {formatLocalDateTimeStringISO(arrived_at)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DADOS DO CLIENTE E VEÍCULO */}
      <table className="info-grid-table">
        <tbody>
          <tr>
            <td>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "3px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                DADOS DO CLIENTE
              </div>
              <strong>Nome:</strong> {customer.name || "N/A"}
              <br />
              <strong>Celular:</strong>{" "}
              {formatarCelular(customer.cell) || "N/A"}
            </td>
            <td>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "3px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                DADOS DO VEÍCULO
              </div>
              <strong>Marca / Modelo:</strong> {vehicle.brand} {vehicle.model}
              <br />
              <strong>Placa:</strong> {vehicle.license_plate} &nbsp;|&nbsp;{" "}
              <strong>KM Entrada:</strong> {entry_km || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SERVIÇOS REALIZADOS E MÃO DE OBRA */}
      <div className="section-title">Serviços Realizados</div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} className="text-center">
              #
            </th>
            <th style={{ width: "28%" }}>Descrição do Serviço</th>
            <th style={{ width: "5%" }} className="text-center">
              #
            </th>
            <th style={{ width: "28%" }}>Descrição do Serviço</th>
            <th style={{ width: "5%" }} className="text-center">
              #
            </th>
            <th style={{ width: "28%" }}>Descrição do Serviço</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => {
            // Calcula os índices para as 3 colunas duplas da linha atual
            const idx1 = rowIndex;
            const idx2 = rowIndex + 5;
            const idx3 = rowIndex + 10;

            const item1 = itemMaintenances[idx1];
            const item2 = itemMaintenances[idx2];
            const item3 = itemMaintenances[idx3];

            return (
              <tr key={rowIndex}>
                {/* Colunas 1 e 2 (Itens 1 a 5) */}
                <td className="text-center">{item1 ? idx1 + 1 : "\u00A0"}</td>
                <td>
                  {item1
                    ? item1.maintenancejob?.name || item1.description || ""
                    : "\u00A0"}
                </td>

                {/* Colunas 3 e 4 (Itens 6 a 10) */}
                <td className="text-center">{item2 ? idx2 + 1 : "\u00A0"}</td>
                <td>
                  {item2
                    ? item2.maintenancejob?.name || item2.description || ""
                    : "\u00A0"}
                </td>

                {/* Colunas 5 e 6 (Itens 11 a 15) */}
                <td className="text-center">{item3 ? idx3 + 1 : "\u00A0"}</td>
                <td>
                  {item3
                    ? item3.maintenancejob?.name || item3.description || ""
                    : "\u00A0"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PEÇAS E MATERIAIS */}
      <div className="section-title">Materiais e Peças Utilizados</div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} className="text-center">
              #
            </th>
            <th>Item / Peça</th>
            <th style={{ width: "8%" }} className="text-center">
              Qtd
            </th>
            <th style={{ width: "16%" }} className="text-right">
              Preço Unit.
            </th>
            <th style={{ width: "16%" }} className="text-right">
              Subtotal
            </th>
            <th style={{ width: "18%" }}>Fornecedor</th>
            <th style={{ width: "14%" }}>Recibo / NF</th>
          </tr>
        </thead>
        <tbody>
          {itemMaterials.length > 0 ? (
            itemMaterials.map((mat, idx) => {
              const subtotal =
                (Number(mat.quantity) || 0) * (parseFloat(mat.value_unit) || 0);
              return (
                <tr key={mat.id || idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{mat.material.name}</td>
                  <td className="text-center">{mat.quantity}</td>
                  <td className="text-right">
                    {formattedPrice(mat.value_unit)}
                  </td>
                  <td className="text-right">{formattedPrice(subtotal)}</td>
                  <td>{mat.supplier || "-"}</td>
                  <td>{mat.receipt || "-"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center"
                style={{ fontStyle: "italic", color: "#666" }}
              >
                Nenhum material/peça informado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* TOTALIZADORES */}
      <table className="totals-table">
        <tbody>
          <tr>
            <td style={{ width: "55%" }}></td>
            <td style={{ width: "25%" }} className="text-right">
              Total Mão de Obra:
            </td>
            <td style={{ width: "20%" }} className="text-right">
              {formattedPrice(labor_cost)}
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="text-right">Total Materiais/Peças:</td>
            <td className="text-right">{formattedPrice(totalMaterials)}</td>
          </tr>
          <tr className="grand-total-row">
            <td></td>
            <td className="text-right">TOTAL DA O.S.:</td>
            <td className="text-right">{formattedPrice(grandTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintableServiceOrder;
