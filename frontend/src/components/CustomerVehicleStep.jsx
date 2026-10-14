import { useState } from "react";
import { useCustomers } from "../context/Customer.context";
import { parseInputValue } from "../utils/parseValue";
import { formatarCelular } from "../utils/convertCel";
import { formatLocalDateTime } from "../utils/convertDateTime";
import CustomerAndVehicleForm from "./CustomerAndVehicleForm.component";

const CATEGORIES = {
  customer: {
    icon: (
      <svg
        className="fs-header-svg"
        fill="none"
        stroke="black"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Cliente & Veículo",
  },
  service: {
    icon: (
      <svg
        className="fs-header-svg"
        fill="none"
        stroke="black"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Serviços & Materiais",
  },
  payment: {
    icon: (
      <svg
        className="fs-header-svg"
        fill="none"
        stroke="black"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Pagamento",
  },
  details: {
    icon: (
      <svg
        className="fs-header-svg"
        fill="none"
        stroke="black"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "DETALHES OS",
  },
};

const CustomerVehicleStep = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [formData, setFormData] = useState({
    professional: "",
    status: 1,
    paymentStatus: 1,
    arrived_at: new Date().toISOString(),
    entry_km: "",
    diagnosis: "",
    labor_cost: 0,
    observation: "",
    subtotal: 0,
    paid: 0,
    customer_id: "",
    vehicle_id: "",
  });
  const [selectedCustomerFromModal, setSelectedCustomerFromModal] = useState(
    {},
  );
  const [selectedVehicleFromModal, setSelectedVehicleFromModal] = useState({});
  const [isCustomerModalOpen, setCustomerIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setMaintenanceIsModalOpen] = useState(false);
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  const {
    getCustomerById,
    customers,
    selectedCustomerFromDetailPanel,
    setSelectedCustomerFromDetailPanel,
    addServiceOrderToCustomer,
  } = useCustomers();

  const handleSelectedVehicle = (vehicle) => {
    setSelectedVehicleInfo(vehicle);
    handleFormFieldChange("vehicle_id", vehicle.id);
  };

  const handleFormFieldChange = (field, value) => {
    if (field === "labor_cost" || field === "subtotal") {
      const cleanValue = parseInputValue(value);

      setFormData((prev) => ({
        ...prev,
        [field]: cleanValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChange = (event) => {
    setDateTimeValue(event.target.value);
    handleFormFieldChange("arrived_at", event.target.value);
  };

  const closeCustomerModal = () => {
    setCustomerIsModalOpen(false);
  };

  const handleOpenCustomerModal = () => {
    setCustomerIsModalOpen(true);
  };

  const closeVehicleModal = () => {
    setVehicleIsModalOpen(false);
  };

  const handleOpenVehicleModal = () => {
    setVehicleIsModalOpen(true);
  };

  const closeMaintenanceModal = () => {
    setMaintenanceIsModalOpen(false);
  };

  const handleOpenMaintenanceModal = () => {
    setMaintenanceIsModalOpen(true);
  };

  return (
    <>
      <CustomerAndVehicleForm
        title={CATEGORIES.customer.title}
        icon={CATEGORIES.customer.icon}
        isAutocompleteDisabled={false}
        customers={customers}
        inputValue={inputValue}
        selectedCustomerInfo={selectedCustomerInfo}
        selectedVehicleInfo={selectedVehicleInfo}
        onInputChange={(val) => setInputValue(val)}
        onSelect={(customer) => {
          setInputValue(customer.name);
          setSelectedCustomerInfo(customer);

          // Atualiza o ID do cliente no formData
          handleFormFieldChange("customer_id", customer.id);

          // Se o cliente possuir exatamente 1 veículo, seleciona-o automaticamente
          if (customer.vehicles?.length === 1) {
            handleSelectedVehicle(customer.vehicles[0]);
          } else {
            // Se tiver múltiplos veículos ou nenhum, limpa o veículo selecionado anteriormente
            setSelectedVehicleInfo(null);
            handleFormFieldChange("vehicle_id", "");
          }
        }}
        onClear={() => {
          setInputValue("");
          setSelectedCustomerInfo(null);
          setSelectedVehicleInfo(null);
          handleFormFieldChange("customer_id", "");
          handleFormFieldChange("vehicle_id", "");
          setSelectedCustomerFromDetailPanel({});
          setSelectedCustomerFromModal({});
          setSelectedVehicleFromModal({});
        }}
        renderOption={(customer) => (
          <>
            <div className="ac-option-name">{customer.name}</div>
            <div className="ac-option-sub">
              {`${formatarCelular(customer.cell)} · ${customer.vehicles?.length || 0} veículo(s)`}
            </div>
          </>
        )}
        handleOpenCustomerModal={handleOpenCustomerModal}
        handleOpenVehicleModal={handleOpenVehicleModal}
        formDataEntryKm={formData.entry_km}
        dateTimeValue={dateTimeValue}
        handleChange={handleChange}
        handleSelectedVehicle={(element) => handleSelectedVehicle(element)}
        handleFormFieldChange={handleFormFieldChange}
      />
      <div className="wz-panel" id="wzPanel0">
        <div className="wz-panel-inner">
          <div className="wz-panel-title">Quem é o cliente?</div>

          <div className="field" style={{ marginBottom: "16px" }}>
            <label>Cliente *</label>
            <div className="ac-wrap" id="acClientWrap">
              <div className="ac-input-row" id="acClientRow">
                <span className="ac-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  className="ac-input"
                  id="acClientInput"
                  type="text"
                  placeholder="Digite o nome do cliente..."
                  autoComplete="off"
                  onInput={(e) => acSearch("client", e.currentTarget.value)}
                  onFocus={() => acOpen("client")}
                  onKeyDown={(e) => acKey(e, "client")}
                />
                <span
                  className="ac-clear"
                  id="acClientClear"
                  onClick={() => acClear("client")}
                >
                  ×
                </span>
              </div>
              <div className="ac-dropdown" id="acClientDropdown"></div>
            </div>
            <button
              className="wz-link-btn"
              onClick={() => openModal("modalCliente")}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo cliente
            </button>
          </div>

          <div className="field" style={{ marginBottom: "16px" }}>
            <label>Veículo *</label>
            <div className="car-badge-row" id="carBadgeRow">
              <span style={{ fontSize: "12px", color: "var(--ink3)" }}>
                Selecione o cliente primeiro
              </span>
            </div>
            <button
              className="wz-link-btn"
              onClick={() => openModal("modalCarro")}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo veículo
            </button>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Km na entrada</label>
              <input
                type="text"
                className="input"
                id="kmEntrada"
                placeholder="Ex: 52.300 km"
              />
            </div>
            <div className="field">
              <label>Data / Hora de Entrada</label>
              <input type="datetime-local" className="input" id="dataEntrada" />
            </div>
          </div>
        </div>

        <div className="wz-footer">
          <button
            className="btn btn-ghost"
            onClick={() => navigate("os", null)}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => wzNext(0)}>
            Próximo — Serviços
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerVehicleStep;
