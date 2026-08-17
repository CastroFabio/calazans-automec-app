import React from "react";
import { statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formattedPrice } from "../utils/convertPrice";
import { useNavigate } from "react-router-dom";

const ServiceOrderDetailPanel = ({
  onClose,
  sidebarOpen,
  selectedServiceOrder,
}) => {
  const navigate = useNavigate();

  const formattedServiceOrderTitle = () => {
    const maintenanceJobCount = selectedServiceOrder.itemMaintenances.length;
    if (maintenanceJobCount > 1)
      return (
        selectedServiceOrder.itemMaintenances[0].maintenancejob.name +
        " +" +
        (maintenanceJobCount - 1)
      );
    else if (maintenanceJobCount === 0)
      return "Ordem de Serviço #" + selectedServiceOrder.id;
    return selectedServiceOrder.itemMaintenances[0].maintenancejob.name;
  };

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
        <div className="sp-header">
          <div className="sp-client-vehicle-detail">
            <div className="sp-header-id" id="spId">
              {`#${selectedServiceOrder.id}`}
            </div>
            <div className="sp-header-title" id="spTitle">
              {formattedServiceOrderTitle()}
            </div>
            <div className="sp-header-badges" id="spBadges">
              <span className="badge ${statusClass[os.status]} sp-header-badges-status">
                {statusReverseMap[selectedServiceOrder.status]}
              </span>
              <span className="badge ${priClass[os.prioridade]}">
                {priorityReverseMap[selectedServiceOrder.priority]}
              </span>
            </div>
          </div>
          <button className="sp-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="sp-body">
          <div className="sp-grid sp-body-grid" id="spMeta">
            <div className="sp-section">
              <div className="sp-label">Cliente</div>
              <div className="sp-value">
                {selectedServiceOrder.customer.name}
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Veículo</div>
              <span className="car-tag-group">
                <span className="svc-tag car-tag-placa">
                  {selectedServiceOrder.vehicle.license_plate}
                </span>
                <span className="svc-tag car-tag-model">{`${selectedServiceOrder.vehicle.brand} ${selectedServiceOrder.vehicle.model}`}</span>
              </span>
            </div>
            <div className="sp-section">
              <div className="sp-label">Cor</div>
              <div className="sp-value">-</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Km Entrada</div>
              <div className="sp-value">{selectedServiceOrder.entry_km}</div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Técnico</div>
              <div className="sp-value">
                {selectedServiceOrder.professional}
              </div>
            </div>
            <div className="sp-section">
              <div className="sp-label">Valor</div>
              <div className="sp-value">
                <span className="sp-subtotal">
                  {formattedPrice(selectedServiceOrder.subtotal)}
                </span>
              </div>
            </div>
          </div>
          <div className="sp-section">
            <div className="sp-label">Serviços</div>
            <div id="spServices">
              {selectedServiceOrder.itemMaintenances.map((element, index) => (
                <div key={index} className="sp-services-list">
                  <div className="sp-services-item-number">{index + 1}</div>
                  <span className="sp-services-item">
                    {element.maintenancejob.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="sp-section">
            <div className="sp-label">Peças & Materiais</div>
            {selectedServiceOrder.itemMaterials.map((element, index) => (
              <div key={index} id="spMaterials">
                <div className="sp-material-item">
                  · {element.material.name}
                </div>
              </div>
            ))}
          </div>
          <div className="sp-section">
            <div className="sp-label">Diagnóstico</div>
            <div className="sp-value sp-value-diagnostic" id="spDesc">
              {selectedServiceOrder.diagnosis}
            </div>
          </div>
          {/* <div className="sp-section">
            <div className="sp-label sp-label-acompanhamento">
              Acompanhamento
            </div>
            <div className="timeline" id="spTimeline">
              <div className="t-item">
                <div className="t-dot ${item.s}"></div>
                <div>
                  <div className="t-title">Item na timeline</div>$
                  {item.d ? <div className="t-date">${item.d}</div> : ""}$
                  {item.n ? <div className="t-note">${item.n}</div> : ""} 
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="sp-footer">
          <button
            className="btn btn-primary btn-editar-atualizar-os"
            onClick={() =>
              navigate(`/service-order/edit/${selectedServiceOrder.id}`)
            }
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
          <button className="btn btn-danger">Cancelar OS</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderDetailPanel;
