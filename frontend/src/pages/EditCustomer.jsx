import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomers } from "../context/Customer.context";
import { customerApi } from "../api/customers";

const EditCustomer = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cell: null,
    telephone: null,
    observation: "",
  });
  const [formDataVehicle, setFormDataVehicle] = useState([
    {
      license_plate: "",
      brand: "",
      model: "",
    },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();

  const { getCustomerById, updateCustomer } = useCustomers();

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);

        // Tenta buscar localmente primeiro
        let found = getCustomerById(Number(id));

        if (found) {
          setCustomer(found);
          setFormData(found);
          setFormDataVehicle(found.vehicles);
        } else {
          // Se não encontrar, busca no backend
          const { data } = await customerApi.getById(Number(id));

          setCustomer(data);
          setFormData(data);
          setFormDataVehicle(data.vehicles);
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

  // HANDLES
  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <button className="btn btn-ghost">Cancelar</button>
          <button className="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Salvar alterações
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
                    value={formData.name}
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
                    value={formData.telephone}
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
                    value={formData.cell}
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
                    value={formData.observation}
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
              <span>Veículos</span>
              <button className="btn btn-sm btn-secondary">
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
            {customer.vehicles.map((element, index) => (
              <div key={element.id} className="fs-body ec-client-fs-body">
                <div id="ecCarsList">
                  <div className="ec-car-card" id="ecCar-${car.id}">
                    <div className="ec-car-card-header">
                      <div className="ec-car-num">{index + 1}</div>
                      <div className="ec-car-label">
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {element.license_plate}
                          </span>
                          <span className="svc-tag car-tag-model">
                            {`${element.brand} ${element.model}`}
                          </span>
                        </span>
                      </div>
                      <button className="btn btn-sm btn-ghost ec-car-btn">
                        Remover
                      </button>
                    </div>
                    <div className="form-grid g3 ec-car-form-grid">
                      <div className="field">
                        <label>Placa *</label>
                        <input
                          type="text"
                          className="input ec-car-input"
                          value="${car.placa}"
                          id="ecPlaca-${car.id}"
                          placeholder="ABC-1234"
                          value={formDataVehicle[index].license_plate}
                          onChange={(e) =>
                            handleFormFieldChange(
                              "license_plate",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Marca *</label>
                        <input
                          type="text"
                          className="input"
                          value="${car.marca}"
                          id="ecMarca-${car.id}"
                          placeholder="Honda, Toyota..."
                          value={formDataVehicle[index].brand}
                          onChange={(e) =>
                            handleFormFieldChange("brand", e.target.value)
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Modelo *</label>
                        <input
                          type="text"
                          className="input"
                          value="${car.modelo}"
                          id="ecModelo-${car.id}"
                          placeholder="Civic, Corolla..."
                          value={formDataVehicle[index].model}
                          onChange={(e) =>
                            handleFormFieldChange("model", e.target.value)
                          }
                        />
                      </div>
                      {/* <div className="field">
                        <label>Ano</label>
                        <input
                          type="text"
                          className="input"
                          value="${car.ano}"
                          id="ecAno-${car.id}"
                          placeholder="2024"
                        />
                      </div>
                      <div className="field">
                        <label>Cor</label>
                        <input
                          type="text"
                          className="input"
                          value="${car.cor}"
                          id="ecCor-${car.id}"
                          placeholder="Prata, Preto..."
                        />
                      </div>
                      <div className="field">
                        <label>Km atual</label>
                        <input
                          type="text"
                          className="input"
                          value="${car.km}"
                          id="ecKm-${car.id}"
                          placeholder="0"
                        />
                      </div>
                      <div className="field col-full">
                        <label>Observações do veículo</label>
                        <textarea
                          className="textarea"
                          id="ecCarObs-${car.id}"
                          placeholder="GNV, blindado, etc..."
                        >
                          Observation
                        </textarea>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="edit-side">
          <div className="form-section ec-client-form-section">
            <div className="fs-header">Histórico de OS</div>
            <div
              className="fs-body ec-client-fs-body-os-summary"
              id="ecOSSummary"
            >
              <div className="os-mini-row ec-client-os-mini-row">
                <div className="ec-client-os-mini-row-container">
                  <div className="ec-client-os-mini-row-info">
                    <span className="os-mini-id">#$serviceOrderID</span>
                    <span className="badge ec-client-os-badge">status</span>
                  </div>
                  <div className="os-mini-svc">Manutenção + 1</div>
                  {/* {car
                    ? `<div style="margin-top:3px;"><span className="car-tag-group"><span className="svc-tag car-tag-placa">${car.placa}</span><span className="svc-tag car-tag-model">${car.marca} ${car.modelo}</span></span></div>`
                    : ""} */}
                </div>
                <div className="os-mini-val">Valor service order</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
