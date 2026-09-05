import { formattedPrice } from "../utils/convertPrice";
import { statusMap, statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import VehicleBadge from "./VehicleBadge.component";
import { formatarCelular } from "../utils/convertCel";
import { getCustomerNameInitials } from "../utils/CustomerInitials";
import { useCustomers } from "../context/Customer.context";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../utils/paths";

const CustomerDetailPanel = ({ onClose, sidebarOpen, selectedCustomer }) => {
  const { setSelectedCustomerFromDetailPanel, getCustomerById } =
    useCustomers();

  const navigate = useNavigate();

  const sumTotalValueServiceOrder = () => {
    const total = selectedCustomer.serviceOrders.reduce(
      (sum, current) => sum + parseFloat(current.subtotal),
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
      (sum, order) => sum + (parseFloat(order.subtotal) || 0),
      0,
    );

    // Detalhes adicionais
    return {
      vehicleId,
      total: total,
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
      totalFormatted: formattedPrice(total),
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
            <div className={`client-panel-avatar bg-${selectedCustomer.color}`}>
              {getCustomerNameInitials(selectedCustomer.name)}
            </div>
            <div className="client-panel-avatar-name-sub">
              <div className={`client-panel-avatar-name `}>
                {selectedCustomer.name}
              </div>
              <div className="client-panel-avatar-sub" id="cpSub">
                {`Cel: ${formatarCelular(selectedCustomer.cell)}`}
                {selectedCustomer.telephone ? (
                  <>{` · Tel: ${formatarCelular(selectedCustomer.telephone)}`}</>
                ) : (
                  ""
                )}
                {selectedCustomer.observation ? (
                  <span className="client-panel-observation">
                    {` · ${selectedCustomer.observation}`}
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
                {selectedCustomer?.serviceOrders?.length || 0}
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
                        <VehicleBadge vehicle={element} />
                      </div>
                      <div className="car-tag-color">{`${element.color}  ·  ${element.year}`}</div>
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
                    <div className="car-entry-km-container">
                      <span className="car-entry-km-title">Gasto Total:</span>
                      <span className="car-entry-km-info">
                        {formattedPrice(
                          sumServiceOrdersByVehicle(
                            selectedCustomer,
                            element.id,
                          ).total,
                        )}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-primary btn-nova-os-detail-customer"
                      onClick={() => {
                        const selectedCustomerFromContext = getCustomerById(
                          selectedCustomer.id,
                        );
                        const selectedCustomerForNewOS = {
                          ...selectedCustomerFromContext,
                          vehicles: [element],
                        };
                        setSelectedCustomerFromDetailPanel(
                          selectedCustomerForNewOS,
                        );

                        navigate(PATHS.newServiceOrder);
                      }}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Nova OS
                    </button>
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
              {`Ordens de Serviço (${selectedCustomer?.serviceOrders?.length || 0})`}
            </div>
            {selectedCustomer?.serviceOrders?.length > 0 ? (
              selectedCustomer?.serviceOrders?.map((element) => (
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
              ))
            ) : (
              <div className="car-detail-no-car">
                Nenhuma ordem de serviço cadastrada.
              </div>
            )}
          </div>
        </div>
        {/* <div className="sp-footer">
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
        </div> */}
      </div>
    </div>
  );
};

export default CustomerDetailPanel;
