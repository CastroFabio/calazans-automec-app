import React from "react";
import FormSectionHeader from "./FormSectionHeader.component";
import AutoComplete from "./AutoComplete.component";
import WizardBtn from "./WizardBtn.component";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";

const CustomerAndVehicleForm = ({
  title,
  icon,
  customers = [],
  serviceOrder = [],
  inputValue,
  selectedCustomerInfo,
  selectedVehicleInfo,
  onInputChange,
  handleFormFieldChange,
  handleSelectedVehicle,
  onSelect,
  onClear,
  renderOption,
  handleOpenCustomerModal,
  handleOpenVehicleModal,
  formDataEntryKm,
  dateTimeValue,
  handleChange,
  isAutocompleteDisabled = true,
}) => {
  return (
    <div className="form-section">
      <FormSectionHeader title={title} icon={icon} />
      <div className="fs-body">
        <div className="form-grid">
          <div>
            {isAutocompleteDisabled ? (
              <div className="field">
                <label>Cliente</label>
                <div className="input edit-order-input">
                  {serviceOrder.customer?.name || "—"}
                </div>
              </div>
            ) : (
              <>
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

                <WizardBtn
                  label="Novo cliente"
                  openModal={handleOpenCustomerModal}
                />
              </>
            )}
          </div>

          {isAutocompleteDisabled ? (
            <div className="field">
              <label>Veículo</label>
              <div className="input edit-order-input">
                <span>{serviceOrder.vehicle?.license_plate || "—"}</span>
                {serviceOrder.vehicle?.brand && (
                  <>{` · ${serviceOrder.vehicle.brand} ${serviceOrder.vehicle.model}`}</>
                )}
              </div>
            </div>
          ) : (
            <div className="field">
              <label>Veículo *</label>
              <div className="car-badge-row">
                {selectedCustomerInfo ? (
                  selectedCustomerInfo?.vehicles?.length > 0 ? (
                    selectedCustomerInfo?.vehicles?.length === 1 ? (
                      <div
                        className={`car-badge ${selectedVehicleInfo?.id === selectedCustomerInfo.vehicles[0].id ? "selected" : ""}`}
                        onClick={() =>
                          handleSelectedVehicle(
                            selectedCustomerInfo.vehicles[0],
                          )
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
                          onClick={handleSelectedVehicle}
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
          )}
          {isAutocompleteDisabled ? (
            <div className="field">
              <label>Km na Entrada</label>
              <div className="input edit-order-input-km">
                {serviceOrder.entry_km}
              </div>
            </div>
          ) : (
            <div className="field">
              <label>Km na entrada</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: 52.300 km"
                value={formDataEntryKm}
                onChange={(e) => {
                  handleFormFieldChange("entry_km", e.target.value);
                }}
              />
            </div>
          )}
          {isAutocompleteDisabled ? (
            <div className="field">
              <label>Data / Hora Entrada</label>
              <div className="input edit-order-input">
                {formatLocalDateTimeStringISO(serviceOrder.arrived_at)}
              </div>
            </div>
          ) : (
            <div className="field">
              <label>Data / Hora de Entrada</label>
              <input
                type="datetime-local"
                className="input"
                value={dateTimeValue}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAndVehicleForm;
