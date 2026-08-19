import React from "react";
import { formattedPrice } from "../utils/convertPrice";
import { statusMap, statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import {
  formatLocalDateTime,
  formatLocalDateTimeStringISO,
} from "../utils/convertDateTime";

const CustomerDetailPanel = ({ onClose, sidebarOpen, selectedCustomer }) => {
  const sumTotalValueServiceOrder = () => {
    const total = selectedCustomer.serviceOrders.reduce(
      (sum, current) => sum + current.subtotal,
      0,
    );

    const formattedTotal = formattedPrice(total);

    return formattedTotal;
  };

  const sumServiceOrdersByVehicle = (customerData, vehicleId) => {
    // Filtrar ordens de serviço do veículo específico
    const vehicleOrders =
      customerData.serviceOrders?.filter(
        (order) => order.vehicle_id === vehicleId,
      ) || [];

    // Calcular o subtotal total
    const total = vehicleOrders.reduce(
      (sum, order) => sum + (order.subtotal || 0),
      0,
    );

    // Detalhes adicionais
    return {
      vehicleId,
      total: total.toFixed(2),
      totalNumber: total,
      count: vehicleOrders.length,
      orders: vehicleOrders,
      average:
        vehicleOrders.length > 0
          ? (total / vehicleOrders.length).toFixed(2)
          : 0,
    };
  };

  const sumOrdersByStatus = (customerData, statusCode = 2) => {
    // Filtrar ordens pelo status
    const filteredOrders =
      customerData?.serviceOrders?.filter(
        (order) => order.status === statusCode,
      ) || [];

    // Calcular total
    const total = filteredOrders.reduce(
      (sum, order) => sum + (order.subtotal || 0),
      0,
    );

    const statusName = statusReverseMap[statusCode] || "Desconhecido";

    return {
      status: statusCode,
      statusName,
      total: total,
      totalFormatted: `R$ ${total.toFixed(2).replace(".", ",")}`,
      count: filteredOrders.length,
      orders: filteredOrders,
      average: filteredOrders.length > 0 ? total / filteredOrders.length : 0,
      averageFormatted:
        filteredOrders.length > 0
          ? `R$ ${(total / filteredOrders.length).toFixed(2).replace(".", ",")}`
          : "R$ 0,00",
      hasOrders: filteredOrders.length > 0,
    };
  };

  const formattedServiceOrderTitle = (selectedServiceOrder) => {
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
      id="clientOverlay"
      onClick={onClose}
    >
      <div
        className={`side-panel side-panel-customer ${sidebarOpen ? "open" : ""}`}
        id="clientPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="client-panel-header">
          <div className="client-panel-header-content">
            <div className="client-panel-avatar" id="cpAvatar">
              JP
            </div>
            <div className="client-panel-avatar-name-sub">
              <div className="client-panel-avatar-name" id="cpName">
                {selectedCustomer.name}
              </div>
              <div className="client-panel-avatar-sub" id="cpSub">
                {`Tel: ${selectedCustomer.telephone} · Cel: ${selectedCustomer.cell} · `}
                {selectedCustomer.observation ? (
                  <span className="client-panel-observation">
                    {selectedCustomer.observation}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button className="sp-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="client-panel-cards-container" id="cpStats">
            <div className="cp-stat">
              <div className="cp-stat-val">
                {selectedCustomer.serviceOrders.length}
              </div>
              <div className="cp-stat-lbl">OS Total</div>
            </div>
            <div className="cp-stat">
              <div className="cp-stat-val">
                {
                  sumOrdersByStatus(selectedCustomer, statusMap["Em andamento"])
                    .count
                }
              </div>
              <div className="cp-stat-lbl">Em andamento</div>
            </div>
            <div className="cp-stat">
              <div className="cp-stat-val">{sumTotalValueServiceOrder()}</div>
              <div className="cp-stat-lbl">Gasto total</div>
            </div>
          </div>
        </div>
        <div className="sp-body" id="cpBody">
          <div className="cp-section">
            <div className="cp-section-title">
              {`Veículos (${selectedCustomer.vehicles.length})`}
            </div>
            {selectedCustomer.vehicles.length > 0 ? (
              selectedCustomer.vehicles.map((element) => (
                <div key={element.id} className="car-detail-card">
                  <div className="car-detail-card-container">
                    <div className="car-detail-card-container-flex">
                      <div className="car-detail-card-margin-bottom">
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {element.license_plate}
                          </span>
                          <span className="svc-tag car-tag-model">
                            {`${element.brand} ${element.model}`}
                          </span>
                        </span>
                      </div>
                      <div className="car-tag-color">Cinza</div>
                    </div>
                    <span className="badge badge-pri-normal car-tag-badge">
                      {`
                      ${
                        sumServiceOrdersByVehicle(selectedCustomer, element.id)
                          .count
                      } OS`}
                    </span>
                  </div>
                  <div className="car-entry-km">
                    <span className="car-entry-km-title">Gasto Total:</span>
                    <span className="car-entry-km-info">
                      {
                        sumServiceOrdersByVehicle(selectedCustomer, element.id)
                          .total
                      }
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="car-detail-no-car">
                Nenhum veículo cadastrado.
              </div>
            )}
          </div>

          <div className="cp-section">
            <div className="cp-section-title">
              {`Ordens de Serviço (${selectedCustomer.serviceOrders.length})`}
            </div>
            {selectedCustomer.serviceOrders.map((element) => (
              <div key={element.id} className="os-mini-row">
                <div className="car-panel-service-order-container">
                  <div className="car-panel-service-order-header">
                    <span className="os-mini-id">{`#${element.id}`}</span>
                    <span className="badge car-panel-service-order-status-badge">
                      {statusReverseMap[element.status]}
                    </span>
                    <span className="badge car-panel-service-order-priority-badge">
                      {priorityReverseMap[element.priority]}
                    </span>
                  </div>
                  <div className="os-mini-svc">
                    {formattedServiceOrderTitle(element)}
                  </div>
                  <div className="os-mini-svc-car">
                    {`${element.vehicle.license_plate} · ${element.vehicle.brand} ${element.vehicle.model} · ${formatLocalDateTimeStringISO(element.arrived_at)}`}
                  </div>
                </div>
                <div className="os-mini-val">
                  {element.paid >= element.subtotal ? (
                    <div className="texto-riscado">
                      {formattedPrice(element.subtotal)}
                    </div>
                  ) : (
                    formattedPrice(element.subtotal)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sp-footer">
          <button className="btn btn-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Veículo
          </button>
          <button
            className="btn btn-primary btn-new-os-customer"
            id="cpNewOSBtn"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Nova OS para este cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPanel;
