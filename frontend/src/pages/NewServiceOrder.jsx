import { useState } from "react";
import { formatLocalDateTime } from "../utils/convertDateTime";
import AutoCompleteCustomer from "../components/AutoCompleteCustomer";
import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import NewOrderMaterial from "../components/NewOrderMaterial";
import NewOrderInfo from "../components/NewOrderInfo";
import NewOrderCustomerVehicle from "../components/NewOrderCustomerVehicle";

const NewServiceOrder = () => {
  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);

  // State for form fields
  const [formData, setFormData] = useState({
    entryKm: "",
    technician: "",
    priority: "Normal",
    status: "Pendente",
    diagnosis: "",
    internalObservations: "",
  });

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="ph-title">Nova Ordem de Serviço</div>
          <div className="ph-sub">Preencha os dados para registrar</div>
        </div>
        <div className="os-num-badge">#OS-2025-0143</div>
      </div>
      <div className="form-wrap">
        {/* <!-- Cliente & Veículo --> */}
        <NewOrderCustomerVehicle formData={formData} />

        {/* <!-- Serviços --> */}
        <NewOrderMaintenanceJob
          listMaintenanceJobs={listMaintenanceJobs}
          setListMaintenanceJobs={setListMaintenanceJobs}
        />

        {/* <!-- Peças & Materiais --> */}
        <NewOrderMaterial listMaintenanceJobs={listMaintenanceJobs} />

        {/* <!-- Info OS --> */}
        <NewOrderInfo
          handleFormFieldChange={handleFormFieldChange}
          formData={formData}
        />

        <div className="form-actions">
          <button className="btn btn-ghost">Cancelar</button>
          <button className="btn btn-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
              />
            </svg>
            Imprimir
          </button>
          <button className="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Salvar OS
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
