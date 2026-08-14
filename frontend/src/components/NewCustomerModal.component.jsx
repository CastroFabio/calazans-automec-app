import React, { useState } from "react";
import { customerApi } from "../api/customers";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "../context/Customer.context";

const NewCustomerModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    cell: "",
    telephone: "",
    observation: "",
  });
  const [error, setError] = useState(false);

  const { addCustomer } = useCustomers();

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCustomer = async () => {
    if (!formData.name.trim()) {
      setError("Nome completo é obrigatório.");
      return;
    }
    if (!formData.cell.trim()) {
      setError("Celular é obrigatório.");
      return;
    }

    const customerData = {
      name: formData.name.trim(),
      cell: formData.cell.trim(),
      telephone: formData.telephone.trim(),
      observation: formData.observation.trim(),
    };

    try {
      setError(null);

      const { data } = await customerApi.create(customerData);
      const newCustomerData = {
        ...data,
        _count: {
          serviceOrders: 0,
          vehicles: 0,
        },
      };
      addCustomer(newCustomerData);

      setFormData({
        name: "",
        cell: "",
        telephone: "",
        observation: "",
      });

      onClose();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);

      let errorMessage = "Erro ao salvar cliente";
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
      className={`modal-overlay ${isOpen ? "open" : ""}`}
      id="modalCliente"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Novo Cliente</span>
          <button className="sp-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid modal-customer-form-grid">
            <div className="field col-full">
              <label>Nome Completo *</label>
              <input
                type="text"
                className="input"
                id="novoClienteNome"
                placeholder="Nome completo ou razão social"
                value={formData.name}
                onChange={(e) => {
                  handleFormFieldChange("name", e.target.value);
                }}
              />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input
                type="text"
                className="input"
                id="novoClienteTel"
                placeholder="(00) 0000-0000"
                value={formData.telephone}
                onChange={(e) => {
                  handleFormFieldChange("telephone", e.target.value);
                }}
              />
            </div>
            <div className="field">
              <label>Celular / WhatsApp</label>
              <input
                type="text"
                className="input"
                id="novoClienteCel"
                placeholder="(00) 00000-0000"
                value={formData.cell}
                onChange={(e) => {
                  handleFormFieldChange("cell", e.target.value);
                }}
              />
            </div>
            <div className="field col-full">
              <label>Observações</label>
              <textarea
                className="textarea modal-customer-textarea"
                id="novoClienteObs"
                placeholder="Informações relevantes sobre o cliente..."
                value={formData.observation}
                onChange={(e) => {
                  handleFormFieldChange("observation", e.target.value);
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSaveCustomer}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Salvar e Cadastrar Cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCustomerModal;
