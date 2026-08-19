import React from "react";
import { useNavigate } from "react-router-dom";
import { statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formattedPrice } from "../utils/convertPrice";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";

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

  // ========== DESTRUTURAÇÃO COM FALLBACKS ==========
  const order = selectedServiceOrder;
  const customer = order.customer || {};
  const vehicle = order.vehicle || {};

  // Garantir que os arrays existem
  const itemMaintenances = safeArray(order.itemMaintenances);
  const itemMaterials = safeArray(order.itemMaterials);

  // ========== HANDLERS ==========
  const handleEditOrder = () => {
    navigate(`/service-order/edit/${order.id}`);
    if (onClose) onClose();
  };

  const handleCancelOrder = () => {
    if (
      !window.confirm("Tem certeza que deseja cancelar esta ordem de serviço?")
    ) {
      return;
    }
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
              <span className={`badge status-${order.status || 0}`}>
                {statusReverseMap[order.status] || "Desconhecido"}
              </span>
              <span className={`badge priority-${order.priority || 0}`}>
                {priorityReverseMap[order.priority] || "Desconhecido"}
              </span>
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
                  <span className="car-tag-group">
                    <span className="svc-tag car-tag-placa">
                      {vehicle.license_plate}
                    </span>
                    <span className="svc-tag car-tag-model">
                      {vehicle.brand} {vehicle.model}
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Cor</div>
              <div className="sp-value">—</div>
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

          {/* ===== PEÇAS & MATERIAIS - CORRIGIDO ===== */}
          <div className="sp-section">
            <div className="sp-label">
              Peças & Materiais ({itemMaterials.length})
            </div>
            <div id="spMaterials">
              {itemMaterials.length > 0 ? (
                itemMaterials.map((element, index) => (
                  <div key={element.id || index} className="sp-material-item">
                    <span className="sp-material-name">
                      · <strong>{element.material?.name || "Material"}</strong>
                    </span>{" "}
                    {element.quantity && (
                      <span className="sp-material-qty">
                        {element.quantity}x
                      </span>
                    )}{" "}
                    {element.value_unity && (
                      <span className="sp-material-value">
                        {formattedPrice(element.value_unity)}
                      </span>
                    )}{" "}
                    {element.supplier && (
                      <span className="sp-material-ref">
                        <strong>Loja:</strong> {element.supplier}
                      </span>
                    )}{" "}
                    {element.receipt && (
                      <span className="sp-material-ref">
                        <strong>Recibo:</strong>
                        {element.receipt}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-text">Nenhum material registrado</div>
              )}
            </div>
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
