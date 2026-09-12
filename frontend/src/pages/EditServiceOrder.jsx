import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useServiceOrders } from "../context/ServiceOrder.context";

import { orderApi } from "../api/orders";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { materialGroupApi } from "../api/materialGroups";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";

import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { statusMap, statusReverseMap } from "../utils/statusMap";
import { formattedPrice } from "../utils/convertPrice";
import { PATHS } from "../utils/paths";
import {
  getNumberValue,
  parseInputValue,
  parseValue,
} from "../utils/parseValue";

import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import ProfessionalSelect from "../components/ProfessionalSelect.component";
import NewCustomerModal from "../components/NewCustomerModal.component";
import NewVehicleModal from "../components/NewVehicleModal.component";
import NewItemModal from "../components/NewItemModal.component";
import StatusBadge from "../components/StatusBadge.component";

import Loading from "./Loading";
import CustomerAndVehicleForm from "../components/CustomerAndVehicleForm.component";
import ServiceOrderDetailsForm from "../components/ServiceOrderDetailsForm.component";
import PaymentStatusForm from "../components/PaymentStatusForm.component";
import {
  paymentStatusMap,
  paymentStatusReverseMap,
} from "../utils/paymentStatusMap";

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

const EditServiceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ========== CONTEXTO ==========
  const { updateServiceOrder, transformBackendToUIJob } = useServiceOrders();

  // ========== ESTADOS ==========
  const [serviceOrder, setServiceOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState("");
  const [deletedMaterialIds, setDeletedMaterialIds] = useState([]);
  const [deletedMaintenanceIds, setDeletedMaintenanceIds] = useState([]);

  // Estados para serviços (itemMaintenances)
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [itemMaintenances, setItemMaintenances] = useState([]);

  // Estados para materiais (itemMaterials)
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [itemMaterials, setItemMaterials] = useState([]);

  const [isCustomerModalOpen, setCustomerIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setMaintenanceIsModalOpen] = useState(false);

  const [selectedCustomerFromModal, setSelectedCustomerFromModal] = useState(
    {},
  );
  const [selectedVehicleFromModal, setSelectedVehicleFromModal] = useState({});

  const [inputValue, setInputValue] = useState("");

  // ========== BUSCAR DADOS ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await orderApi.getById(Number(id));
        setServiceOrder(data);

        const allMaterials = data.itemMaterials || [];
        setItemMaterials(allMaterials);

        // Grupos de serviços e materiais
        const { data: maintenanceData } = await maintenanceGroupApi.getAll();
        setMaintenanceJobsGroupData(maintenanceData);

        const { data: materialData } = await materialGroupApi.getAll();
        setMaterialsGroupData(materialData);

        // Formata os serviços mapeando suas peças vinculadas e calculando o subtotal
        const formattedMaintenances = (data.itemMaintenances || []).map((m) => {
          const linkedMaterials = allMaterials.filter(
            (mat) => Number(mat.itemMaintenance_id) === Number(m.id),
          );

          const materialsSum = linkedMaterials.reduce((acc, mat) => {
            const qty = parseFloat(mat.quantity) || 0;
            const val = parseFloat(mat.value_unit) || 0;
            return acc + qty * val;
          }, 0);

          return {
            ...m,
            name: m.maintenancejob.name || "Serviço",
            materialsList: linkedMaterials.map((mat) => ({
              ...mat,
              name: mat.name || mat.material?.name || "Peça",
            })),
            totalPrice: materialsSum,
          };
        });

        setItemMaintenances(formattedMaintenances);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  // ========== FUNÇÃO DE ADICIONAR SERVIÇO ==========
  const handleAddMaintenanceJob = (itemService, editingJobId = null) => {
    const serviceId = editingJobId || Date.now();

    const formattedMaterials = (itemService.materialsList || []).map((mat) => ({
      ...mat,
      id: mat.id || Date.now() + Math.random(),
      itemMaintenance_id: serviceId,
    }));

    const serviceTotalPrice = formattedMaterials.reduce((total, mat) => {
      const materialQuantityNumber = getNumberValue(mat.quantity) || 0;

      const materialValueParsed = parseInputValue(mat.value_unit);

      const materialValueNumber = getNumberValue(materialValueParsed);

      return total + materialQuantityNumber * materialValueNumber;
    }, 0);

    const updatedJob = {
      id: serviceId,
      maintenance_id: itemService.service.id,
      name: itemService.service.name,
      description: itemService.description || "",
      materialsList: formattedMaterials,
      totalPrice: getNumberValue(serviceTotalPrice),
      maintenance: {
        id: itemService.service.id,
        name: itemService.service.name,
      },
    };

    // Se for edição, substitui na lista; se for novo, adiciona
    setItemMaintenances((prev) => {
      const exists = prev.some((item) => item.id === serviceId);
      if (exists) {
        return prev.map((item) => (item.id === serviceId ? updatedJob : item));
      }
      return [...prev, updatedJob];
    });

    // Atualiza também o estado global das peças (itemMaterials)
    setItemMaterials((prev) => {
      const otherMaterials = prev.filter(
        (mat) => Number(mat.itemMaintenance_id) !== Number(serviceId),
      );
      return [...otherMaterials, ...formattedMaterials];
    });
  };

  // ========== FUNÇÕES DE SUPORTE E DELEÇÃO ==========

  const findMaintenanceJobById = (targetId) => {
    const numericId = Number(targetId);
    for (const group of maintenanceJobsGroupData) {
      const found = group.maintenanceJobs?.find(
        (item) => Number(item.id) === numericId,
      );
      if (found) return found;
    }
    return null;
  };

  const findMaterialById = (targetId) => {
    const numericId = Number(targetId);
    for (const group of materialsGroupData) {
      const found = group.materials?.find(
        (item) => Number(item.id) === numericId,
      );
      if (found) return found;
    }
    return null;
  };

  const findMaterialListById = (id) => {
    if (!id) return null;
    const found = materialsList.find((item) => item.id === id);
    if (found) return found;
    return null;
  };

  /*  // Função chamada por NewOrderMaintenanceJob para registrar um novo serviço
  const handleAddMaintenanceJob = (itemService, editingJobId = null) => {
    const serviceId = editingJobId || Date.now();

    const newJob = {
      id: serviceId,
      maintenance_id: itemService.service.id,
      name: itemService.service.name,
      description: itemService.description || "",
      maintenance: {
        id: itemService.service.id,
        name: itemService.service.name,
      },
    };

    setItemMaintenances((prev) => [...prev, newJob]);

    if (itemService.materialsList && itemService.materialsList.length > 0) {
      const formattedMaterials = itemService.materialsList.map((mat) => ({
        ...mat,
        id: mat.id || Date.now() + Math.random(),
        itemMaintenance_id: serviceId,
      }));

      setItemMaterials((prev) => [...prev, ...formattedMaterials]);
    }
  }; */

  const handleRemoveMaintenanceJob = (id) => {
    if (id <= 1000000) {
      setDeletedMaintenanceIds((prev) => [...prev, id]);
    }

    const materialsToRemove = itemMaterials.filter(
      (mat) => mat.itemMaintenance_id === id,
    );

    materialsToRemove.forEach((mat) => {
      if (mat.id <= 1000000) {
        setDeletedMaterialIds((prev) => [...prev, mat.id]);
      }
    });

    setItemMaterials((prev) =>
      prev.filter((mat) => mat.itemMaintenance_id !== id),
    );
    setItemMaintenances((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveMaterial = (id) => {
    if (id <= 1000000) {
      setDeletedMaterialIds((prev) => [...prev, id]);
    }
    setItemMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMaterialInputChange = (id, field, value) => {
    setItemMaterials((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        if (field === "material_id") {
          if (!value) {
            return { ...element, material_id: null, value_unit: "" };
          }
          const foundMat = findMaterialById(value);
          if (foundMat) {
            return {
              ...element,
              material_id: foundMat.id,
              name: foundMat.name,
              value_unit: foundMat.value_unit ?? "",
            };
          }
        }

        if (field === "value_unit") {
          if (!value) return { ...item, value_unit: "" };
          const found = findMaterialListById(matId);

          const valueUnitParsed = parseInputValue(value);

          if (found) {
            return {
              ...item,
              value_unit: valueUnitParsed,
            };
          }
        }

        return { ...element, [field]: value };
      }),
    );
  };

  // ========== CÁLCULOS ==========

  const calculateTotalMaintenanceJob = () =>
    getNumberValue(serviceOrder?.labor_cost || 0);

  const calculateTotalMaterials = () => {
    return (itemMaterials || []).reduce((total, item) => {
      const materialItemTotalPriceParsed = parseInputValue(item.quantity);

      const materialItemQuantityNumber = getNumberValue(item.value_unit);
      const materialItemTotalPriceNumber = getNumberValue(
        materialItemTotalPriceParsed,
      );

      const grandTotalPrice =
        total + materialItemTotalPriceNumber * materialItemQuantityNumber;

      return grandTotalPrice;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalMaintenanceJob() + calculateTotalMaterials();
  };

  const handlePaymentOnChange = (e) => {
    let value = e.target.value;

    value = value.replace(",", ".").replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Corta qualquer caractere após a segunda casa decimal
    if (parts[1] && parts[1].length > 2) {
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setPayment(value);
  };

  // ========== SUBMIT / SALVAR OS ==========

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceOrder) return;

    const errorList = [];

    /*   if (!serviceOrder.diagnosis?.trim()) {
      errorList.push("Preencha o diagnóstico");
    }
 */
    if (itemMaintenances.length <= 0) {
      errorList.push("Adicione pelo menos um serviço");
    }

    if (serviceOrder.labor_cost === "" || serviceOrder.labor_cost === null) {
      errorList.push("Adicione um valor de mão de obra");
    }

    if (errorList.length > 0) {
      alert(errorList.join("\n"));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 1. Apagar itens deletados do BD
      if (deletedMaterialIds.length > 0) {
        await Promise.all(
          deletedMaterialIds.map((id) => itemMaterialApi.delete(id)),
        );
        setDeletedMaterialIds([]);
      }

      if (deletedMaintenanceIds.length > 0) {
        await Promise.all(
          deletedMaintenanceIds.map((id) => itemMaintenanceApi.delete(id)),
        );
        setDeletedMaintenanceIds([]);
      }

      // 2. Atualizar OS principal
      const updateData = {
        professional: serviceOrder.professional,
        priority: serviceOrder.priority,
        status: serviceOrder.status,
        diagnosis: serviceOrder.diagnosis,
        observation: serviceOrder.observation,
        paid: parseValue(serviceOrder.paid),
        subtotal: parseFloat(calculateGrandTotal().toFixed(2)),
        labor_cost: parseValue(serviceOrder.labor_cost) || 0,
      };

      const { data } = await orderApi.update(serviceOrder.id, updateData);

      // 3. Salvar/Atualizar Manutenções
      const maintenanceIdMap = {};
      const updatedItemMaintenances = await Promise.all(
        itemMaintenances.map(async (item) => {
          const isNew = item.id > 1000000;
          const payload = {
            serviceorder_id: serviceOrder.id,
            maintenance_id: item.maintenance_id,
            description: item.description || "",
          };

          let savedItem;

          if (isNew) {
            const { data: createdItem } =
              await itemMaintenanceApi.create(payload);
            maintenanceIdMap[item.id] = createdItem.id;
            savedItem = createdItem;
          } else {
            await itemMaintenanceApi.update(item.id, payload);
            maintenanceIdMap[item.id] = item.id;
            savedItem = item;
          }

          // Mapeia o item mantendo os dados formatados para a UI
          const finalId = maintenanceIdMap[item.id];
          const linkedMaterials = itemMaterials.filter(
            (mat) =>
              Number(mat.itemMaintenance_id) === Number(item.id) ||
              Number(mat.itemMaintenance_id) === Number(finalId),
          );

          return {
            ...savedItem,
            id: finalId,
            name: item.name || savedItem.maintenancejob?.name || "Serviço",
            description: savedItem.description || "",
            materialsList: item.materialsList || linkedMaterials,
            totalPrice: item.totalPrice || 0,
            maintenance: {
              id: item.maintenance_id,
              name: item.name || savedItem.maintenancejob?.name || "Serviço",
            },
            isOpen: true,
          };
        }),
      );

      // 4. Salvar/Atualizar Materiais
      const updatedItemMaterials = await Promise.all(
        itemMaterials.map(async (item) => {
          const isNew = item.id > 1000000;
          const resolvedMaintenanceId =
            maintenanceIdMap[item.itemMaintenance_id] ||
            item.itemMaintenance_id ||
            null;

          const payload = {
            serviceorder_id: serviceOrder.id,
            material_id: item.material_id,
            itemMaintenance_id: resolvedMaintenanceId,
            quantity: parseValue(item.quantity),
            value_unit: parseValue(item.value_unit),
            receipt: item.receipt || "",
            supplier: item.supplier || "",
            isCustomerSupplier: item.isCustomerSupplier,
          };

          if (isNew) {
            const { data: createdMaterial } =
              await itemMaterialApi.create(payload);
            return createdMaterial;
          } else {
            await itemMaterialApi.update(item.id, payload);
            return item;
          }
        }),
      );

      const updatedOrder = {
        ...serviceOrder,
        ...data,
        itemMaintenances: updatedItemMaintenances,
        itemMaterials: updatedItemMaterials,
      };

      console.log("updatedOrder", updatedOrder);

      updateServiceOrder(updatedOrder);
      navigate(PATHS.serviceOrder);
    } catch (err) {
      console.error("❌ Erro ao atualizar OS:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder || !payment) return;

    setSaving(true);
    try {
      const numericPayment = parseValue(payment);
      const updateData = { paid: numericPayment };
      const { data } = await orderApi.update(serviceOrder.id, updateData);
      setServiceOrder((prev) => ({ ...prev, ...data }));
      setPayment("");
    } catch (err) {
      setError("Erro ao registrar pagamento");
    } finally {
      setSaving(false);
    }
  };

  const handlePayFully = async (e) => {
    e.preventDefault();
    if (!serviceOrder) return;

    setSaving(true);
    try {
      const grandTotalParsed = parseInputValue(calculateGrandTotal());

      const grandTotalNumber = getNumberValue(grandTotalParsed);

      handleFormFieldChange("paid", grandTotalNumber);
      handleFormFieldChange(
        "paymentStatus",
        paymentStatusMap["Pago Integralmente"],
      );

      setPayment("");
    } catch (err) {
      setError("Erro ao quitar pagamento");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder || !payment) return;

    setSaving(true);
    try {
      const currentPaidParsed = parseInputValue(serviceOrder.paid);
      const addedValueParsed = parseInputValue(payment);

      const currentPaidNumber = getNumberValue(currentPaidParsed);
      const addedValueNumber = getNumberValue(addedValueParsed);

      const updateData = currentPaidNumber + addedValueNumber;

      handleFormFieldChange("paid", updateData);

      if (serviceOrder.paid >= serviceOrder.subtotal) {
        handleFormFieldChange(
          "paymentStatus",
          paymentStatusMap["Pago Integralmente"],
        );
      } else {
        handleFormFieldChange(
          "paymentStatus",
          paymentStatusMap["Pago Parcialmente"],
        );
      }

      setPayment("");
    } catch (err) {
      setError("Erro ao adicionar pagamento");
    } finally {
      setSaving(false);
    }
  };

  const handleFormFieldChange = (field, value) => {
    setServiceOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveOrder = async () => {
    if (
      !window.confirm("Tem certeza que deseja cancelar esta ordem de serviço?")
    )
      return;

    try {
      setSaving(true);
      await orderApi.delete(serviceOrder.id);
      navigate(PATHS.serviceOrder);
    } catch (err) {
      setError("Erro ao cancelar ordem");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (value) => {
    setServiceOrder((prev) => ({
      ...prev,
      status: statusMap[value] || 1,
    }));
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

  if (loading) return <Loading />;
  if (!serviceOrder) return <div>Ordem de serviço não encontrada</div>;

  return (
    <div className="page">
      <div className="edit-order-container">
        <div className="breadcrumb">
          <a onClick={() => navigate(PATHS.serviceOrder)}>Ordens de Serviço</a>
          <span className="breadcrumb-sep">›</span>
          <span className="edit-order-id-header" id="editBreadcrumbId">
            #{serviceOrder.id}
          </span>
        </div>
      </div>

      <div className="page-header edit-order-page-header">
        <div>
          <div className="ph-sub" id="editPageSub">
            Atualize os dados, status e registre observações
          </div>
        </div>
        <div className="edit-order-status-prio-container">
          <StatusBadge status={serviceOrder.status} />
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="form-wrap">
        {/* ========================= */}
        {/* === CLIENTE E VEÍCULO === */}
        {/* ========================= */}
        <CustomerAndVehicleForm
          title={CATEGORIES.customer.title}
          icon={CATEGORIES.customer.icon}
          isAutocompleteDisabled={true}
          serviceOrder={serviceOrder}
        />

        {/* =============== */}
        {/* === SERVIÇO === */}
        {/* =============== */}
        <NewOrderMaintenanceJob
          formData={serviceOrder}
          handleFormFieldChange={handleFormFieldChange}
          listMaintenanceJobs={itemMaintenances}
          handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
          setListMaintenanceJobs={setItemMaintenances}
          maintenanceJobsGroupData={maintenanceJobsGroupData}
          handleAddMaintenanceJob={handleAddMaintenanceJob}
          formDataLaborCost={getNumberValue(serviceOrder?.labor_cost)}
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
          formDataPaymentStatus={serviceOrder.paymentStatus}
          calculateGrandTotal={calculateGrandTotal}
          formDataPaid={parseInputValue(serviceOrder.paid || "")}
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
          formDataProfessional={serviceOrder.professional}
          formDataStatus={serviceOrder.status}
          handleStatusChange={(e) => handleStatusChange(e.target.value)}
          formDataDiagnosis={serviceOrder.diagnosis}
        />

        {/* AÇÕES */}
        <div className="form-actions">
          <button
            className="btn btn-danger"
            onClick={handleRemoveOrder}
            disabled={saving}
          >
            Cancelar OS
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
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

              // 1. Chamada de API (ajuste para a rota correta da sua API se necessário)
              const response = await maintenanceJobApi.create(newItem);
              const createdItem = response.data || response;

              // 2. Atualiza o estado local maintenanceJobsGroupData
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
              alert(
                err.response?.data?.message || "Erro ao adicionar serviço.",
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default EditServiceOrder;
