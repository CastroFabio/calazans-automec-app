import React, { useEffect, useState } from "react";
import { formatarCelular } from "../utils/convertCel";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusReverseMap } from "../utils/statusMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { formattedPrice } from "../utils/convertPrice";
import ServiceOrderPrintBody from "../components/ServiceOrderPrintBody.component";
import PrintableServiceOrder from "../components/PrintableServiceOrder.component";

import Loading from "./Loading";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { formatServiceOrderTitle } from "../utils/formatServiceOrderTitle";

import printStyles from "../utils/print.styles.css?inline";

const PrintServiceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceOrder, setServiceOrder] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const componentRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

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
  }, [id]);

  const formatFilename = (text) => {
    if (!text) return "";
    // Uses a regular expression (g flag) to replace all spaces globally
    return text.trim().replace(/\s+/g, "_");
  };

  const handlePrint = useReactToPrint({
    documentTitle: `Ordem_de_Servico_${formatFilename(serviceOrder?.customer?.name) || "Cliente"}_#${id || "Oficina"}`,
    contentRef: componentRef,
    ignoreGlobalStyles: true, // Turns off the application's broken global styles
    pageStyle: printStyles, // Inject your completely fresh, untainted stylesheet
  });

  if (loading) return <Loading />;
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
          <button className="btn btn-primary" onClick={handlePrint}>
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
          <ServiceOrderPrintBody
            componentRef={componentRef}
            serviceOrder={serviceOrder}
          />
          {/* <PrintableServiceOrder /> */}
        </div>
      </div>
    </div>
  );
};

export default PrintServiceOrder;
