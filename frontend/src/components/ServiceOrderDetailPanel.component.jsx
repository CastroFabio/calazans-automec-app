import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { statusMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formattedPrice } from "../utils/convertPrice";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { orderApi } from "../api/orders";
import { useServiceOrders } from "../context/ServiceOrder.context";
import StatusBadge from "./StatusBadge.component";
import VehicleBadge from "./VehicleBadge.component";

// ========== FUNÇÕES AUXILIARES ==========

/**
 * Garante que um valor seja um array
 */
const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/**
 * Formata o título da OS baseado nos serviços
 */
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

/**
 * Verifica se a ordem tem dados suficientes
 */
const isValidOrder = (order) => {
  return order && typeof order === "object" && order.id;
};

// ========== COMPONENTE PRINCIPAL ==========

const ServiceOrderDetailPanel = ({
  onClose,
  sidebarOpen,
  selectedServiceOrder,
}) => {
  const navigate = useNavigate();

  // ========== DESTRUTURAÇÃO COM FALLBACKS (Definidos antes de Hooks) ==========

  console.log(selectedServiceOrder);

  const [order, setOrder] = useState(selectedServiceOrder || {});
  const customer = order.customer || {};
  const vehicle = order.vehicle || {};

  const { updateServiceOrder } = useServiceOrders();

  // Garantir que os arrays existem
  const itemMaintenances = safeArray(order.itemMaintenances);
  const itemMaterials = safeArray(order.itemMaterials);

  // ========== AGRUPAMENTO COM USEMEMO ==========
  const groupedMaterials = useMemo(() => {
    if (!itemMaterials || itemMaterials.length === 0) return [];

    const groups = itemMaterials.reduce((acc, item) => {
      // Normalização de chaves para evitar duplicações por espaços ou maiúsculas/minúsculas
      const supplierStr = (item.supplier || "Sem Fornecedor").trim();
      const receiptStr = (item.receipt || "Sem Recibo").trim();
      const groupKey = `${supplierStr.toLowerCase()}_${receiptStr.toLowerCase()}`;

      if (!acc[groupKey]) {
        acc[groupKey] = {
          supplier: supplierStr,
          receipt: receiptStr,
          items: [],
        };
      }

      acc[groupKey].items.push(item);
      return acc;
    }, {});

    return Object.values(groups);
  }, [itemMaterials]);

  // ========== VALIDAÇÃO INICIAL ==========
  if (!sidebarOpen) return null;

  if (!selectedServiceOrder || !isValidOrder(selectedServiceOrder)) {
    return (
      <div className={`overlay open`} onClick={onClose}>
        <div className={`side-panel open`} onClick={(e) => e.stopPropagation()}>
          <div className="sp-header">
            <div className="sp-header-title">Nenhuma ordem selecionada</div>
            <button className="sp-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="sp-body">
            <div className="empty-state">
              <p>Clique em uma ordem de serviço para ver os detalhes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== HANDLERS ==========
  const handleEditOrder = () => {
    navigate(`/service-order/edit/${order.id}`);
    if (onClose) onClose();
  };

  const handlePrintOrder = () => {
    navigate(`/service-order/print/${order.id}`);
    if (onClose) onClose();
  };

  const handleCancelOrder = async () => {
    if (
      !window.confirm("Tem certeza que deseja cancelar esta ordem de serviço?")
    ) {
      return;
    }

    if (!selectedServiceOrder) return;
    await orderApi.update(selectedServiceOrder.id, {
      status: statusMap.Cancelada,
    });

    setOrder({
      ...selectedServiceOrder,
      status: statusMap.Cancelada,
    });

    updateServiceOrder({
      ...selectedServiceOrder,
      status: statusMap.Cancelada,
    });
  };

  // ========== RENDER ==========
  return (
    <div
      className={`overlay ${sidebarOpen ? "open" : ""}`}
      id="osOverlay"
      onClick={onClose}
    >
      <div
        className={`side-panel ${sidebarOpen ? "open" : ""}`}
        id="osPanel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== HEADER ========== */}
        <div className="sp-header">
          <div className="sp-client-vehicle-detail">
            <div className="sp-header-id" id="spId">
              #{order.id}
            </div>
            <div className="sp-header-title" id="spTitle">
              {formatServiceOrderTitle(order)}
            </div>
            <div className="sp-header-badges" id="spBadges">
              <StatusBadge status={order.status} />
            </div>
          </div>
          <button className="sp-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* ========== BODY ========== */}
        <div className="sp-body">
          {/* ===== INFORMAÇÕES GERAIS ===== */}
          <div className="sp-grid sp-body-grid" id="spMeta">
            <div className="sp-section">
              <div className="sp-label">Cliente</div>
              <div className="sp-value">{customer.name || "—"}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Veículo</div>
              <div className="sp-value">
                {vehicle.license_plate ? (
                  <VehicleBadge vehicle={vehicle} />
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Cor</div>
              <div className="sp-value">{vehicle.color || "—"}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Ano</div>
              <div className="sp-value">{vehicle.year || "—"}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Km Entrada</div>
              <div className="sp-value">{order.entry_km || "—"}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Técnico</div>
              <div className="sp-value">{order.professional || "—"}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Valor Total</div>
              <div className="sp-value">
                <span className="sp-subtotal">
                  {formattedPrice(order.subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* ===== SERVIÇOS ===== */}
          <div className="sp-section">
            <div className="sp-label">Serviços ({itemMaintenances.length})</div>
            <div id="spServices">
              {itemMaintenances.length > 0 ? (
                itemMaintenances.map((element, index) => (
                  <div key={element.id || index} className="sp-services-list">
                    <div className="sp-services-item-number">{index + 1}</div>
                    <span className="sp-services-item">
                      {element.maintenancejob?.name || "Serviço personalizado"}
                    </span>
                    {element.value_unity && (
                      <span className="sp-services-value">
                        {formattedPrice(element.value_unity)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-text">Nenhum serviço registrado</div>
              )}
            </div>
          </div>

          {/* ===== PEÇAS & MATERIAIS - AGRUPADO POR RECIBO E FORNECEDOR ===== */}
          <div className="sp-section">
            <div className="sp-label">
              Peças & Materiais ({itemMaterials.length})
            </div>

            {groupedMaterials.length > 0 ? (
              groupedMaterials.map((group) => {
                const groupKey = `${group.supplier}-${group.receipt}`;

                return (
                  <fieldset
                    key={groupKey}
                    className="detail-panel-service-order-material-fieldset"
                  >
                    <legend className="detail-panel-service-order-material-legend">
                      <span className="detail-panel-service-order-supplier">
                        {group.supplier}
                      </span>{" "}
                      ·{" "}
                      <span className="detail-panel-service-order-receipt">
                        Recibo {group.receipt}
                      </span>
                    </legend>

                    {group.items.map((element, itemIdx) => (
                      <div
                        key={element.id || itemIdx}
                        className="detail-panel-service-order-material-container"
                      >
                        <span className="detail-panel-service-order-material-name">
                          · {element.material?.name || "Material sem nome"}
                        </span>
                        <span className="detail-panel-service-order-material-price">
                          {`${Number(element.quantity || 1)}x ${parseFloat(
                            element.value_unit || 0,
                          ).toFixed(2)} (${formattedPrice(
                            parseFloat(element.value_unit || 0) *
                              Number(element.quantity || 1),
                          )})`}
                        </span>
                      </div>
                    ))}
                  </fieldset>
                );
              })
            ) : (
              <div className="empty-text">Nenhum material registrado</div>
            )}
          </div>

          {/* ===== DIAGNÓSTICO ===== */}
          <div className="sp-section">
            <div className="sp-label">Diagnóstico</div>
            <div className="sp-value sp-value-diagnostic" id="spDesc">
              {order.diagnosis || "Sem diagnóstico"}
            </div>
          </div>

          {/* ===== OBSERVAÇÕES ===== */}
          <div className="sp-section">
            <div className="sp-label">Observações</div>
            <div className="sp-value sp-value-observation" id="spObservation">
              {order.observation || "Sem observações"}
            </div>
          </div>

          {/* ===== DATA DE ENTRADA ===== */}
          <div className="sp-section">
            <div className="sp-label">Data de Entrada</div>
            <div className="sp-value">
              {formatLocalDateTimeStringISO(order.arrived_at) || "—"}
            </div>
          </div>
        </div>

        {/* ========== FOOTER ========== */}
        <div className="sp-footer">
          <button className="btn btn-secondary" onClick={handlePrintOrder}>
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
          <button
            className="btn btn-primary btn-editar-atualizar-os"
            onClick={handleEditOrder}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar / Atualizar OS
          </button>
          <button className="btn btn-danger" onClick={handleCancelOrder}>
            Cancelar OS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderDetailPanel;
