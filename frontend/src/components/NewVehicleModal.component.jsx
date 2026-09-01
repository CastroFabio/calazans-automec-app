import React, { useState } from "react";

import { vehicleApi } from "../api/vehicle";
import { useCustomers } from "../context/Customer.context";
import AutoComplete from "./AutoComplete.component";
import { PATHS } from "../utils/paths";
import { useNavigate } from "react-router-dom";

const NewVehicleModal = ({ isModalOpen, onClose, selectedCustomer = null }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    brand: "",
    color: "",
    year: "",
    model: "",
    license_plate: "",
  });
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCustomerInfo, setSelectedCustomerInfo] =
    useState(selectedCustomer);

  const { addVehicleToCustomer, customers } = useCustomers();
  const navigate = useNavigate();

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeWindow = () => {
    setFormData({
      customer_id: "",
      brand: "",
      color: "",
      year: "",
      model: "",
      license_plate: "",
    });
    onClose();
  };

  const handleSaveVehicle = async () => {
    if (!formData.license_plate.trim()) {
      setError("Placa é obrigatória.");
      return;
    }

    if (!Number(formData.year.trim())) {
      setError("Ano deve ser número.");
      return;
    }

    const vehicleData = {
      customer_id: selectedCustomerInfo.id,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      color: formData.color.trim(),
      year: Number(formData.year.trim()),
      license_plate: formData.license_plate.trim(),
    };

    try {
      setError(null);

      const { data } = await vehicleApi.create(vehicleData);

      addVehicleToCustomer(selectedCustomerInfo.id, data);

      setFormData({
        customer_id: "",
        brand: "",
        color: "",
        year: "",
        model: "",
        license_plate: "",
      });

      onClose();
      navigate(PATHS.customer);
    } catch (err) {
      console.error("Erro ao salvar veículo no cliente:", err);

      let errorMessage = "Erro ao salvar veículo no cliente";
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Dados:", err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
    }
  };

  return (
    <div
      className={`modal-overlay ${isModalOpen ? "open" : ""}`}
      id="modalCarro"
      onClick={onClose}
    >
      <div
        className="modal modal-container-vehicle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">Cadastrar Veículo</span>
          <button className="sp-close" onClick={closeWindow}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="field modal-vehicle-field-customer">
            <AutoComplete
              inputValue={inputValue}
              setInputValue={setInputValue}
              customerData={customers}
              setSelectedCustomerInfo={(customer) => {
                setSelectedCustomerInfo(customer);
                if (customer) handleFormFieldChange("customer_id", customer.id);
              }}
              selectedCustomerInfo={selectedCustomerInfo}
              handleFormFieldChange={handleFormFieldChange}
              setSelectedVehicleInfo={() => {}}
              handleSelectedVehicle={() => {}}
            />
          </div>

          <div className="form-grid g3 modal-container-vehicle-select">
            <div className="field">
              <label>Placa *</label>
              <input
                type="text"
                className="input modal-container-vehicle-input"
                placeholder="ABC-1D23"
                maxLength="8"
                value={formData.license_plate}
                onChange={(e) =>
                  handleFormFieldChange("license_plate", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Marca</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Honda"
                value={formData.brand || ""}
                onChange={(e) => handleFormFieldChange("brand", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Modelo</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Civic EXL"
                value={formData.model || ""}
                onChange={(e) => handleFormFieldChange("model", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Cor</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Prata"
                value={formData.color || ""}
                onChange={(e) => handleFormFieldChange("color", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Ano</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: 2014"
                value={formData.year || ""}
                onChange={(e) => handleFormFieldChange("year", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeWindow}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSaveVehicle}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Salvar Veículo
          </button>
        </div>
        <div className="customer-error-message-container">
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewVehicleModal;
