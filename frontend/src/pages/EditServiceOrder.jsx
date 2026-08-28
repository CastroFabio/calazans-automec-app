import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusReverseMap, statusReverseMapBadge } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { materialGroupApi } from "../api/materialGroups";
import { formattedPrice } from "../utils/convertPrice";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";
import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import Loading from "./Loading";
import StatusBadge from "../components/StatusBadge.component";
import ProfessionalSelect from "../components/ProfessionalSelect.component";
import { PATHS } from "../utils/paths";

const EditServiceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ========== CONTEXTO ==========
  const { getServiceOrderById, updateServiceOrder } = useServiceOrders();

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

  // ========== BUSCAR DADOS ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar ordem de serviço
        /* let found = getServiceOrderById(Number(id));

        if (found) {
          setServiceOrder(found);
          setItemMaintenances(found.itemMaintenances || []);
          setItemMaterials(found.itemMaterials || []);
          setPayment(found.paid);
        } else { 
          const { data } = await orderApi.getById(Number(id));
          setServiceOrder(data);
          setItemMaintenances(data.itemMaintenances || []);
          setItemMaterials(data.itemMaterials || []);
          setPayment(data.paid);
         } */

        const { data } = await orderApi.getById(Number(id));
        setServiceOrder(data);
        setItemMaintenances(data.itemMaintenances || []);
        setItemMaterials(data.itemMaterials || []);

        // 2. Buscar grupos de serviços (para o select)
        const { data: maintenanceData } = await maintenanceGroupApi.getAll();
        setMaintenanceJobsGroupData(maintenanceData);

        // 3. Buscar grupos de materiais (para o select)
        const { data: materialData } = await materialGroupApi.getAll();
        setMaterialsGroupData(materialData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id, getServiceOrderById]);

  // ========== FUNÇÕES PARA SERVIÇOS (itemMaintenances) ==========

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

  const handleAddMaintenanceJob = () => {
    const newJob = {
      id: Date.now(),
      maintenance_id: null,
      value_unit: "",
      description: "",
    };
    setItemMaintenances([...itemMaintenances, newJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    // Se for um serviço já salvo no banco, guarda o ID para remover na API
    if (id <= 1000000) {
      setDeletedMaintenanceIds((prev) => [...prev, id]);
    }

    // Remove também todos os materiais associados a este serviço localmente (e do banco se já existiam)
    const materialsToRemove = itemMaterials.filter(
      (mat) => mat.itemMaintenance_id === id,
    );

    materialsToRemove.forEach((mat) => {
      if (mat.id <= 1000000) {
        setDeletedMaterialIds((prev) => [...prev, mat.id]);
      }
    });

    // Remove do estado local da tela
    setItemMaterials((prev) =>
      prev.filter((mat) => mat.itemMaintenance_id !== id),
    );
    setItemMaintenances((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMaintenanceJobChange = (
    id,
    field,
    value,
    maintenanceJobsGroupData,
  ) => {
    setItemMaintenances((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;

        if (field === "maintenance_id") {
          if (!value) {
            return { ...job, maintenance_id: null, value_unit: "" };
          }
          const foundJob = findMaintenanceJobById(value);
          if (foundJob) {
            const rawValue = foundJob.value_unit ?? foundJob.value_unit ?? "";
            return {
              ...job,
              maintenance_id: foundJob.id,
              value_unit:
                typeof rawValue === "string" ? rawValue : String(rawValue),
            };
          }
        }

        return { ...job, [field]: value };
      }),
    );
  };

  // ========== FUNÇÕES PARA MATERIAIS (itemMaterials) ==========

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

  const handleAddMaterial = (itemMaintenanceID) => {
    const newMaterial = {
      id: Date.now(),
      material_id: null,
      itemMaintenance_id: itemMaintenanceID,
      name: "",
      quantity: 1,
      value_unit: "",
      receipt: "",
      supplier: "",
    };
    setItemMaterials([...itemMaterials, newMaterial]);
  };

  const handleRemoveMaterial = (id) => {
    // Se for um item já persistido no banco (ID normal), guarda para deletar na API
    if (id <= 1000000) {
      setDeletedMaterialIds((prev) => [...prev, id]);
    }

    // Remove do estado local da tela
    setItemMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMaterialInputChange = (id, field, value, materialGroupData) => {
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
              value_unit: foundMat.value_unit ?? foundMat.value_unit ?? "",
            };
          }
        }

        return { ...element, [field]: value };
      }),
    );
  };

  // ========== CÁLCULOS ==========

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
    parseValue(serviceOrder.labor_cost || 0);

  const calculateTotalMaterials = () => {
    return itemMaterials.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const value = parseValue(item.value_unit);
      return total + quantity * value;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalMaintenanceJob() + calculateTotalMaterials();
  };

  // ========== SALVAR ORDEM ==========

  const handlePaymentOnChange = (e) => {
    let value = e.target.value;
    value = value.replace(",", ".");
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");

    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    if (parts[1] && parts[1].length > 2) {
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setPayment(value);
  };
  // ========== SALVAR ORDEM ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorList = [];

    if (!serviceOrder) return;

    // 1. Cliente
    if (!serviceOrder.customer_id) {
      errorList.push("Selecione um cliente");
    }

    // 2. Veículo
    if (!serviceOrder.vehicle_id) {
      errorList.push("Selecione um veículo");
    }

    // 3. Diagnóstico
    if (!serviceOrder.diagnosis?.trim()) {
      errorList.push("Preencha o diagnóstico");
    }

    // 4. Pelo menos um serviço ou material
    if (itemMaintenances.length <= 0) {
      errorList.push("Adicione pelo menos um serviço");
    }

    if (!serviceOrder.labor_cost) {
      errorList.push("Adicione um valor de mão de obra");
    }

    if (!parseFloat(serviceOrder.labor_cost))
      errorList.push("Valor de mão de obra deve ser um número.");

    // ========== VALIDAÇÃO DE SERVIÇOS ==========

    const invalidServices = itemMaintenances.filter((job) => {
      if (!job.maintenance_id) return true;

      return false;
    });

    if (invalidServices.length > 0) {
      const errorMessages = invalidServices.map((job, index) => {
        const errors = [];
        if (!job.maintenance_id) errors.push("serviço não selecionado");
        return `Serviço #${index + 1}: ${errors.join(" e ")}`;
      });

      errorList.push(`Serviços incompletos:\n${errorMessages.join("\n")}`);
    }

    // ========== VALIDAÇÃO DE MATERIAIS ==========

    const invalidMaterials = itemMaterials.filter((item) => {
      if (!item.material_id) return true;
      const quantity = parseFloat(item.quantity) || 0;
      if (quantity <= 0) return true;
      const value = parseFloat(item.value_unit) || 0;
      if (value <= 0) return true;
      return false;
    });

    if (invalidMaterials.length > 0) {
      const errorMessages = invalidMaterials.map((item, index) => {
        const errors = [];
        if (!item.material_id) errors.push("material não selecionado");
        const quantity = parseFloat(item.quantity) || 0;
        if (quantity <= 0) errors.push("quantidade inválida");
        const value = parseValue(item.value_unit) || 0;
        if (value <= 0) errors.push("valor inválido");
        return `Material #${index + 1}: ${errors.join(" e ")}`;
      });

      errorList.push(`Materiais incompletos:\n${errorMessages.join("\n")}`);
    }

    // ========== VALIDAÇÃO DE VALORES POSITIVOS ==========
    if (itemMaterials.length > 0) {
      const hasValidMaterialQty = itemMaterials.some((item) => {
        const quantity = Number(item.quantity) || 0;
        return quantity > 0;
      });
      const hasValidMaterialValue = itemMaterials.some((item) => {
        const value = parseFloat(item.value_unit) || 0;
        return value > 0;
      });

      if (!hasValidMaterialQty) {
        errorList.push("A quantidade de material tem que ser número.");
      }

      if (!hasValidMaterialValue) {
        errorList.push("O valor de material tem que ser número.");
      }
    }

    // ========== VALIDAÇÃO DE NOMES ==========

    const servicesWithoutName = itemMaintenances.filter((job) => {
      job.maintenance_id && !job.name;
    });

    if (servicesWithoutName.length > 0) {
      errorList.push(
        "Alguns serviços não têm nome associado. Selecione novamente.",
      );
    }

    const materialsWithoutName = itemMaterials.filter(
      (item) => !item.material_id && !item.name,
    );

    if (materialsWithoutName.length > 0) {
      errorList.push(
        "Alguns materiais não têm nome associado. Selecione novamente.",
      );
    }

    if (errorList.length > 0) {
      alert(errorList.join("\n"));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updateData = {
        professional: serviceOrder.professional,
        priority: serviceOrder.priority,
        status: serviceOrder.status,
        diagnosis: serviceOrder.diagnosis,
        observation: serviceOrder.observation,
        paid: serviceOrder.paid,
        subtotal: parseFloat(calculateGrandTotal().toFixed(2)),
        labor_cost: parseValue(serviceOrder.labor_cost) || 0,
      };

      const { data } = await orderApi.update(serviceOrder.id, updateData);

      // Mapeador para associar IDs temporários/antigos aos novos IDs do Backend
      const maintenanceIdMap = {};

      // 1. Processa e atualiza a lista de Manutenções/Serviços
      const updatedItemMaintenances = await Promise.all(
        itemMaintenances.map(async (item) => {
          const isNew = item.id > 1000000;
          const payload = {
            serviceorder_id: serviceOrder.id,
            maintenance_id: item.maintenance_id,
            description: item.description || "",
          };

          if (isNew) {
            // Recebe o item criado pelo Backend (com o ID definitivo gerado)
            const { data: createdItem } =
              await itemMaintenanceApi.create(payload);

            // Mapeia o ID temporário (item.id) para o ID real retornado (createdItem.id)
            maintenanceIdMap[item.id] = createdItem.id;

            return createdItem;
          } else {
            await itemMaintenanceApi.update(item.id, payload);

            // Mantém o próprio ID existente no mapa para fallback
            maintenanceIdMap[item.id] = item.id;

            return item;
          }
        }),
      );

      // 2. Processa e atualiza a lista de Peças/Materiais
      const updatedItemMaterials = await Promise.all(
        itemMaterials.map(async (item) => {
          const isNew = item.id > 1000000;

          // Resolve o itemMaintenance_id real usando o mapeamento
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
          };

          if (isNew) {
            // Recebe o material criado pelo Backend (com o ID definitivo gerado)
            const { data: createdMaterial } =
              await itemMaterialApi.create(payload);
            return createdMaterial;
          } else {
            await itemMaterialApi.update(item.id, payload);
            return item;
          }
        }),
      );

      // 3. Monta o objeto atualizado com os dados vindos das APIs
      const updatedOrder = {
        ...serviceOrder,
        ...data,
        itemMaintenances: updatedItemMaintenances,
        itemMaterials: updatedItemMaterials,
      };

      // Excluir materiais do backend
      if (deletedMaterialIds.length > 0) {
        await Promise.all(
          deletedMaterialIds.map((id) => itemMaterialApi.delete(id)),
        );
        setDeletedMaterialIds([]);
      }

      // Excluir serviços (itemMaintenances) do backend
      if (deletedMaintenanceIds.length > 0) {
        await Promise.all(
          deletedMaintenanceIds.map((id) => itemMaintenanceApi.delete(id)),
        );
        setDeletedMaintenanceIds([]);
      }

      updateServiceOrder(updatedOrder);
      navigate(PATHS.serviceOrder);
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder) return;

    setSaving(true);
    setError(null);

    try {
      // Trata e converte para número
      const formattedPayment = payment.replace(",", ".");
      const numericPayment = parseValue(formattedPayment);

      const updateData = { paid: numericPayment };
      const { data } = await orderApi.update(serviceOrder.id, updateData);
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);

      // Opcional: limpa o campo após registrar o pagamento
      setPayment("");
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder || !payment) return;

    setSaving(true);
    setError(null);

    try {
      const numericPayment = parseValue(payment);
      const updateData = { paid: numericPayment };

      const { data } = await orderApi.update(serviceOrder.id, updateData);
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);

      setPayment(""); // Limpa o input após a gravação
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
    } finally {
      setSaving(false);
    }
  };

  // Soma o valor digitado ao valor que já foi pago anteriormente
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder || !payment) return;

    setSaving(true);
    setError(null);

    try {
      const currentPaid = parseValue(serviceOrder.paid);
      const addedValue = parseValue(payment);
      const newTotalPaid = currentPaid + addedValue;

      const updateData = { paid: newTotalPaid };

      const { data } = await orderApi.update(serviceOrder.id, updateData);
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);

      setPayment(""); // Limpa o input após a gravação
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao adicionar pagamento");
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
      navigate("/");
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao cancelar ordem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Erro: {error}</div>;
  if (!serviceOrder) return <div>Ordem de serviço não encontrada</div>;

  return (
    <div className="page" id="page-editar-os">
      <div className="edit-order-container">
        <div className="breadcrumb">
          <a onClick={() => navigate("/")}>Ordens de Serviço</a>
          <span className="breadcrumb-sep">›</span>
          <span className="edit-order-id-header" id="editBreadcrumbId">
            #{serviceOrder.id}
          </span>
        </div>
      </div>

      <div className="page-header edit-order-page-header">
        <div>
          <div className="ph-title" id="editPageTitle">
            Editar Ordem de Serviço
          </div>
          <div className="ph-sub" id="editPageSub">
            Atualize os dados, status e registre observações
          </div>
        </div>
        <div className="edit-order-status-prio-container">
          <StatusBadge status={serviceOrder.status} />
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="edit-layout">
        <div className="edit-main">
          {/* ========== CLIENTE & VEÍCULO ========== */}
          <div className="form-section">
            <div className="fs-header">
              <span className="fs-title">Cliente & Veículo</span>
            </div>
            <div className="fs-body">
              <div className="form-grid edit-order-form-grid">
                <div className="field">
                  <label>Cliente</label>
                  <div className="input edit-order-input">
                    {serviceOrder.customer?.name || "—"}
                  </div>
                </div>
                <div className="field">
                  <label>Veículo</label>
                  <div className="input edit-order-input">
                    <span>{serviceOrder.vehicle?.license_plate || "—"}</span>
                    {serviceOrder.vehicle?.brand && (
                      <>
                        {" "}
                        · {serviceOrder.vehicle.brand}{" "}
                        {serviceOrder.vehicle.model}
                      </>
                    )}
                  </div>
                </div>
                <div className="field">
                  <label>Km na Entrada</label>
                  <div className="input edit-order-input-km">
                    {serviceOrder.entry_km}
                  </div>
                </div>
                <div className="field">
                  <label>Data / Hora Entrada</label>
                  <div className="input edit-order-input">
                    {formatLocalDateTimeStringISO(serviceOrder.arrived_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== SERVIÇOS ========== */}
          <NewOrderMaintenanceJob
            formData={serviceOrder}
            handleFormFieldChange={handleFormFieldChange}
            listMaintenanceJobs={itemMaintenances}
            handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
            handleMaintenanceJobChange={handleMaintenanceJobChange}
            findMaintenanceJobById={findMaintenanceJobById}
            setListMaintenanceJobs={setItemMaintenances}
            maintenanceJobsGroupData={maintenanceJobsGroupData}
            handleAddMaterial={handleAddMaterial}
            materialsList={itemMaterials}
            handleMaterialInputChange={handleMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveMaterial}
            findMaterialById={findMaterialById}
            handleAddMaintenanceJob={handleAddMaintenanceJob}
            calculateTotalMaintenanceJob={calculateTotalMaintenanceJob}
            calculateTotalMaterials={calculateTotalMaterials}
            calculateGrandTotal={calculateGrandTotal}
          />
          {/* ========== DIAGNÓSTICO & INFORMAÇÕES ========== */}
          <div className="form-section">
            <div className="fs-header">
              <span className="fs-title">Diagnóstico & Informações</span>
            </div>
            <div className="fs-body">
              <div className="form-grid g3 edit-order-form-grid-container">
                <ProfessionalSelect
                  handleFormFieldChange={handleFormFieldChange}
                  professional={serviceOrder.professional}
                />
                <div className="field">
                  <label>Status</label>
                  <select
                    className="select"
                    value={serviceOrder.status || ""}
                    onChange={(e) =>
                      handleFormFieldChange("status", Number(e.target.value))
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value={1}>{statusReverseMap[1]}</option>
                    <option value={2}>{statusReverseMap[2]}</option>
                    <option value={3}>{statusReverseMap[3]}</option>
                    <option value={4}>{statusReverseMap[4]}</option>
                    <option value={5}>{statusReverseMap[5]}</option>
                    <option value={6}>{statusReverseMap[6]}</option>
                    <option value={7}>{statusReverseMap[7]}</option>
                  </select>
                </div>
                <div className="field col-full">
                  <label>Diagnóstico / Descrição *</label>
                  <textarea
                    className="textarea"
                    value={serviceOrder.diagnosis || ""}
                    onChange={(e) =>
                      handleFormFieldChange("diagnosis", e.target.value)
                    }
                    placeholder="Descreva o problema e diagnóstico..."
                    rows={3}
                  />
                </div>
                <div className="field col-full">
                  <label>Observações Internas</label>
                  <textarea
                    className="textarea edit-order-textarea"
                    value={serviceOrder.observation || ""}
                    onChange={(e) =>
                      handleFormFieldChange("observation", e.target.value)
                    }
                    placeholder="Notas internas da equipe..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== AÇÕES ========== */}
          <div className="form-actions">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Voltar
            </button>
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

        {/* ========== SIDEBAR ========== */}
        <div className="edit-side">
          <div className="status-card">
            <div className="status-card-header">Pagamento</div>
            <div className="status-card-body status-card-body-container">
              <div id="editPaymentRows">
                <div className="payment-row">
                  <span className="payment-row-total-os">Total da OS</span>
                  <span className="payment-total payment-total-value">
                    {formattedPrice(calculateGrandTotal())}
                  </span>
                </div>
                <div className="payment-row">
                  <span className="payment-row-total-pago">Total pago</span>
                  <span className="payment-row-total-pago-value">
                    {formattedPrice(serviceOrder.paid)}
                  </span>
                </div>
                <div className="payment-row payment-row-container">
                  <span className="payment-row-saldo-restante">
                    Saldo restante
                  </span>
                  <span
                    className={`payment-row-saldo-restante-value ${
                      parseValue(serviceOrder.paid) >= calculateGrandTotal()
                        ? "payment-saldo-ok"
                        : "payment-saldo-due"
                    }`}
                  >
                    {parseValue(serviceOrder.paid) >= calculateGrandTotal()
                      ? "Quitado"
                      : formattedPrice(
                          calculateGrandTotal() - serviceOrder.paid,
                        )}
                  </span>
                </div>
              </div>
              <div className="status-card-body status-card-body-container-registrar-pagamento">
                <div className="status-card-body-container-registrar-pagamento-text">
                  Registrar pagamento
                </div>
                <div
                  className="status-card-body-container-registrar-pagamento-input-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div className="status-card-body-registrar-pagamento-input-container input-prefix">
                    <span>R$</span>
                    <input
                      type="text"
                      className="input status-card-body-registrar-pagamento-input"
                      placeholder="0,00"
                      value={payment}
                      onChange={handlePaymentOnChange}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={handleAddPayment}
                      disabled={saving || !payment}
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={handleSetPayment}
                      disabled={saving || !payment}
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceOrder;
