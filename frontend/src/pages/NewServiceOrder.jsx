import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatLocalDateTime } from "../utils/convertDateTime";
import AutoCompleteCustomer from "../components/AutoCompleteCustomer";
import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import NewOrderMaterial from "../components/NewOrderMaterial";
import NewOrderInfo from "../components/NewOrderInfo";
import NewOrderCustomerVehicle from "../components/NewOrderCustomerVehicle";

import { customerApi } from "../api/customers";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { formattedPrice } from "../utils/convertPrice";
import { materialApi } from "../api/materials";
import { materialGroupApi } from "../api/materialGroups";
import { priorityMap, priorityReverseMap } from "../utils/priorityMap";
import { statusMap, statusReverseMap } from "../utils/statusMap";
import { orderApi } from "../api/orders";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";

const NewServiceOrder = () => {
  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // NewOrderCustomerVehicle
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  //AutoCompleteCustomer
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // NewOrderMaterial
  const [materialsList, setMaterialsList] = useState([]);

  // State for form fields
  const [formData, setFormData] = useState({
    professional: "",
    priority: 1,
    status: 1,
    arrived_at: new Date().toISOString(),
    entry_km: "",
    diagnosis: "",
    observation: "",
    subtotal: null,
    customer_id: "",
    vehicle_id: "",
  });

  const [formDataItemMaintenance, setFormDataItemMaintenance] = useState({
    value_unity: null,
    serviceorder_id: null,
    maintenance_id: null,
    description: "",
  });

  const [formDataItemMaterial, setFormDataItemMaterial] = useState({
    value_unity: null,
    serviceorder_id: null,
    material_id: null,
    reference: "",
  });

  // FETCH
  const handleFetchCustomers = async () => {
    const { data } = await customerApi.getAll();

    setCustomerData(data);
  };

  useEffect(() => {
    handleFetchCustomers();
  }, []);

  const handleFetchMaterialsGroup = async () => {
    const { data } = await materialGroupApi.getAll();

    setMaterialsGroupData(data);
  };

  useEffect(() => {
    handleFetchMaterialsGroup();
  }, []);

  const handleFetchGroupMaintenanceJobData = async () => {
    const { data } = await maintenanceGroupApi.getAll();

    setMaintenanceJobsGroupData(data);
  };

  useEffect(() => {
    handleFetchGroupMaintenanceJobData();
  }, []);

  // Função específica para prioridade
  const handlePriorityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      priority: priorityMap[value] || 1, // ← Converte texto para ID
    }));
  };

  // Função específica para status
  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: statusMap[value] || 1, // ← Converte texto para ID
    }));
  };

  //
  const handleAddItem = () => {
    const newItem = {
      ...formDataItemMaintenance,
      id: Date.now(), // ID temporário
      maintenance_id: formDataItemMaintenance.maintenance_id,
      serviceorder_id: null,
      value_unity: Number(formDataItemMaintenance.value_unity) || 0,
      description: formDataItemMaintenance.description,
    };

    setListMaintenanceJobs((prev) => [...prev, newItem]);

    setFormDataItemMaintenance({
      value_unity: null,
      serviceorder_id: null,
      maintenance_id: null,
      description: "",
    });
  };

  // No componente
  const navigate = useNavigate();

  // Função para salvar a OS
  const handleSaveOS = async () => {
    // ========== VALIDAÇÕES ==========
    if (!formData.customer_id) {
      setError("Selecione um cliente");
      return;
    }

    if (!formData.vehicle_id) {
      setError("Selecione um veículo");
      return;
    }

    if (!formData.diagnosis.trim()) {
      setError("Preencha o diagnóstico");
      return;
    }

    if (listMaintenanceJobs.length === 0 && materialsList.length === 0) {
      setError("Adicione pelo menos um serviço ou material");
      return;
    }

    // ========== PREPARAR DADOS DA OS ==========
    const serviceOrderData = {
      customer_id: formData.customer_id,
      vehicle_id: formData.vehicle_id,
      professional: formData.professional || null,
      priority: formData.priority,
      status: formData.status,
      arrived_at: formData.arrived_at,
      entry_km: parseFloat(formData.entry_km) || 0,
      diagnosis: formData.diagnosis.trim(),
      observation: formData.observation?.trim() || null,
      subtotal: calculateGrandTotal(),
    };

    try {
      setLoading(true);
      setError(null);

      // ========== 1. CRIAR SERVICE ORDER ==========

      const { data: serviceOrder } = await orderApi.create(serviceOrderData);

      const serviceOrderId = serviceOrder.id; // ← ID para usar nos itens

      // ========== 2. CRIAR ITEM MAINTENANCE ==========
      if (listMaintenanceJobs.length > 0) {
        const itemMaintenanceData = listMaintenanceJobs.map((job) => ({
          serviceorder_id: serviceOrderId, // ← ID da OS
          maintenance_id: job.maintenance_id,
          value_unity: parseFloat(job.value_unit) || 0,
          description: job.description?.trim() || "",
        }));

        // Criar todos os ItemMaintenance de uma vez
        await itemMaintenanceApi.createBatch(itemMaintenanceData);
      }

      // ========== 3. CRIAR ITEM MATERIAL ==========
      if (materialsList.length > 0) {
        const itemMaterialData = materialsList.map((item) => ({
          serviceorder_id: serviceOrderId, // ← ID da OS
          material_id: item.material_id,
          quantity: parseFloat(item.quantity) || 1,
          value_unity: parseFloat(item.value_unity) || 0,
          reference: item.reference?.trim() || "",
        }));

        // Criar todos os ItemMaterial de uma vez
        await itemMaterialApi.createBatch(itemMaterialData);
      }

      // ========== SUCESSO ==========
      navigate("/");
    } catch (error) {
      console.error("❌ Erro ao salvar OS:", error);

      let errorMessage = "Erro ao salvar OS";
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // HANDLES
  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormFieldChangeMaintenance = (field, value) => {
    setFormDataItemMaintenance((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // NewOrderCustomerVehicle
  const handleSelectedVehicle = (vehicle) => {
    setSelectedVehicleInfo(vehicle);
    handleFormFieldChange("vehicle_id", vehicle.id);
  };

  const handleChange = (event) => {
    setDateTimeValue(event.target.value);
    handleFormFieldChange("arrived_at", event.target.value);
  };

  //AutoCompleteCustomer
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = customerData.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);
  }, [inputValue]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.name);
    setSelectedCustomerInfo(suggestion);
    setShowSuggestions(false);
    handleFormFieldChange("customer_id", suggestion.id);

    setFilteredSuggestions([]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay para permitir clique na sugestão
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  const handleClearCustomer = () => {
    setInputValue("");
    setSelectedCustomerInfo(null);
    setSelectedVehicleInfo({});
  };

  // NewOrderMaintenanceJob
  const handleAddMaintenanceJob = () => {
    const newMaintenanceJob = {
      id: Date.now(),
      maintenance_id: "",
      value_unit: "",
      description: "",
      name: "",
    };

    setListMaintenanceJobs([...listMaintenanceJobs, newMaintenanceJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    setListMaintenanceJobs(
      listMaintenanceJobs.filter((element) => element.id !== id),
    );
  };

  const handleMaintenanceJobChange = (id, field, value) => {
    setListMaintenanceJobs((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;

        // Se for o campo "name" (que na verdade é o select)
        if (field === "name") {
          let foundJob = null;
          let foundValue = "";

          // Procurar o serviço selecionado
          for (const group of maintenanceJobsGroupData) {
            const found = group.maintenanceJobs.find(
              (item) => item.name === value,
            );

            if (found) {
              foundJob = found;
              foundValue = formattedPrice(found.value_unit);
              break;
            }
          }

          return {
            ...job,
            maintenance_id: foundJob ? foundJob.id : null, // ✅ CAPTURA O ID
            value_unit: foundValue,
          };
        }

        return { ...job, [field]: value };
      }),
    );
  };

  // NewOrderMaterial
  const handleAddMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      material_id: null,
      name: "",
      quantity: 1,
      value_unity: 0,
      reference: "",
      serviceorder_id: null,
    };
    setMaterialsList([...materialsList, newMaterial]);
  };

  const handleRemoveMaterial = (id) => {
    setMaterialsList(materialsList.filter((material) => material.id !== id));
  };

  const handleMaterialInputChange = (id, field, value) => {
    setMaterialsList((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        // Se for value_unity, converter para número
        if (field === "value_unity") {
          return {
            ...element,
            [field]: value === "" ? "" : parseFloat(value) || 0,
          };
        }

        // Se for quantity, converter para número
        if (field === "quantity") {
          return {
            ...element,
            [field]: value === "" ? "" : parseFloat(value) || 1,
          };
        }

        return { ...element, [field]: value };
      }),
    );
  };

  const findMaterialById = (id) => {
    if (!id) return null;
    for (const group of materialsGroupData) {
      const found = group.materials.find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  };

  const calculateTotalMaintenanceJob = () => {
    return listMaintenanceJobs.reduce((total, job) => {
      return total + (parseFloat(job.value_unit) || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalMaintenanceJob() + calculateTotalMaterials();
  };

  const calculateTotalMaterials = () => {
    return materialsList.reduce((total, material) => {
      const materialTotal =
        (parseFloat(material.value_unity) || 0) *
        (parseFloat(material.quantity) || 0);
      return total + materialTotal;
    }, 0);
  };

  // SELECT MAINTENANCE
  // Função para encontrar serviço por ID
  const findMaintenanceJobById = (id) => {
    if (!id) return null;
    for (const group of maintenanceJobsGroupData) {
      const found = group.maintenanceJobs.find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  };

  // Função para encontrar serviço por Nome
  const findMaintenanceJobByName = (name) => {
    if (!name) return null;
    for (const group of maintenanceJobsGroupData) {
      const found = group.maintenanceJobs.find((item) => item.name === name);
      if (found) return found;
    }
    return null;
  };

  return (
    <div className="page">
      {/* ============== */}
      {/* === HEADER === */}
      {/* ============== */}
      <div className="page-header">
        <div>
          <div className="ph-sub">Preencha os dados para registrar</div>
        </div>
        {/* <div className="os-num-badge">#OS-2025-0143</div> */}
      </div>

      <div className="form-wrap">
        {/* ========================= */}
        {/* === CLIENTE E VEÍCULO === */}
        {/* ========================= */}
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
                <div className="ac-wrap">
                  <div className="ac-input-row">
                    <span className="ac-icon">
                      <svg
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
                    </span>
                    {selectedCustomerInfo ? (
                      <div className="ac-selected-pill">
                        {selectedCustomerInfo.name}
                        <button onClick={handleClearCustomer}>×</button>
                      </div>
                    ) : (
                      <>
                        <input
                          className="ac-input"
                          type="text"
                          placeholder="Digite o nome do cliente..."
                          value={inputValue}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <span
                          className="ac-clear"
                          onClick={handleClearCustomer}
                        >
                          ×
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`ac-dropdown ${showSuggestions ? "open" : ""}`}
                  >
                    {showSuggestions && filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((element, index) => (
                        <div
                          key={index}
                          className="ac-option"
                          onClick={() => handleSuggestionClick(element)}
                        >
                          <div className="ac-option-name">{element.name}</div>
                          <div className="ac-option-sub">
                            {`${element.cell} · ${element.vehicles.length}  veículo(s) `}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="ac-empty">Nenhum cliente encontrado</div>
                    )}
                    <div
                      className="ac-option-create" /* onmousedown="acCreateClient('${inst}','${q.replace(/'/g, "\\'")}')" */
                    >
                      <svg
                        width="13"
                        height="13"
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
                      {`Cadastrar "${inputValue}" como novo cliente`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Veículo *</label>
                <div className="car-badge-row">
                  {selectedCustomerInfo ? (
                    selectedCustomerInfo.vehicles.length > 0 ? (
                      selectedCustomerInfo.vehicles.map((element, index) => (
                        <div
                          className={`car-badge ${selectedVehicleInfo === element ? "selected" : ""}`}
                          key={index}
                          onClick={() => {
                            handleSelectedVehicle(element);
                          }}
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
        </div>

        {/* <!-- Cliente & Veículo --> 
        <NewOrderCustomerVehicle
          handleFormFieldChange={handleFormFieldChange}
          customerData={customerData}
          formData={formData}
        />*/}

        {/* <!-- Serviços --> 
        <NewOrderMaintenanceJob
          listMaintenanceJobs={listMaintenanceJobs}
          setListMaintenanceJobs={setListMaintenanceJobs}
          maintenanceJobsGroupData={maintenanceJobsGroupData}
        />*/}

        {/* =============== */}
        {/* === SERVIÇO === */}
        {/* =============== */}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="fs-title">Serviços</span>
          </div>
          <div className="fs-body">
            <div className="services-list">
              {listMaintenanceJobs.length > 0
                ? listMaintenanceJobs.map((element, index) => (
                    <div key={element.id} className="service-row">
                      <div className="service-row-header">
                        <div className="service-num">{index + 1}</div>
                        <span className="service-row-label">
                          Serviço #{index + 1}
                        </span>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveMaintenanceJob(element.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="form-grid g3 form-grid-servico">
                        <div className="field col-2">
                          <label>Tipo de Serviço *</label>
                          <select
                            className="select"
                            value={element.maintenance_id || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;

                              if (!selectedId) {
                                // Limpar
                                handleMaintenanceJobChange(
                                  element.id,
                                  "maintenance_id",
                                  null,
                                );
                                handleMaintenanceJobChange(
                                  element.id,
                                  "value_unit",
                                  "",
                                );
                                return;
                              }

                              const foundJob = findMaintenanceJobById(
                                Number(selectedId),
                              );

                              if (foundJob) {
                                setListMaintenanceJobs((prev) =>
                                  prev.map((job) => {
                                    if (job.id !== element.id) return job;
                                    return {
                                      ...job,
                                      maintenance_id: foundJob.id,
                                      value_unit: formattedPrice(
                                        foundJob.value_unit,
                                      ),
                                    };
                                  }),
                                );
                              }
                            }}
                          >
                            <option value="">Selecione o serviço...</option>
                            {maintenanceJobsGroupData.map(
                              (group, groupIndex) => (
                                <optgroup key={groupIndex} label={group.group}>
                                  {group.maintenanceJobs.map(
                                    (item, itemIndex) => (
                                      <option key={itemIndex} value={item.id}>
                                        {item.name}
                                      </option>
                                    ),
                                  )}
                                </optgroup>
                              ),
                            )}
                          </select>
                        </div>
                        <div className="field">
                          <label>Mão de Obra</label>
                          <div className="input-prefix">
                            <span>R$</span>
                            <input
                              type="text"
                              className="svc-mo-input"
                              placeholder="0,00"
                              value={element.value_unit || ""}
                              onChange={(e) =>
                                handleMaintenanceJobChange(
                                  element.id,
                                  "value_unit",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="field col-full">
                          <label>Observações</label>
                          <textarea
                            className="textarea service-row-textarea"
                            placeholder="Detalhes adicionais do serviço..."
                            value={element.description || ""}
                            onChange={(e) =>
                              handleMaintenanceJobChange(
                                element.id, // ID do item na lista
                                "description", // Campo a ser atualizado
                                e.target.value, // Novo valor
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            <button className="add-row-btn" onClick={handleAddMaintenanceJob}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar serviço
            </button>
          </div>
        </div>

        {/* <!-- Peças & Materiais -->
        <NewOrderMaterial
          listMaintenanceJobs={listMaintenanceJobs}
          materialsData={materialsData}
        /> */}

        {/* ================ */}
        {/* === MATERIAL === */}
        {/* ================ */}
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
                  {materialsList.length > 0
                    ? materialsList.map((element, index) => (
                        <tr className="add-material-row" key={index}>
                          <td>
                            <select
                              className="select select-new-order-material"
                              value={element.material_id || ""} // ← USA O ID, não o nome
                              onChange={(e) => {
                                const selectedId = e.target.value;

                                if (!selectedId) {
                                  // Limpar
                                  handleMaterialInputChange(
                                    element.id,
                                    "material_id",
                                    null,
                                  );
                                  handleMaterialInputChange(
                                    element.id,
                                    "name",
                                    "",
                                  );
                                  return;
                                }

                                // Buscar o material pelo ID
                                const foundMaterial = findMaterialById(
                                  Number(selectedId),
                                );

                                if (foundMaterial) {
                                  // Atualizar material_id e name
                                  handleMaterialInputChange(
                                    element.id,
                                    "material_id",
                                    foundMaterial.id,
                                  );
                                  handleMaterialInputChange(
                                    element.id,
                                    "name",
                                    foundMaterial.name,
                                  );
                                }
                              }}
                            >
                              <option value="">Selecione...</option>
                              {materialsGroupData.map((group, groupIndex) => (
                                <optgroup key={groupIndex} label={group.group}>
                                  {group.materials.map(
                                    (material, materialIndex) => (
                                      <option
                                        key={materialIndex}
                                        value={material.id}
                                      >
                                        {material.name}
                                      </option>
                                    ),
                                  )}
                                </optgroup>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-new-order-material-qtd"
                              value={element.quantity}
                              min="1"
                              onChange={(e) =>
                                handleMaterialInputChange(
                                  element.id,
                                  "quantity",
                                  e.target.value,
                                )
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
                                value={element.value_unity}
                                onChange={(e) =>
                                  handleMaterialInputChange(
                                    element.id,
                                    "value_unity",
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
                              disabled
                              value={
                                element.value_unity && element.quantity
                                  ? (
                                      parseFloat(element.value_unity) *
                                      parseFloat(element.quantity)
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
                              value={element.reference}
                              onChange={(e) =>
                                handleMaterialInputChange(
                                  element.id,
                                  "reference",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveMaterial(element.id)}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
            <button className="add-row-btn" onClick={handleAddMaterial}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar peça / material
            </button>
            <div className="total-row">
              <div className="total-item">
                Mão de obra:
                <strong>R$ {calculateTotalMaintenanceJob().toFixed(2)}</strong>
              </div>
              <div className="total-row-divider"></div>
              <div className="total-item">
                Peças:
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
        {/* <!-- Info OS --> 
        <NewOrderInfo
          handleFormFieldChange={handleFormFieldChange}
          formData={formData}
        />*/}

        {/* =================== */}
        {/* === DETALHES OS === */}
        {/* =================== */}
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
                  value={formData.professional}
                  onChange={(e) =>
                    handleFormFieldChange("professional", e.target.value)
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
                  value={priorityReverseMap[formData.priority] || "Normal"} // ← Mostra texto
                  onChange={(e) => handlePriorityChange(e.target.value)} // ← Salva ID
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
                  value={statusReverseMap[formData.status] || "Pendente"} // ← Mostra texto
                  onChange={(e) => handleStatusChange(e.target.value)} // ← Salva ID
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Aberta">Aberta</option>
                  <option value="Aguardando peças">Aguardando peças</option>
                  <option value="Cancelada">Cancelada</option>
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
                  value={formData.observation}
                  onChange={(e) =>
                    handleFormFieldChange("observation", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================== */}
        {/* === FINALIZAÇÃO === */}
        {/* =================== */}
        <div className="form-actions">
          {/* <button className="btn btn-ghost">Cancelar</button> */}
          {/* <button className="btn btn-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
              />
            </svg>
            Imprimir
          </button> */}
          <button
            className="btn btn-primary"
            onClick={handleSaveOS}
            disabled={loading}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {loading ? "Salvando..." : "Salvar OS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
