import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import NewCustomerModal from "../components/NewCustomerModal.component";
import NewVehicleModal from "../components/NewVehicleModal.component";
import NewItemModal from "../components/NewItemModal.component";
import PaymentStatusForm from "../components/PaymentStatusForm.component";
import ServiceOrderDetailsForm from "../components/ServiceOrderDetailsForm.component";
import CustomerAndVehicleForm from "../components/CustomerAndVehicleForm.component";

import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { orderApi } from "../api/orders";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";
import { maintenanceJobApi } from "../api/maintenanceJobs";

import { useCustomers } from "../context/Customer.context";
import { useServiceOrders } from "../context/ServiceOrder.context";

import { formatLocalDateTime } from "../utils/convertDateTime";
import { statusMap } from "../utils/statusMap";
import { PATHS } from "../utils/paths";
import { paymentStatusMap } from "../utils/paymentStatusMap";
import { getNumberValue, parseInputValue } from "../utils/parseValue";
import { formatarCelular } from "../utils/convertCel";

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

const NewServiceOrder = () => {
  const [customerData, setCustomerData] = useState([]);
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorOnCreateItem, setErrorOnCreateItem] = useState(false);
  const [isCustomerModalOpen, setCustomerIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setMaintenanceIsModalOpen] = useState(false);
  const [payment, setPayment] = useState("");

  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  const [selectedCustomerFromModal, setSelectedCustomerFromModal] = useState(
    {},
  );
  const [selectedVehicleFromModal, setSelectedVehicleFromModal] = useState({});

  const [inputValue, setInputValue] = useState("");

  // State for form fields
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
  const {
    getCustomerById,
    customers,
    selectedCustomerFromDetailPanel,
    setSelectedCustomerFromDetailPanel,
    addServiceOrderToCustomer,
  } = useCustomers();

  // FETCH
  const handleFetchCustomers = async () => {
    // const { data } = await customerApi.getAll();

    setCustomerData(customers);
  };

  useEffect(() => {
    setListMaintenanceJobs([]);
  }, [customers]);

  useEffect(() => {
    handleFetchCustomers();
  }, [customers]);

  const handleFetchGroupMaintenanceJobData = async () => {
    const { data } = await maintenanceGroupApi.getAll();

    setMaintenanceJobsGroupData(data);
  };

  useEffect(() => {
    handleFetchGroupMaintenanceJobData();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedCustomerFromDetailPanel).length !== 0) {
      setSelectedCustomerInfo(selectedCustomerFromDetailPanel);
      handleSelectedVehicle(selectedCustomerFromDetailPanel.vehicles[0]);
      setFormData((prev) => ({
        ...prev,
        customer_id: selectedCustomerFromDetailPanel.id,
        vehicle_id: selectedCustomerFromDetailPanel.vehicles[0].id,
      }));
    }
  }, [selectedCustomerFromDetailPanel]);

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

    /*  if (!formData.diagnosis?.trim()) {
      errorList.push("Preencha o campo Diagnóstico / Problema.");
    } */

    if (listMaintenanceJobs.length === 0) {
      errorList.push("Adicione pelo menos um serviço registrado.");
    }

    // ========== 2. EXTRAIR E VALIDAR MATERIAIS DOS SERVIÇOS ==========
    // Agrupa os materiais de todos os serviços registrados na lista
    const allMaterials = listMaintenanceJobs.flatMap((job) =>
      (job.materialsList || []).map((mat) => ({
        ...mat,
        parentJobId: job.id, // ID local temporário do serviço para mapeamento posterior
        maintenanceName: job.name, // ID local temporário do serviço para mapeamento posterior
      })),
    );

    const invalidMaterialsID = allMaterials.filter((item) => {
      if (!item.material_id) return true;
    });

    if (invalidMaterialsID.length > 0) {
      invalidMaterialsID.forEach((material) => {
        errorList.push(
          `A peça do serviço ${material.maintenanceName} não foi corretamente registrada.`,
        );
      });
    }

    const invalidMaterialsValueAndQty = allMaterials.filter((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const value = getNumberValue(item.value_unit);

      return (quantity <= 0 || value <= 0) && !item.customerSupplierCheck;
    });

    if (invalidMaterialsValueAndQty.length > 0) {
      invalidMaterialsValueAndQty.forEach((material) => {
        if (!material.isCustomerSupplier) {
          errorList.push(
            `O material ${material.name} no serviço de ${material.maintenanceName} precisa ser o preenchida corretamente (Material, Quantidade ou Valor).`,
          );
        }
      });
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
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      arrived_at: formData.arrived_at,
      entry_km:
        parseFloat(String(formData.entry_km).replace(/[^0-9.]/g, "")) || 0,
      diagnosis: formData.diagnosis.trim(),
      observation: formData.observation?.trim() || null,
      subtotal: getNumberValue(calculateGrandTotal()),
      paid: getNumberValue(formData.paid),
      labor_cost: getNumberValue(formData.labor_cost),
      isCustomerSupplier: formData.isCustomerSupplier,
    };

    try {
      setLoading(true);
      setError(null);

      // 1. Criar a Ordem de Serviço Principal
      const { data: createdServiceOrder } =
        await orderApi.create(serviceOrderData);

      addServiceOrderToCustomer(formData.customer_id, createdServiceOrder);

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
          value_unit: getNumberValue(item.value_unit),
          receipt: item.receipt?.trim() || "",
          supplier: item.supplier?.trim() || "",
          isCustomerSupplier: item.isCustomerSupplier || false,
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
      setFormData({
        professional: "",
        status: 1,
        paymentStatus: 1,
        arrived_at: new Date().toISOString(),
        entry_km: "",
        diagnosis: "",
        labor_cost: "",
        observation: "",
        subtotal: null,
        customer_id: "",
        vehicle_id: "",
      });
      setSelectedCustomerFromDetailPanel({});

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

    const updatedJob = {
      id: customId || Date.now(),
      isOpen: false,
      maintenance_id: itemService.service.id,
      description: itemService.description,
      name: itemService.service.name,
      materialsList: itemService.materialsList,
      totalPrice,
    };

    setListMaintenanceJobs((prev) => {
      // Se o ID já existir na lista, atualiza o item correspondente
      const exists = prev.some((job) => job.id === customId);
      if (exists) {
        return prev.map((job) => (job.id === customId ? updatedJob : job));
      }
      // Caso contrário, adiciona o novo serviço à lista
      return [...prev, updatedJob];
    });
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

  const calculateTotalMaterials = () => {
    return (listMaintenanceJobs || []).reduce((total, material) => {
      const totalParsed = parseInputValue(total);
      const materialItemTotalPriceParsed = parseInputValue(material.totalPrice);

      const totalNumber = getNumberValue(totalParsed);
      const materialItemTotalPriceNumber = getNumberValue(
        materialItemTotalPriceParsed,
      );

      const grandTotalPrice = totalNumber + materialItemTotalPriceNumber;

      return grandTotalPrice;
    }, 0);
  };

  const calculateGrandTotal = () => {
    const laborCostParsed = parseInputValue(formData.labor_cost);
    const calculatedTotalMaterialParsed = parseInputValue(
      calculateTotalMaterials(),
    );

    const laborCostNumber = getNumberValue(laborCostParsed);
    const calculatedTotalMaterialNumber = getNumberValue(
      calculatedTotalMaterialParsed,
    );

    const grandTotalMaintenanceMaterialParsed = parseInputValue(
      laborCostNumber + calculatedTotalMaterialNumber,
    );

    const grandTotalMaintenanceMaterialNumber = getNumberValue(
      grandTotalMaintenanceMaterialParsed,
    );

    return grandTotalMaintenanceMaterialNumber;
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

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!payment) {
      alert("Valor de pagamento é obrigatório");
      return;
    }

    try {
      const currentPaidParsed = parseInputValue(formData.paid);
      const addedValueParsed = parseInputValue(payment);

      const currentPaidNumber = getNumberValue(currentPaidParsed);
      const addedValueNumber = getNumberValue(addedValueParsed);

      const totalPaidParsed = parseInputValue(
        currentPaidNumber + addedValueNumber,
      );

      const totalPaidNumber = getNumberValue(totalPaidParsed);

      handleFormFieldChange("paid", totalPaidNumber);
      handleFormFieldChange(
        "paymentStatus",
        paymentStatusMap["Pago Parcialmente"],
      );

      setPayment("");
    } catch (err) {
      setError("Erro ao adicionar pagamento");
    }
  };

  const handlePayFully = async (e) => {
    e.preventDefault();
    try {
      const grandTotal = calculateGrandTotal();
      const parsedTotal = parseInputValue(grandTotal);

      handleFormFieldChange("paid", parsedTotal);
      handleFormFieldChange(
        "paymentStatus",
        paymentStatusMap["Pago Integralmente"],
      );
      setPayment("");
    } catch (err) {
      setError("Erro ao quitar pagamento");
    }
  };

  const handlePaymentOnChange = (e) => {
    const cleanValue = parseInputValue(e.target.value);

    setPayment(cleanValue);
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
    <div className="page">
      {/* ============== */}
      {/* === HEADER === */}
      {/* ============== */}
      <div className="page-header">
        <div>
          <div className="ph-sub">Preencha os dados para registrar</div>
        </div>
      </div>

      <div className="form-wrap">
        {/* ========================= */}
        {/* === CLIENTE E VEÍCULO === */}
        {/* ========================= */}
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
          handleRemoveMaterial={handleRemoveMaterial}
          handleAddMaintenanceJob={handleAddMaintenanceJob}
          formDataLaborCost={formData.labor_cost}
          calculateTotalMaterials={calculateTotalMaterials}
          calculateGrandTotal={calculateGrandTotal}
          openMaintenanceModal={handleOpenMaintenanceModal}
        />

        {/* =================== */}
        {/* ==== PAGAMENTO ==== */}
        {/* =================== */}
        <PaymentStatusForm
          headerTitle={CATEGORIES.payment.title}
          headerIcon={CATEGORIES.payment.icon}
          formDataPaymentStatus={formData.paymentStatus}
          calculateGrandTotal={calculateGrandTotal}
          formDataPaid={parseInputValue(formData.paid || "")}
          payment={payment}
          handlePaymentOnChange={handlePaymentOnChange}
          handleAddPayment={handleAddPayment}
          handlePayFully={handlePayFully}
          handleFormFieldChange={handleFormFieldChange}
        />

        {/* =================== */}
        {/* === DETALHES OS === */}
        {/* =================== */}
        <ServiceOrderDetailsForm
          title={CATEGORIES.details.title}
          subtitle={CATEGORIES.details.icon}
          handleFormFieldChange={handleFormFieldChange}
          formDataProfessional={formData.professional}
          formDataStatus={formData.status}
          handleStatusChange={(e) => handleStatusChange(e.target.value)}
          formDataDiagnosis={formData.diagnosis}
        />

        {/* =================== */}
        {/* === FINALIZAÇÃO === */}
        {/* =================== */}
        <div className="form-actions">
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

      {/* Modal para Serviços de Manutenção */}
      {isMaintenanceModalOpen && (
        <NewItemModal
          title="Novo Serviço"
          placeholder="Digite o novo serviço..."
          buttonLabel="Salvar e cadastrar serviço"
          closeModal={closeMaintenanceModal}
          isModalOpen={isMaintenanceModalOpen}
          items={maintenanceJobsGroupData}
          createItem={async (groupIndex, newItemName) => {
            if (!newItemName.trim() || !groupIndex) return;

            try {
              const newItem = {
                name: newItemName.trim(),
                group_id: groupIndex,
              };

              const response = await maintenanceJobApi.create(newItem);
              const createdItem = response.data || response;

              setMaintenanceJobsGroupData((prevData) =>
                prevData.map((group) => {
                  if (group.id === groupIndex) {
                    return {
                      ...group,
                      maintenanceJobs: [
                        ...(group.maintenanceJobs || []),
                        createdItem,
                      ],
                    };
                  }
                  return group;
                }),
              );

              closeMaintenanceModal();
            } catch (err) {
              console.error("Erro ao adicionar serviço:", err);
              setErrorOnCreateItem(
                err.response?.data?.message || "Erro ao adicionar serviço.",
              );

              // REPASSA O ERRO PARA O TRY/CATCH DA MODAL
              throw err;
            }
          }}
          onError={errorOnCreateItem}
        />
      )}
    </div>
  );
};

export default NewServiceOrder;
