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
        let found = getServiceOrderById(Number(id));

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
        }

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
      value_unity: "",
      description: "",
    };
    setItemMaintenances([...itemMaintenances, newJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    setItemMaintenances(itemMaintenances.filter((item) => item.id !== id));
  };

  const handleMaintenanceJobChange = (id, field, value) => {
    setItemMaintenances((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;

        if (field === "maintenance_id") {
          if (!value) {
            return { ...job, maintenance_id: null, value_unity: "" };
          }
          const foundJob = findMaintenanceJobById(value);
          if (foundJob) {
            const rawValue = foundJob.value_unity ?? foundJob.value_unit ?? "";
            return {
              ...job,
              maintenance_id: foundJob.id,
              value_unity:
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

  const handleAddMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      material_id: null,
      name: "",
      quantity: 1,
      value_unity: "",
      receipt: "",
      supplier: "",
    };
    setItemMaterials([...itemMaterials, newMaterial]);
  };

  const handleRemoveMaterial = (id) => {
    setItemMaterials(itemMaterials.filter((item) => item.id !== id));
  };

  const handleMaterialInputChange = (id, field, value) => {
    setItemMaterials((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        if (field === "material_id") {
          if (!value) {
            return { ...element, material_id: null, value_unity: "" };
          }
          const foundMat = findMaterialById(value);
          if (foundMat) {
            return {
              ...element,
              material_id: foundMat.id,
              name: foundMat.name,
              value_unity: foundMat.value_unity ?? foundMat.value_unit ?? "",
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

  const calculateTotalMaintenanceJob = () => {
    return itemMaintenances.reduce((total, job) => {
      return total + parseValue(job.value_unity);
    }, 0);
  };

  const calculateTotalMaterials = () => {
    return itemMaterials.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const value = parseValue(item.value_unity);
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
        subtotal: calculateGrandTotal(),
      };

      const { data } = await orderApi.update(serviceOrder.id, updateData);

      for (const item of itemMaintenances) {
        const isNew = item.id > 1000000;
        if (isNew) {
          await itemMaintenanceApi.create({
            serviceorder_id: serviceOrder.id,
            maintenance_id: item.maintenance_id,
            value_unity: parseValue(item.value_unity),
            description: item.description || "",
          });
        } else {
          await itemMaintenanceApi.update(item.id, {
            maintenance_id: item.maintenance_id,
            value_unity: parseValue(item.value_unity),
            description: item.description || "",
          });
        }
      }

      for (const item of itemMaterials) {
        const isNew = item.id > 1000000;
        if (isNew) {
          await itemMaterialApi.create({
            serviceorder_id: serviceOrder.id,
            material_id: item.material_id,
            quantity: parseValue(item.quantity),
            value_unity: parseValue(item.value_unity),
            receipt: item.receipt || "",
            supplier: item.supplier || "",
          });
        } else {
          await itemMaterialApi.update(item.id, {
            material_id: item.material_id,
            quantity: parseValue(item.quantity),
            value_unity: parseValue(item.value_unity),
            receipt: item.receipt || "",
            supplier: item.supplier || "",
          });
        }
      }

      const updatedOrder = { ...serviceOrder, ...data };
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
          <div className="form-section">
            <div className="fs-header">
              <span className="fs-title">Serviços</span>
            </div>
            <div className="fs-body">
              <div className="services-list">
                {itemMaintenances.length > 0 ? (
                  itemMaintenances.map((element, index) => (
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
                            value={
                              element.maintenance_id
                                ? String(element.maintenance_id)
                                : ""
                            }
                            onChange={(e) =>
                              handleMaintenanceJobChange(
                                element.id,
                                "maintenance_id",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Selecione o serviço...</option>
                            {maintenanceJobsGroupData.map(
                              (group, groupIndex) => (
                                <optgroup key={groupIndex} label={group.group}>
                                  {group.maintenanceJobs?.map((item) => (
                                    <option
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
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
                              value={element.value_unity || ""}
                              onChange={(e) =>
                                handleMaintenanceJobChange(
                                  element.id,
                                  "value_unity",
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
                                element.id,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">Nenhum serviço adicionado</div>
                )}
              </div>
              <button className="add-row-btn" onClick={handleAddMaintenanceJob}>
                + Adicionar serviço
              </button>
            </div>
          </div>

          {/* ========== PEÇAS & MATERIAIS ========== */}
          <div className="form-section">
            <div className="fs-header">
              <span className="fs-title">Peças & Materiais</span>
            </div>
            <div className="fs-body">
              <div className="mat-table-wrap">
                <table className="mat-table">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Qtd.</th>
                      <th>Valor Unit.</th>
                      <th>Total</th>
                      <th>Loja</th>
                      <th>Recibo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemMaterials.length > 0 ? (
                      itemMaterials.map((element) => (
                        <tr className="add-material-row" key={element.id}>
                          <td>
                            <select
                              className="select select-new-order-material"
                              value={
                                element.material_id
                                  ? String(element.material_id)
                                  : ""
                              }
                              onChange={(e) =>
                                handleMaterialInputChange(
                                  element.id,
                                  "material_id",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Selecione...</option>
                              {materialsGroupData.map((group, groupIndex) => (
                                <optgroup key={groupIndex} label={group.group}>
                                  {group.materials?.map((material) => (
                                    <option
                                      key={material.id}
                                      value={String(material.id)}
                                    >
                                      {material.name}
                                    </option>
                                  ))}
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
                                value={element.value_unity || ""}
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
                              value={(
                                (parseFloat(element.quantity) || 0) *
                                parseValue(element.value_unity)
                              ).toFixed(2)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input input-new-order-material-ref"
                              placeholder="Ref."
                              value={element.supplier || ""}
                              onChange={(e) =>
                                handleMaterialInputChange(
                                  element.id,
                                  "supplier",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input input-new-order-material-ref"
                              placeholder="Ref."
                              value={element.receipt || ""}
                              onChange={(e) =>
                                handleMaterialInputChange(
                                  element.id,
                                  "receipt",
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
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          Nenhum material adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button className="add-row-btn" onClick={handleAddMaterial}>
                + Adicionar peça / material
              </button>
              <div className="total-row">
                <div className="total-item">
                  Mão de obra:{" "}
                  <strong>
                    R$ {calculateTotalMaintenanceJob().toFixed(2)}
                  </strong>
                </div>
                <div className="total-row-divider"></div>
                <div className="total-item">
                  Peças:{" "}
                  <strong>R$ {calculateTotalMaterials().toFixed(2)}</strong>
                </div>
                <div className="total-row-divider"></div>
                <div className="total-item">
                  Total:{" "}
                  <span className="grand-total">
                    R$ {calculateGrandTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
