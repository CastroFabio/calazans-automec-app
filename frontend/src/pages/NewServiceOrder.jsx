import { useState } from "react";
import { formatLocalDateTime } from "../utils/convertDateTime";
import AutoCompleteCustomer from "../components/AutoCompleteCustomer";
import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";

const NewServiceOrder = () => {
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState({});
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});

  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);

  // Set the initial state with the current local time formatted correctly
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  // State for materials list
  const [materialsList, setMaterialsList] = useState([]);

  // State for material inputs
  const [materialInput, setMaterialInput] = useState({
    description: "",
    quantity: 1,
    unitValue: "",
    reference: "",
  });

  // State for form fields
  const [formData, setFormData] = useState({
    entryKm: "",
    technician: "",
    priority: "Normal",
    status: "Pendente",
    diagnosis: "",
    internalObservations: "",
  });

  const handleChange = (event) => {
    setDateTimeValue(event.target.value);
  };

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectedVehicle = (vehicle) => setSelectedVehicleInfo(vehicle);

  const handleAddMaterial = () => {
    if (materialInput.description) {
      const newMaterial = {
        id: Date.now(),
        ...materialInput,
        total: materialInput.unitValue * materialInput.quantity,
      };
      setMaterialsList([...materialsList, newMaterial]);
      // Reset material input
      setMaterialInput({
        description: "",
        quantity: 1,
        unitValue: "",
        reference: "",
      });
    }
  };

  const handleRemoveMaterial = (id) => {
    setMaterialsList(materialsList.filter((material) => material.id !== id));
  };

  const handleMaterialInputChange = (field, value) => {
    setMaterialInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateMaterialTotal = (unitValue, quantity) => {
    const unit = parseFloat(unitValue) || 0;
    const qty = parseFloat(quantity) || 0;
    return unit * qty;
  };

  const calculateTotalMaterials = () => {
    return materialsList.reduce((total, material) => {
      const materialTotal =
        (parseFloat(material.unitValue) || 0) *
        (parseFloat(material.quantity) || 0);
      return total + materialTotal;
    }, 0);
  };

  const calculateTotalLabor = () => {
    return listMaintenanceJobs.reduce((total, job) => {
      return total + (parseFloat(job.serviceValue) || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalLabor() + calculateTotalMaterials();
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
                  value={formData.entryKm}
                  onChange={(e) =>
                    handleFormFieldChange("entryKm", e.target.value)
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

        {/* <!-- Serviços --> */}
        <NewOrderMaintenanceJob
          listMaintenanceJobs={listMaintenanceJobs}
          setListMaintenanceJobs={setListMaintenanceJobs}
        />

        {/* <!-- Peças & Materiais --> */}
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="fs-title">Peças & Materiais</span>
          </div>
          <div className="fs-body">
            <div className="mat-table-wrap">
              <table className="mat-table">
                <thead>
                  <tr>
                    <th className="mat-table-content-desc">Descrição</th>
                    <th className="mat-table-content-qtd">Qtd.</th>
                    <th className="mat-table-content-value">Valor Unit.</th>
                    <th className="mat-table-content-total">Total</th>
                    <th className="mat-table-content-ref">Referência</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Nenhum material adicionado
                      </td>
                    </tr>
                  ) : (
                    materialsList.map((material) => (
                      <tr key={material.id}>
                        <td>{material.description}</td>
                        <td>{material.quantity}</td>
                        <td>R$ {material.unitValue}</td>
                        <td>
                          R${" "}
                          {calculateMaterialTotal(
                            material.unitValue,
                            material.quantity,
                          ).toFixed(2)}
                        </td>
                        <td>{material.reference}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveMaterial(material.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="add-material-row">
                    <td>
                      <select
                        className="select select-new-order-material"
                        value={materialInput.description}
                        onChange={(e) =>
                          handleMaterialInputChange(
                            "description",
                            e.target.value,
                          )
                        }
                      >
                        <option value="">Selecione...</option>
                        <option value="Óleo do motor">Óleo do motor</option>
                        <option value="Filtro de óleo">Filtro de óleo</option>
                        <option value="Pastilha de freio">
                          Pastilha de freio
                        </option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input input-new-order-material-qtd"
                        value={materialInput.quantity}
                        min="1"
                        onChange={(e) =>
                          handleMaterialInputChange("quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="input-prefix">
                        <span>R$</span>
                        <input
                          type="text"
                          placeholder="0,00"
                          className="input-new-order-material-cost"
                          value={materialInput.unitValue}
                          onChange={(e) =>
                            handleMaterialInputChange(
                              "unitValue",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-new-order-material-total"
                        readOnly
                        value={
                          materialInput.unitValue && materialInput.quantity
                            ? (
                                parseFloat(materialInput.unitValue) *
                                parseFloat(materialInput.quantity)
                              ).toFixed(2)
                            : "—"
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-new-order-material-ref"
                        placeholder="Ref."
                        value={materialInput.reference}
                        onChange={(e) =>
                          handleMaterialInputChange("reference", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="add-row-btn-small"
                        onClick={handleAddMaterial}
                        disabled={!materialInput.description}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <div className="total-item">
                Mão de obra:{" "}
                <strong>R$ {calculateTotalLabor().toFixed(2)}</strong>
              </div>
              <div className="total-row-divider"></div>
              <div className="total-item">
                Peças:{" "}
                <strong>R$ {calculateTotalMaterials().toFixed(2)}</strong>
              </div>
              <div className="total-row-divider"></div>
              <div className="total-item">
                Total:
                <span className="grand-total">
                  R$ {calculateGrandTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Info OS --> */}
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="fs-title">Informações da OS</span>
          </div>
          <div className="fs-body">
            <div className="form-grid g3">
              <div className="field">
                <label>Técnico Responsável</label>
                <select
                  className="select"
                  value={formData.technician}
                  onChange={(e) =>
                    handleFormFieldChange("technician", e.target.value)
                  }
                >
                  <option value="">Selecione...</option>
                  <option value="Carlos Mendes">Carlos Mendes</option>
                  <option value="Ana Lima">Ana Lima</option>
                  <option value="Pedro Santos">Pedro Santos</option>
                  <option value="Fernanda Costa">Fernanda Costa</option>
                </select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select
                  className="select"
                  value={formData.priority}
                  onChange={(e) =>
                    handleFormFieldChange("priority", e.target.value)
                  }
                >
                  <option value="Normal">Normal</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div className="field">
                <label>Status Inicial</label>
                <select
                  className="select"
                  value={formData.status}
                  onChange={(e) =>
                    handleFormFieldChange("status", e.target.value)
                  }
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                </select>
              </div>
              <div className="field col-full">
                <label>Diagnóstico / Problema *</label>
                <textarea
                  className="textarea"
                  placeholder="Descreva o problema relatado pelo cliente e o diagnóstico realizado..."
                  value={formData.diagnosis}
                  onChange={(e) =>
                    handleFormFieldChange("diagnosis", e.target.value)
                  }
                />
              </div>
              <div className="field col-full">
                <label>Observações Internas</label>
                <textarea
                  className="textarea form-textarea-obs"
                  placeholder="Notas internas da equipe..."
                  value={formData.internalObservations}
                  onChange={(e) =>
                    handleFormFieldChange(
                      "internalObservations",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

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
