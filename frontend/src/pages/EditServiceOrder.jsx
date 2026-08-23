import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";
import { orderApi } from "../api/orders";
import { statusMap, statusReverseMap } from "../utils/statusMap";
import { priorityReverseMap } from "../utils/priorityMap";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { materialGroupApi } from "../api/materialGroups";
import { formattedPrice } from "../utils/convertPrice";
import { itemMaterialApi } from "../api/itemMaterial";
import { itemMaintenanceApi } from "../api/itemMaintenance";

const EditServiceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ========== CONTEXTO ==========
  const { getServiceOrderById, updateServiceOrder } = useServiceOrders();

  // ========== ESTADOS ==========
  const [serviceOrder, setServiceOrder] = useState(null);
  const [originalServiceOrder, setOriginalServiceOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isClear, setIsClear] = useState(false);
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
          setOriginalServiceOrder(JSON.parse(JSON.stringify(found)));
          setItemMaintenances(found.itemMaintenances || []);
          setItemMaterials(found.itemMaterials || []);
          setPayment(found.paid);
        } else {
          const { data } = await orderApi.getById(Number(id));
          setServiceOrder(data);
          setOriginalServiceOrder(JSON.parse(JSON.stringify(data)));
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

  const findMaintenanceJobById = (id) => {
    for (const group of maintenanceJobsGroupData) {
      const found = group.maintenanceJobs?.find((item) => item.id === id);
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
          const foundJob = findMaintenanceJobById(Number(value));
          if (foundJob) {
            return {
              ...job,
              maintenance_id: foundJob.id,
              value_unity: formattedPrice(foundJob.value_unit),
            };
          }
          return { ...job, maintenance_id: null, value_unity: "" };
        }

        return { ...job, [field]: value };
      }),
    );
  };

  // ========== FUNÇÕES PARA MATERIAIS (itemMaterials) - CORRIGIDO ==========

  const findMaterialById = (id) => {
    for (const group of materialsGroupData) {
      const found = group.materials?.find((item) => item.id === id);
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

        // Se for value_unity, converter para número
        if (field === "name") {
          let foundJob = null;
          let foundValue = "";

          // Procurar o serviço selecionado
          for (const group of materialsGroupData) {
            const found = group.materials.find((item) => item.name === value);

            if (found) {
              foundJob = found;
              foundValue = found.value_unity;
              break;
            }
          }

          return {
            ...element,
            maintenance_id: foundJob ? foundJob.id : null, // ✅ CAPTURA O ID
            value_unity: foundValue,
          };
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
      // Remove caracteres não numéricos (exceto vírgula e ponto)
      const clean = value.replace(/[^0-9,.]/g, "");
      return parseFloat(clean) || 0;
    }

    return 0;
  };

  // ========== USO ==========
  const calculateTotalMaintenanceJob = () => {
    return itemMaintenances.reduce((total, job) => {
      return total + parseValue(job.value_unity);
    }, 0);
  };

  const calculateTotalMaterials = () => {
    return itemMaterials.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const value = parseFloat(item.value_unity) || 0;
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
    setSuccess(false);

    try {
      // 1. Atualizar dados básicos da OS
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

      // 2. Atualizar serviços (itemMaintenances)
      for (const item of itemMaintenances) {
        const isNew = item.id > 1000000;

        if (isNew) {
          // Criar novo item
          await itemMaintenanceApi.create({
            serviceorder_id: serviceOrder.id,
            maintenance_id: item.maintenance_id,
            value_unity: parseValue(item.value_unity),
            description: item.description || "",
          });
        } else {
          // Atualizar item existente
          await itemMaintenanceApi.update(item.id, {
            maintenance_id: item.maintenance_id,
            value_unity: parseValue(item.value_unity),
            description: item.description || "",
          });
        }
      }

      // 3. Atualizar materiais (itemMaterials)
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

      // 4. Atualizar contexto
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);

      setSuccess(true);
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
    setSuccess(false);

    try {
      // 1. Atualizar dados básicos da OS
      const updateData = {
        paid: Number(payment),
      };

      const { data } = await orderApi.update(serviceOrder.id, updateData);

      // 4. Atualizar contexto
      const updatedOrder = { ...serviceOrder, ...data };
      updateServiceOrder(updatedOrder);

      setSuccess(true);
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.response?.data?.message || "Erro ao atualizar ordem");
    } finally {
      setSaving(false);
    }
  };
  // ========== HANDLE CHANGE ==========

  const handleFormFieldChange = (field, value) => {
    setServiceOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormFieldPaidChange = (value) => {
    setPayment(value);
  };

  // ========== HANDLE REMOVE ORDEM ==========

  const handleRemoveOrder = async () => {
    if (
      !window.confirm("Tem certeza que deseja cancelar esta ordem de serviço?")
    ) {
      return;
    }

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

  // ========== RENDER ==========

  if (loading) return <div>Carregando ordem de serviço...</div>;
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
              <svg
                className="edit-order-icon-customer-vehicle"
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
              <span className="edit-order-icon-customer-vehicle-text">
                Somente leitura — altere na OS original
              </span>
            </div>
            <div className="fs-body">
              <div className="form-grid edit-order-form-grid">
                <div className="field">
                  <label>Cliente</label>
                  <div className="input edit-order-input" id="editClientName">
                    {serviceOrder.customer?.name || "—"}
                  </div>
                </div>
                <div className="field">
                  <label>Veículo</label>
                  <div className="input edit-order-input" id="editCarInfo">
                    <span className="edit-order-input-car-info">
                      {serviceOrder.vehicle?.license_plate || "—"}
                    </span>
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
                  <div className="input edit-order-input-km" id="editKm">
                    {serviceOrder.entry_km}
                  </div>
                </div>
                <div className="field">
                  <label>Data / Hora Entrada</label>
                  <div className="input edit-order-input" id="editEntrada">
                    {formatLocalDateTimeStringISO(serviceOrder.arrived_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== SERVIÇOS ========== */}
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
                            value={element.maintenance_id || ""}
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
                                  {group.maintenanceJobs?.map(
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

          {/* ========== PEÇAS & MATERIAIS ========== */}
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
                      <th className="mat-table-content-ref">Loja</th>
                      <th className="mat-table-content-ref">Recibo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemMaterials.length > 0 ? (
                      itemMaterials.map((element, index) => (
                        <tr className="add-material-row" key={element.id}>
                          <td>
                            <select
                              className="select select-new-order-material"
                              value={element.material_id || ""}
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
                                  {group.materials?.map(
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
                        <td colSpan="6" className="empty-state">
                          Nenhum material adicionado
                        </td>
                      </tr>
                    )}
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
                  <strong>
                    R$ {calculateTotalMaintenanceJob().toFixed(2)}
                  </strong>
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

          {/* ========== DIAGNÓSTICO & INFORMAÇÕES ========== */}
          <div className="form-section">
            <div className="fs-header">
              <svg
                className="edit-order-diagnosis-svg-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
                {/* <div className="field">
                  <label>Prioridade</label>
                  <select
                    className="select"
                    value={serviceOrder.priority || ""}
                    onChange={(e) =>
                      handleFormFieldChange("priority", Number(e.target.value))
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value={1}>Normal</option>
                    <option value={2}>Baixa</option>
                    <option value={3}>Alta</option>
                    <option value={4}>Urgente</option>
                  </select>
                </div> */}

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
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancelar OS
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {/* ========== SIDEBAR ========== */}
        <div className="edit-side">
          <div className="status-card">
            <div className="status-card-header">
              <svg
                className="status-card-header-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Pagamento
            </div>
            <div className="status-card-body status-card-body-container">
              <div id="editPaymentRows">
                <div className="payment-row">
                  <span className="payment-row-total-os">Total da OS</span>
                  <span className="payment-total payment-total-value">
                    {formattedPrice(serviceOrder.subtotal)}
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
                    className={`payment-row-saldo-restante-value  ${Number(serviceOrder.paid) >= Number(serviceOrder.subtotal) ? "payment-saldo-ok" : "payment-saldo-due"} `}
                  >
                    {Number(serviceOrder.paid) >= Number(serviceOrder.subtotal)
                      ? "Quitado"
                      : formattedPrice(
                          serviceOrder.subtotal - serviceOrder.paid,
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
                      id="editPaymentInput"
                      placeholder="0,00"
                      value={"" || payment}
                      onChange={(e) => {
                        handleFormFieldPaidChange(e.target.value);
                      }}
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
          {/* Status Card */}
          {/* <div className="status-card">
            <div className="status-card-header">
              <svg
                className="edit-order-update-status-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Atualizar Status
            </div>
            <div className="status-card-body">
              <div className="status-options" id="statusOptions">
                <div className="status-opt" data-status="pending">
                  <div className="status-opt-dot edit-order-status-opt-dot-pending"></div>
                  <span className="status-opt-label">Pendente</span>
                </div>
                <div className="status-opt" data-status="progress">
                  <div className="status-opt-dot edit-order-status-opt-dot-on-going"></div>
                  <span className="status-opt-label">Em andamento</span>
                </div>
                <div className="status-opt" data-status="done">
                  <div className="status-opt-dot edit-order-status-opt-dot-done"></div>
                  <span className="status-opt-label">Concluída</span>
                </div>
                <div className="status-opt" data-status="cancelled">
                  <div className="status-opt-dot edit-order-status-opt-dot-cancelled"></div>
                  <span className="status-opt-label">Cancelada</span>
                </div>
              </div>
              <div className="note-input-wrap">
                <textarea
                  className="note-textarea"
                  placeholder="Anotação sobre a mudança de status..."
                  rows={2}
                />
              </div>
              <button className="btn btn-primary edit-order-btn-apply-status">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Aplicar Status
              </button>
            </div>
          </div> */}

          {/* Resumo da OS */}
          {/* <div className="status-card">
            <div className="status-card-header">
              <svg
                className="edit-order-status-card-svg"
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
              Resumo da OS
            </div>
            <div className="status-card-body edit-order-status-card-body">
              <div className="info-row">
                <span className="info-row-label">Serviços</span>
                <span className="info-row-value">
                  {itemMaintenances.length}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Materiais</span>
                <span className="info-row-value">{itemMaterials.length}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Mão de obra</span>
                <span className="info-row-value">
                  R$ {calculateTotalMaintenanceJob().toFixed(2)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Peças</span>
                <span className="info-row-value">
                  R$ {calculateTotalMaterials().toFixed(2)}
                </span>
              </div>
              <div className="info-row total">
                <span className="info-row-label">Total</span>
                <span className="info-row-value">
                  R$ {calculateGrandTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div> */}

          {/* Histórico de Atividades */}
          {/* <div className="status-card">
            <div className="status-card-header">
              <svg
                className="edit-order-status-card-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Histórico de Atividades
            </div>
            <div className="status-card-body">
              <div className="activity-log">
                <div className="edit-order-activity-log">
                  Nenhuma atividade registrada.
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EditServiceOrder;
