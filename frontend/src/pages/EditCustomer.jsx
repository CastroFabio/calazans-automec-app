import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomers } from "../context/Customer.context";
import { customerApi } from "../api/customers";
import NewVehicleModal from "../components/NewVehicleModal.component";
import { vehicleApi } from "../api/vehicle";
import { statusReverseMap } from "../utils/statusMap";
import { formattedPrice } from "../utils/convertPrice";

const EditCustomer = () => {
  const [customer, setCustomer] = useState(null);
  const [originalCustomer, setOriginalCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editingVehicleData, setEditingVehicleData] = useState({
    license_plate: "",
    brand: "",
    model: "",
  });
  const [vehicleSaving, setVehicleSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getCustomerById,
    updateCustomer,
    updateVehicleFromCustomer,
    removeVehicleFromCustomer,
  } = useCustomers();

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);

        // Tenta buscar localmente primeiro
        let found = getCustomerById(Number(id));

        if (found) {
          setCustomer(found);
        } else {
          // Se não encontrar, busca no backend
          const { data } = await customerApi.getById(Number(id));

          setCustomer(data);
        }
      } catch (err) {
        console.error("Erro ao buscar cliente:", err);
        setError("Cliente não encontrado");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCustomer();
    }
  }, [id, getCustomerById]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer) return;

    // Validação básica
    if (!customer.name?.trim()) {
      setError("O nome é obrigatório");
      return;
    }

    if (!customer.cell?.trim()) {
      setError("O celular é obrigatório");
      return;
    }

    // ✅ Verificar se há veículo em edição
    if (editingVehicleId !== null) {
      setError("Salve ou cancele a edição do veículo primeiro");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Dados para enviar
      const updateData = {
        name: customer.name.trim(),
        cell: customer.cell.trim(),
        telephone: customer.telephone?.trim() || null,
        observation: customer.observation?.trim() || null,
      };

      // 2. Chamar API para atualizar
      const { data } = await customerApi.update(customer.id, updateData);

      // ✅ FAZER MERGE - manter veículos
      const mergedCustomer = {
        ...customer,
        ...data,
        vehicles: customer.vehicles || [],
        serviceOrders: customer.serviceOrders || [],
      };

      updateCustomer(mergedCustomer);
      setOriginalCustomer(JSON.parse(JSON.stringify(mergedCustomer)));
      setSuccess(true);

      // 5. Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate("/customers");
      }, 1500);
    } catch (err) {
      console.error("❌ Erro ao atualizar:", err);

      let errorMessage = "Erro ao atualizar cliente";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Cliente não encontrado";
        } else if (err.response.status === 409) {
          errorMessage = "Este celular já está em uso";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ========== INICIAR EDIÇÃO DE VEÍCULO ==========
  const startEditingVehicle = (vehicle) => {
    setIsEditing(true);
    setEditingVehicleId(vehicle.id);
    setEditingVehicleData({
      license_plate: vehicle.license_plate || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
    });
  };

  // ========== CANCELAR EDIÇÃO DE VEÍCULO ==========
  const cancelEditingVehicle = () => {
    setIsEditing(false);
    setEditingVehicleId(null);
    setEditingVehicleData({
      license_plate: "",
      brand: "",
      model: "",
    });
    setVehicleSaving(false);
  };

  // ========== SALVAR EDIÇÃO DE VEÍCULO ==========
  const handleSaveVehicle = async (vehicleId) => {
    // Validação
    if (!editingVehicleData.license_plate.trim()) {
      setError("A placa é obrigatória");
      return;
    }

    setVehicleSaving(true);
    setError(null);

    try {
      const updateData = {
        license_plate: editingVehicleData.license_plate.trim().toUpperCase(),
        brand: editingVehicleData.brand.trim() || null,
        model: editingVehicleData.model.trim() || null,
        customer_id: customer.id,
      };

      // 1. Chamar API
      const { data } = await vehicleApi.update(vehicleId, updateData);

      // 2. Atualizar contexto
      updateVehicleFromCustomer(customer.id, data);

      // 3. Atualizar cliente local
      setCustomer((prev) => ({
        ...prev,
        vehicles: prev.vehicles.map((v) => (v.id === vehicleId ? data : v)),
      }));

      // 4. Sair do modo de edição
      cancelEditingVehicle();
    } catch (err) {
      console.error("❌ Erro ao atualizar veículo:", err);

      let errorMessage = "Erro ao atualizar veículo";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Veículo não encontrado";
        } else if (err.response.status === 409) {
          errorMessage = "Esta placa já está em uso";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
    } finally {
      setVehicleSaving(false);
    }
  };

  // ========== REMOVER VEÍCULO ==========
  const handleRemoveVehicle = async (vehicleId) => {
    if (!window.confirm("Tem certeza que deseja remover este veículo?")) {
      return;
    }

    try {
      await vehicleApi.delete(vehicleId);
      removeVehicleFromCustomer(customer.id, vehicleId);

      setCustomer((prev) => ({
        ...prev,
        vehicles: prev.vehicles.filter((v) => v.id !== vehicleId),
      }));
    } catch (err) {
      console.error("❌ Erro ao remover veículo:", err);
      setError("Erro ao remover veículo");
    }
  };

  // ========== HANDLE CHANGE DO VEÍCULO EM EDIÇÃO ==========
  const handleVehicleChange = (field, value) => {
    setEditingVehicleData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  // HANDLES
  const handleFormFieldChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formattedServiceOrderTitle = (selectedServiceOrder) => {
    const maintenanceJobCount = selectedServiceOrder.itemMaintenances.length;
    if (maintenanceJobCount > 1)
      return (
        selectedServiceOrder.itemMaintenances[0].maintenancejob.name +
        " +" +
        (maintenanceJobCount - 1)
      );
    else if (maintenanceJobCount === 0)
      return "Ordem de Serviço #" + selectedServiceOrder.id;
    return selectedServiceOrder.itemMaintenances[0].maintenancejob.name;
  };

  if (loading) return <div>Carregando cliente...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!customer) return <div>Cliente não encontrado</div>;

  return (
    <div className="page" id="page-editar-cliente">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <a>Clientes</a>
            <span className="breadcrumb-sep">›</span>
            <span id="ecBreadcrumb">{customer.name}</span>
          </div>
          <div className="ph-title" id="ecTitle">
            {customer.name}
          </div>
        </div>
        <div className="topbar-right ec-client-topbar-right">
          <button
            type="button" // type="submit" se estiver dentro do form
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving || editingVehicleId !== null}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>

      <div className="edit-layout ec-client-container">
        <div className="ec-client-info">
          <div className="form-section">
            <div className="fs-header">Dados do Cliente</div>
            <div className="fs-body">
              <div className="form-grid g3">
                <div className="field col-full">
                  <label>Nome completo *</label>
                  <input
                    type="text"
                    className="input"
                    id="ecNome"
                    placeholder="Nome do cliente"
                    value={customer.name}
                    onChange={(e) =>
                      handleFormFieldChange("name", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Telefone</label>
                  <input
                    type="text"
                    className="input"
                    id="ecPhone"
                    placeholder="(11) 0000-0000"
                    value={customer.telephone}
                    onChange={(e) =>
                      handleFormFieldChange("telephone", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Celular</label>
                  <input
                    type="text"
                    className="input"
                    id="ecCel"
                    placeholder="(11) 00000-0000"
                    value={customer.cell}
                    onChange={(e) =>
                      handleFormFieldChange("cell", e.target.value)
                    }
                  />
                </div>
                <div className="field col-full">
                  <label>Observações</label>
                  <textarea
                    className="textarea"
                    id="ecObs"
                    placeholder="Notas sobre o cliente..."
                    value={customer.observation}
                    onChange={(e) =>
                      handleFormFieldChange("observation", e.target.value)
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="fs-header ec-client-fs-header">
              <span>Veículos ({customer.vehicles?.length || 0})</span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleOpenModal}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar veículo
              </button>
            </div>
            {customer.vehicles?.map((element, index) => {
              const isEditingThis = editingVehicleId === element.id;

              return (
                <div key={element.id} className="fs-body ec-client-fs-body">
                  <div
                    className={`ec-car-card ${isEditingThis ? "editing" : ""}`}
                  >
                    <div className="ec-car-card-header">
                      <div className="ec-car-num">{index + 1}</div>
                      <div className="ec-car-label">
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {element.license_plate}
                          </span>
                          <span className="svc-tag car-tag-model">
                            {element.brand} {element.model}
                          </span>
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-danger ec-car-btn"
                        onClick={() => {
                          handleRemoveVehicle(element.id);
                        }}
                      >
                        Remover
                      </button>
                    </div>

                    <div className="form-grid g3 ec-car-form-grid">
                      <div className="field">
                        <label>Placa *</label>
                        <input
                          type="text"
                          className="input ec-car-input"
                          placeholder="ABC-1234"
                          disabled={!isEditingThis || vehicleSaving}
                          value={
                            isEditingThis
                              ? editingVehicleData.license_plate
                              : element.license_plate
                          }
                          onChange={(e) =>
                            handleVehicleChange("license_plate", e.target.value)
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Marca</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Honda, Toyota..."
                          disabled={!isEditingThis || vehicleSaving}
                          value={
                            isEditingThis
                              ? editingVehicleData.brand
                              : element.brand || ""
                          }
                          onChange={(e) =>
                            handleVehicleChange("brand", e.target.value)
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Modelo</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Civic, Corolla..."
                          disabled={!isEditingThis || vehicleSaving}
                          value={
                            isEditingThis
                              ? editingVehicleData.model
                              : element.model || ""
                          }
                          onChange={(e) =>
                            handleVehicleChange("model", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Botões de ação do veículo */}
                    <div className="topbar-right ec-client-topbar-right">
                      {isEditingThis ? (
                        <>
                          <button
                            className="btn btn-ghost"
                            onClick={cancelEditingVehicle}
                            disabled={vehicleSaving}
                          >
                            Cancelar
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSaveVehicle(element.id)}
                            disabled={
                              vehicleSaving ||
                              !editingVehicleData.license_plate.trim()
                            }
                          >
                            {vehicleSaving ? (
                              "Salvando..."
                            ) : (
                              <>
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Salvar
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => startEditingVehicle(element)}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {(!customer.vehicles || customer.vehicles.length === 0) && (
              <div className="fs-body">
                <div className="empty-state">Nenhum veículo cadastrado</div>
              </div>
            )}
          </div>
        </div>

        <div className="edit-side">
          <div className="form-section ec-client-form-section">
            <div className="fs-header">Histórico de OS</div>
            <div
              className="fs-body ec-client-fs-body-os-summary"
              id="ecOSSummary"
            >
              {customer.serviceOrders?.map((element) => (
                <div
                  key={element.id}
                  className="os-mini-row ec-client-os-mini-row"
                >
                  <div className="ec-client-os-mini-row-container">
                    <div className="ec-client-os-mini-row-info">
                      <span className="os-mini-id">#{element.id}</span>
                      <span className="badge ec-client-os-badge">
                        {statusReverseMap[element.status]}
                      </span>
                    </div>
                    <div className="os-mini-svc">
                      {formattedServiceOrderTitle(element)}
                    </div>
                    <div className="ec-car-label">
                      <span className="car-tag-group">
                        <span className="svc-tag car-tag-placa">
                          {element.vehicle.license_plate}
                        </span>
                        <span className="svc-tag car-tag-model">
                          {element.vehicle.brand} {element.vehicle.model}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="os-mini-val">
                    {formattedPrice(element.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && customer && (
        <NewVehicleModal
          onClose={closeModal}
          isModalOpen={isModalOpen}
          selectedCustomer={customer}
        />
      )}
    </div>
  );
};

export default EditCustomer;
