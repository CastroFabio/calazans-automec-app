import { useState } from "react";
import AutoCompleteCustomer from "./AutoCompleteCustomer";
import { formatLocalDateTime } from "../utils/convertDateTime";

const NewOrderCustomerVehicle = ({ handleFormFieldChange, formData }) => {
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState({});
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  const handleSelectedVehicle = (vehicle) => setSelectedVehicleInfo(vehicle);

  const handleChange = (event) => {
    setDateTimeValue(event.target.value);
  };

  return (
    <div className="form-section">
      <div className="fs-header">
        <svg
          className="fs-header-svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="fs-title">Cliente & Veículo</span>
      </div>
      <div className="fs-body">
        <div className="form-grid">
          <div className="field">
            <label>Cliente *</label>
            {/* <!-- Autocomplete Cliente --> */}
            <AutoCompleteCustomer
              selectedCustomerInfo={selectedCustomerInfo}
              setSelectedCustomerInfo={setSelectedCustomerInfo}
              setSelectedVehicleInfo={setSelectedVehicleInfo}
            />
          </div>
          <div className="field">
            <label>Veículo *</label>
            <div className="car-badge-row">
              {selectedCustomerInfo &&
              Object.keys(selectedCustomerInfo).length > 0 ? (
                selectedCustomerInfo.vehicle.length > 0 ? (
                  selectedCustomerInfo.vehicle.map((element, index) => (
                    <div
                      className={`car-badge ${selectedVehicleInfo === element ? "selected" : ""}`}
                      key={index}
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
                      {`${element.licensePlate} · ${element.brand} ${element.model}`}
                    </div>
                  ))
                ) : (
                  <>
                    <span className="car-badge-row-text-no-car">
                      Nenhum veículo cadastrado
                    </span>
                    <button className="add-row-btn add-row-btn-car-badge">
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
          <div className="field">
            <label>Km na entrada</label>
            <input
              type="text"
              className="input"
              placeholder="Ex: 52.300 km"
              value={formData.entry_km}
              onChange={(e) =>
                handleFormFieldChange("entry_km", e.target.value)
              }
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
    </div>
  );
};

export default NewOrderCustomerVehicle;
