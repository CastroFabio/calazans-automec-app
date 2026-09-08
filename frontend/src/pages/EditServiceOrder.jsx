import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusReverseMap } from "../utils/statusMap";
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
import { parseValue } from "../utils/parseValue";

const EditServiceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ========== CONTEXTO ==========
  const { updateServiceOrder } = useServiceOrders();

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
      const qty = parseFloat(mat.quantity) || 0;
      const val = parseValue(mat.value_unit);
      return total + qty * val;
    }, 0);

    const updatedJob = {
      id: serviceId,
      maintenance_id: itemService.service.id,
      name: itemService.service.name,
      description: itemService.description || "",
      materialsList: formattedMaterials,
      totalPrice: serviceTotalPrice,
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

        return { ...element, [field]: value };
      }),
    );
  };

  // ========== CÁLCULOS ==========

  const calculateTotalMaintenanceJob = () =>
    parseValue(serviceOrder?.labor_cost || 0);

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

    if (!serviceOrder.diagnosis?.trim()) {
      errorList.push("Preencha o diagnóstico");
    }

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

          if (isNew) {
            const { data: createdItem } =
              await itemMaintenanceApi.create(payload);
            maintenanceIdMap[item.id] = createdItem.id;
            return createdItem;
          } else {
            await itemMaintenanceApi.update(item.id, payload);
            maintenanceIdMap[item.id] = item.id;
            return item;
          }
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

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!serviceOrder || !payment) return;

    setSaving(true);
    try {
      const currentPaid = parseValue(serviceOrder.paid);
      const addedValue = parseValue(payment);
      const updateData = { paid: currentPaid + addedValue };
      const { data } = await orderApi.update(serviceOrder.id, updateData);
      setServiceOrder((prev) => ({ ...prev, ...data }));
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

  if (loading) return <Loading />;
  if (!serviceOrder) return <div>Ordem de serviço não encontrada</div>;

  return (
    <div className="page" id="page-editar-os">
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
          {/* CLIENTE & VEÍCULO */}
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
                      <>{` · ${serviceOrder.vehicle.brand} ${serviceOrder.vehicle.model}`}</>
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

          {/* SERVIÇOS & MATERIAIS */}
          <NewOrderMaintenanceJob
            formData={serviceOrder}
            handleFormFieldChange={handleFormFieldChange}
            listMaintenanceJobs={itemMaintenances}
            handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
            setListMaintenanceJobs={setItemMaintenances}
            maintenanceJobsGroupData={maintenanceJobsGroupData}
            handleAddMaterial={() => {}}
            handleMaterialInputChange={handleMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveMaterial}
            findMaterialById={findMaterialById}
            handleAddMaintenanceJob={handleAddMaintenanceJob}
            calculateTotalMaintenanceJob={calculateTotalMaintenanceJob}
            calculateTotalMaterials={calculateTotalMaterials}
            calculateGrandTotal={calculateGrandTotal}
          />

          {/* DIAGNÓSTICO & INFORMAÇÕES */}
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

        {/* SIDEBAR DE PAGAMENTO */}
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
                          calculateGrandTotal() - parseValue(serviceOrder.paid),
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
