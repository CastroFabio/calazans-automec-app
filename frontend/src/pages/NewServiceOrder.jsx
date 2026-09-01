import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatLocalDateTime } from "../utils/convertDateTime";
import AutoComplete from "../components/AutoComplete.component";
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
import { useServiceOrders } from "../context/ServiceOrder.context";
import NewCustomerModal from "../components/NewCustomerModal.component";
import NewVehicleModal from "../components/NewVehicleModal.component";
import { useCustomers } from "../context/Customer.context";
import InputPriceValue from "../components/InputPriceValue";
import AddMaterialInMaintenace from "../components/AddMaterialInMaintenace";
import { formatarCelular } from "../utils/convertCel";
import ProfessionalSelect from "../components/ProfessionalSelect.component";
import { PATHS } from "../utils/paths";

const NewServiceOrder = () => {
  const [materialsData, setMaterialsData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCustomerModalOpen, setCustomerIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleIsModalOpen] = useState(false);

  // NewOrderCustomerVehicle
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  const [inputValue, setInputValue] = useState("");

  // State for form fields
  const [formData, setFormData] = useState({
    professional: "",
    priority: 1,
    status: 1,
    arrived_at: new Date().toISOString(),
    entry_km: "",
    diagnosis: "",
    labor_cost: "",
    observation: "",
    subtotal: null,
    customer_id: "",
    vehicle_id: "",
  });

  const [formDataItemMaintenance, setFormDataItemMaintenance] = useState({
    serviceorder_id: null,
    maintenance_id: null,
    description: "",
  });

  const {
    addServiceOrder,
    handleMaintenanceJobChange,
    setListMaintenanceJobs,
    listMaintenanceJobs,
    handleMaterialInputChange,
    setMaterialsList,
    materialsList,
  } = useServiceOrders();
  const { getCustomerById, customers } = useCustomers();

  // FETCH
  const handleFetchCustomers = async () => {
    // const { data } = await customerApi.getAll();

    setCustomerData(customers);
  };

  useEffect(() => {
    handleFetchCustomers();
  }, [customers]);

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
      value_unit: Number(formDataItemMaintenance.value_unit) || 0,
      description: formDataItemMaintenance.description,
    };

    setListMaintenanceJobs((prev) => [...prev, newItem]);

    setFormDataItemMaintenance({
      serviceorder_id: null,
      maintenance_id: null,
      description: "",
    });
  };

  // No componente
  const navigate = useNavigate();

  // Função para salvar a OS
  const handleSaveOS = async () => {
    const errorList = [];

    // ========== 1. VALIDAÇÕES BÁSICAS ==========
    if (!formData.customer_id) {
      errorList.push("Selecione um cliente.");
    }

    if (!formData.vehicle_id) {
      errorList.push("Selecione um veículo.");
    }

    if (!formData.diagnosis?.trim()) {
      errorList.push("Preencha o campo Diagnóstico / Problema.");
    }

    if (listMaintenanceJobs.length === 0) {
      errorList.push("Adicione pelo menos um serviço registrado.");
    }

    // ========== 2. EXTRAIR E VALIDAR MATERIAIS DOS SERVIÇOS ==========
    // Agrupa os materiais de todos os serviços registrados na lista
    const allMaterials = listMaintenanceJobs.flatMap((job) =>
      (job.materialsList || []).map((mat) => ({
        ...mat,
        parentJobId: job.id, // ID local temporário do serviço para mapeamento posterior
      })),
    );

    const invalidMaterials = allMaterials.filter((item) => {
      if (!item.material_id) return true;
      const quantity = parseFloat(item.quantity) || 0;
      const value = parseValue(item.value_unit);
      return quantity <= 0 || value <= 0;
    });

    if (invalidMaterials.length > 0) {
      errorList.push(
        "Existem materiais cadastrados sem preenchimento correto (Material, Quantidade ou Valor).",
      );
    }

    // Se houver erros nas validações, interrompe a execução
    if (errorList.length > 0) {
      alert(
        `❌ Verifique os erros antes de salvar:\n\n- ${errorList.join("\n- ")}`,
      );
      return;
    }

    // ========== 3. PREPARAR DADOS PRINCIPAIS DA OS ==========
    const serviceOrderData = {
      customer_id: formData.customer_id,
      vehicle_id: formData.vehicle_id,
      professional: formData.professional || null,
      priority: formData.priority,
      status: formData.status,
      arrived_at: formData.arrived_at,
      entry_km:
        parseFloat(String(formData.entry_km).replace(/[^0-9.]/g, "")) || 0,
      labor_cost: parseValue(formData.labor_cost),
      diagnosis: formData.diagnosis.trim(),
      observation: formData.observation?.trim() || null,
      subtotal: calculateGrandTotal(),
    };

    try {
      setLoading(true);
      setError(null);

      // 1. Criar a Ordem de Serviço Principal
      const { data: createdServiceOrder } =
        await orderApi.create(serviceOrderData);
      const serviceOrderId = createdServiceOrder.id;

      let savedMaintenances = [];
      let savedMaterials = [];
      const localToBackendJobIdMap = {};

      // 2. Criar Itens de Manutenção (Serviços) em Batch
      if (listMaintenanceJobs.length > 0) {
        const itemMaintenancePayload = listMaintenanceJobs.map((job) => ({
          serviceorder_id: serviceOrderId,
          maintenance_id: job.maintenance_id,
          description: job.description?.trim() || "",
        }));

        const { data: createdMaintenances } =
          await itemMaintenanceApi.createBatch(itemMaintenancePayload);

        savedMaintenances =
          createdMaintenances.items || createdMaintenances || [];

        // Mapeia o ID temporário local (Date.now()) com o ID real gerado no Banco
        if (Array.isArray(savedMaintenances)) {
          listMaintenanceJobs.forEach((job, index) => {
            if (savedMaintenances[index]) {
              localToBackendJobIdMap[job.id] = savedMaintenances[index].id;
            }
          });
        }
      }

      // 3. Criar Itens de Material em Batch vinculados à Manutenção correspondente
      if (allMaterials.length > 0) {
        const itemMaterialPayload = allMaterials.map((item) => ({
          serviceorder_id: serviceOrderId,
          material_id: item.material_id,
          itemMaintenance_id: localToBackendJobIdMap[item.parentJobId] || null,
          quantity: parseFloat(item.quantity) || 1,
          value_unit: parseValue(item.value_unit),
          receipt: item.receipt?.trim() || "",
          supplier: item.supplier?.trim() || "",
        }));

        const { data: createdMaterials } =
          await itemMaterialApi.createBatch(itemMaterialPayload);
        savedMaterials = createdMaterials.items || createdMaterials || [];
      }

      // 4. Atualizar Contexto Local e Redirecionar
      const fullServiceOrder = {
        ...createdServiceOrder,
        itemMaintenances: savedMaintenances,
        itemMaterials: savedMaterials,
      };

      addServiceOrder(fullServiceOrder);

      // Reseta listas do formulário
      setListMaintenanceJobs([]);
      setMaterialsList([]);

      // Navega para a listagem
      navigate(PATHS.serviceOrder);
    } catch (err) {
      console.error("❌ Erro ao salvar a Ordem de Serviço:", err);

      let errorMessage = "Erro ao salvar Ordem de Serviço.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
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

  // NewOrderMaintenanceJob
  const handleAddMaintenanceJob = (itemService, customId = null) => {
    const totalPrice = itemService.materialsList.reduce(
      (accumulator, currentValue) =>
        parseFloat(currentValue.value_unit || 0) *
          parseFloat(currentValue.quantity || 0) +
        accumulator,
      0,
    );

    const newMaintenanceJob = {
      id: customId || Date.now(),
      isOpen: false,
      maintenance_id: itemService.service.id,
      description: itemService.description,
      name: itemService.service.name,
      materialsList: itemService.materialsList,
      totalPrice,
    };

    setListMaintenanceJobs((prev) => [...prev, newMaintenanceJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    // 1. Remove a manutenção selecionada
    setListMaintenanceJobs((prev) =>
      prev.filter((element) => element.id !== id),
    );

    // 2. Remove todos os materiais vinculados a essa manutenção
    setMaterialsList((prev) =>
      prev.filter((material) => material.itemMaintenance_id !== id),
    );
  };

  // NewOrderMaterial
  const handleAddMaterial = (itemMaintenanceId = null) => {
    const newMaterial = {
      id: Date.now(),
      name: "",
      quantity: 1,
      value_unit: "",
      receipt: "",
      supplier: "",
      material_id: null,
      itemMaintenance_id: itemMaintenanceId,
      serviceorder_id: null,
    };

    setMaterialsList((prev) => [...prev, newMaterial]);
  };

  const handleRemoveMaterial = (id) => {
    setMaterialsList(materialsList.filter((material) => material.id !== id));
  };

  const findMaterialById = (id) => {
    if (!id) return null;
    for (const group of materialsGroupData) {
      const found = group.materials.find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  };

  const parseValue = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return +value.toFixed(2);

    if (typeof value === "string") {
      let clean = value;

      if (clean.includes(",") && clean.includes(".")) {
        clean = clean.split(".").join("");
      }

      clean = clean.replace(",", ".");
      clean = clean.replace(/[^0-9.]/g, "");

      // Faz o parse e força a limitação de 2 casas decimais
      const parsed = parseFloat(clean);
      return parsed ? +parsed.toFixed(2) : 0;
    }

    return 0;
  };

  const calculateTotalMaintenanceJob = () =>
    parseValue(formData.labor_cost || 0);

  const calculateTotalMaterials = () => {
    return (listMaintenanceJobs || []).reduce((total, material) => {
      return parseFloat(total + material.totalPrice);
      /* const unitValue = parseValue(material?.materialsList.value_unit);
      const quantity = parseFloat(material?.materialsList.quantity) || 0; 
      return total + unitValue * quantity;*/
    }, 0);
  };

  const calculateGrandTotal = () =>
    calculateTotalMaintenanceJob() + calculateTotalMaterials();

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

  return (
    <div className="page">
      {/* ============== */}
      {/* === HEADER === */}
      {/* ============== */}
      <div className="page-header">
        <div>
          <div className="ph-sub">Preencha os dados para registrara</div>
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
              <AutoComplete
                label="Cliente *"
                placeholder="Digite o nome do cliente..."
                items={customers}
                filterKey="name"
                value={inputValue}
                selectedItem={selectedCustomerInfo}
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
                }}
                onCreateNew={(term) => {
                  console.log("Abrir modal para criar cliente:", term);
                }}
                renderOption={(customer) => (
                  <>
                    <div className="ac-option-name">{customer.name}</div>
                    <div className="ac-option-sub">
                      {`${formatarCelular(customer.cell)} · ${customer.vehicles?.length || 0} veículo(s)`}
                    </div>
                  </>
                )}
              />

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

        {/* =============== */}
        {/* === SERVIÇO === */}
        {/* =============== */}
        <NewOrderMaintenanceJob
          formData={formData}
          handleFormFieldChange={handleFormFieldChange}
          listMaintenanceJobs={listMaintenanceJobs}
          handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
          handleMaintenanceJobChange={handleMaintenanceJobChange}
          findMaintenanceJobById={findMaintenanceJobById}
          setListMaintenanceJobs={setListMaintenanceJobs}
          maintenanceJobsGroupData={maintenanceJobsGroupData}
          handleAddMaterial={handleAddMaterial}
          materialsList={materialsList}
          handleMaterialInputChange={handleMaterialInputChange}
          materialsGroupData={materialsGroupData}
          handleRemoveMaterial={handleRemoveMaterial}
          findMaterialById={findMaterialById}
          handleAddMaintenanceJob={handleAddMaintenanceJob}
          calculateTotalMaintenanceJob={calculateTotalMaintenanceJob}
          calculateTotalMaterials={calculateTotalMaterials}
          calculateGrandTotal={calculateGrandTotal}
        />

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
              <ProfessionalSelect
                handleFormFieldChange={handleFormFieldChange}
                professional={formData.professional}
              />
              {/* <div className="field">
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
              </div> */}

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
      {isCustomerModalOpen && (
        <NewCustomerModal
          isOpen={isCustomerModalOpen}
          onClose={closeCustomerModal}
          customerName={inputValue}
        />
      )}
      {isVehicleModalOpen && (
        <NewVehicleModal
          isModalOpen={isVehicleModalOpen}
          onClose={closeVehicleModal}
          selectedCustomer={getCustomerById(selectedCustomerInfo.id)}
        />
      )}
    </div>
  );
};

export default NewServiceOrder;
