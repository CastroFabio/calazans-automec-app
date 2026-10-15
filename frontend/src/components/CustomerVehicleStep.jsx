import { useEffect, useState } from "react";
import AutoComplete from "./AutoComplete.component";
import WizardBtn from "./WizardBtn.component";
import NewCustomerModal from "./NewCustomerModal.component";
import NewVehicleModal from "./NewVehicleModal.component";
import { useCustomers } from "../context/Customer.context";
import { formatLocalDateTime } from "../utils/convertDateTime";
import ErrorAlert from "./ErrorAlert.component";

const CustomerVehicleStep = ({
  isCustomerVehicleOn,
  setFormData,
  formData,
  inputValue,
  setSelectedCustomerInfo,
  selectedCustomerInfo,
  selectedVehicleInfo,
  selectedCustomerFromModal,
  setSelectedCustomerFromModal,
  setSelectedVehicleFromModal,
  selectedVehicleFromModal,
  handleFormFieldChange,
  handleSelectedVehicle,
  onInputChange,
  onSelect,
  onClear,
  renderOption,
}) => {
  const { customers, getCustomerById } = useCustomers();

  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );
  const [isCustomerModalOpen, setCustomerIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleIsModalOpen] = useState(false);
  const [error, setError] = useState({ title: "", sub: "", isErrorOn: false });

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

  const wzNext = () => {
    if (!formData.customer_id) {
      setError({
        title: "Cliente obrigatório",
        sub: "Selecione um cliente da lista antes de continuar.",
        isErrorOn: true,
      });
      return;
    }

    if (!formData.vehicle_id) {
      setError({
        title: "Veículo obrigatório",
        sub: "Selecione um veículo da lista antes de continuar.",
        isErrorOn: true,
      });
      return;
    }

    if (!formData.entry_km) {
      setError({
        title: "Inserir quilometragem",
        sub: "Inserir quilometragem antes de continuar.",
        isErrorOn: true,
      });
      return;
    }
  };

  useEffect(() => {
    if (Object.keys(selectedCustomerFromModal).length !== 0) {
      setSelectedCustomerInfo(selectedCustomerFromModal);
      setFormData((prev) => ({
        ...prev,
        customer_id: selectedCustomerFromModal.id,
      }));
    }
    if (Object.keys(selectedVehicleFromModal).length !== 0) {
      handleSelectedVehicle(selectedVehicleFromModal);
      setSelectedCustomerInfo((prev) => ({
        ...prev,
        vehicles: [selectedVehicleFromModal],
      }));
      setFormData((prev) => ({
        ...prev,
        vehicle_id: selectedVehicleFromModal.id,
      }));
    }
  }, [
    selectedCustomerFromModal,
    selectedVehicleInfo,
    selectedVehicleFromModal,
  ]);

  return (
    <div
      className="wz-panel"
      id="wzPanel0"
      style={{
        display: `${isCustomerVehicleOn}:'flex'?'none'`,
      }}
    >
      <div className="wz-panel-inner">
        <ErrorAlert
          title={error.title}
          sub={error.sub}
          error={error.isErrorOn}
          onClose={() => setError((prev) => ({ ...prev, isErrorOn: false }))}
        />
        <div className="wz-panel-title">Quem é o cliente?</div>
        <div className="field" style={{ marginBottom: "16px" }}>
          <AutoComplete
            label="Cliente *"
            placeholder="Digite o nome do cliente..."
            items={customers}
            filterKey="name"
            value={inputValue}
            selectedItem={selectedCustomerInfo}
            onInputChange={onInputChange}
            onSelect={onSelect}
            onClear={onClear}
            renderOption={renderOption}
          />
          <WizardBtn label="Novo cliente" openModal={handleOpenCustomerModal} />
        </div>
        <div className="field" style={{ marginBottom: "16px" }}>
          <label>Veículo *</label>
          <div className="car-badge-row">
            {selectedCustomerInfo ? (
              selectedCustomerInfo?.vehicles?.length > 0 ? (
                selectedCustomerInfo?.vehicles?.length === 1 ? (
                  <div
                    className={`car-badge ${selectedVehicleInfo?.id === selectedCustomerInfo.vehicles[0].id ? "selected" : ""}`}
                    onClick={() =>
                      handleSelectedVehicle(selectedCustomerInfo.vehicles[0])
                    }
                  >
                    <svg
                      className="car-badge-svg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm-1-9l-3-6H7l-3 6H1v4h22v-4h-3z"
                      />
                    </svg>
                    {`${selectedCustomerInfo?.vehicles[0].license_plate} · ${selectedCustomerInfo?.vehicles[0].brand} ${selectedCustomerInfo?.vehicles[0].model}`}
                  </div>
                ) : (
                  selectedCustomerInfo.vehicles.map((element, index) => (
                    <div
                      className={`car-badge ${selectedVehicleInfo?.id === element.id ? "selected" : ""}`}
                      key={element.id || index}
                      onClick={() => handleSelectedVehicle(element)}
                    >
                      <svg
                        className="car-badge-svg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm-1-9l-3-6H7l-3 6H1v4h22v-4h-3z"
                        />
                      </svg>
                      {`${element.license_plate} · ${element.brand} ${element.model}`}
                    </div>
                  ))
                )
              ) : (
                <>
                  <span className="car-badge-row-text-no-car">
                    Nenhum veículo cadastrado
                  </span>
                  <button
                    className="add-row-btn add-row-btn-car-badge"
                    onClick={handleOpenVehicleModal}
                  >
                    + Cadastrar veículo
                  </button>
                </>
              )
            ) : (
              <span className="car-badge-row-text">
                Selecione o cliente primeiro
              </span>
            )}
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Km na entrada</label>
            <input
              type="text"
              className="input"
              placeholder="Ex: 52.300 km"
              value={formData.entry_km}
              onChange={(e) => {
                handleFormFieldChange("entry_km", e.target.value);
              }}
            />
          </div>
          <div className="field">
            <label>Data / Hora de Entrada</label>
            <input
              type="datetime-local"
              className="input"
              value={dateTimeValue}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="wz-footer">
        <button className="btn btn-ghost" onClick={() => navigate("os", null)}>
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

      {isCustomerModalOpen && (
        <NewCustomerModal
          isOpen={isCustomerModalOpen}
          onClose={closeCustomerModal}
          customerName={inputValue}
          setSelectedCustomerFromNewServiceOrder={setSelectedCustomerFromModal}
        />
      )}
      {isVehicleModalOpen && (
        <NewVehicleModal
          isModalOpen={isVehicleModalOpen}
          onClose={closeVehicleModal}
          selectedCustomer={getCustomerById(selectedCustomerInfo.id)}
          setSelectedVehicleFromNewServiceOrder={setSelectedVehicleFromModal}
        />
      )}
    </div>
  );
};

export default CustomerVehicleStep;
