import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { materialGroupApi } from "../api/materialGroups";
import { formattedPrice } from "../utils/convertPrice";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";
import NewOrderMaintenanceJob from "../components/NewOrderMaintenanceJob";
import Loading from "./Loading";

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
        setPayment(data.paid);

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
    setItemMaintenances(itemMaintenances.filter((item) => item.id !== id));
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
    setItemMaterials(itemMaterials.filter((item) => item.id !== id));
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
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const clean = value.replace(",", ".").replace(/[^0-9.]/g, "");
      return parseFloat(clean) || 0;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceOrder) return;

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
            return createdItem;
          } else {
            await itemMaintenanceApi.update(item.id, payload);
            return item;
          }
        }),
      );

      // 2. Processa e atualiza a lista de Peças/Materiais
      const updatedItemMaterials = await Promise.all(
        itemMaterials.map(async (item) => {
          const isNew = item.id > 1000000;
          const payload = {
            serviceorder_id: serviceOrder.id,
            material_id: item.material_id,
            itemMaintenance_id: item.itemMaintenance_id,
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

      updateServiceOrder(updatedOrder);
      navigate("/");
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
      const updateData = { paid: Number(payment) };
      const { data } = await orderApi.update(serviceOrder.id, updateData);
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
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
          <div id="editStatusBadge">
            {statusReverseMap[serviceOrder.status]}
          </div>
          <div id="editPriBadge">
            {priorityReverseMap[serviceOrder.priority]}
          </div>
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
                <div className="field">
                  <label>Técnico Responsável</label>
                  <select
                    className="select"
                    value={serviceOrder.professional || ""}
                    onChange={(e) =>
                      handleFormFieldChange("professional", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="João Calazans">João Calazans</option>
                    <option value="Waguinho">Waguinho</option>
                  </select>
                </div>
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
                      Number(serviceOrder.paid) >= calculateGrandTotal()
                        ? "payment-saldo-ok"
                        : "payment-saldo-due"
                    }`}
                  >
                    {Number(serviceOrder.paid) >= calculateGrandTotal()
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
                <div className="status-card-body-container-registrar-pagamento-input-container">
                  <div className="status-card-body-registrar-pagamento-input-container input-prefix">
                    <span>R$</span>
                    <input
                      type="text"
                      className="input status-card-body-registrar-pagamento-input"
                      placeholder="0,00"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmitPayment}
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
  );
};

export default EditServiceOrder;
