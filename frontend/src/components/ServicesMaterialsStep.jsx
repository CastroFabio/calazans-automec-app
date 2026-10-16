import { useEffect, useMemo, useState } from "react";
import CurrencyInput from "./CurrencyInput.component";
import { materialGroupApi } from "../api/materialGroups";
import AutoComplete from "./AutoComplete.component";
import WizardBtn from "./WizardBtn.component";
import AddMaterialInMaintenace from "./AddMaterialInMaintenace";
import { parseInputValue } from "../utils/parseValue";

const ServicesMaterialsStep = ({
  currentStep,
  setCurrentStep,
  formData,
  handleFormFieldChange,
  maintenanceJobsGroupData = [],
  listMaintenanceJobs,
  setListMaintenanceJobs,
  handleRemoveMaintenanceJob,
  handleAddMaintenanceJob,
}) => {
  const [editingJobId, setEditingJobId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [svcNome, setSvcNome] = useState("");
  const [svcObs, setSvcObs] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [isMaintenanceModalOpen, setMaintenanceIsModalOpen] = useState(false);

  const wzBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const wzNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleEditMaintenanceJob = (job) => {
    setEditingJobId(job.id);
    setSelectedService({
      id: job.maintenance_id || job.maintenance?.id,
      name: job.name,
    });
    setSvcNome(job.name);
    setSvcObs(job.description || "");

    // Recupera as peças do serviço garantindo o vínculo correto do ID
    const serviceMaterials = (job.materialsList || []).map((mat) => ({
      ...mat,
      itemMaintenance_id: job.id,
    }));

    setMaterialsList(serviceMaterials);
  };

  const flatMaintenanceJobs = useMemo(() => {
    if (!maintenanceJobsGroupData || maintenanceJobsGroupData.length === 0)
      return [];

    return maintenanceJobsGroupData.flatMap((group) =>
      group.maintenanceJobs.map((job) => ({
        ...job,
        groupName: group.group,
      })),
    );
  }, [maintenanceJobsGroupData]);

  const updatedServices = flatMaintenanceJobs.map((service) => ({
    ...service,
    disabled: listMaintenanceJobs.some(
      (job) => job.maintenance_id === service.id && job.id !== editingJobId,
    ),
  }));

  const handleFetchMaterialsGroup = async () => {
    const { data } = await materialGroupApi.getAll();
    setMaterialsGroupData(data);
  };

  useEffect(() => {
    const fetchMaterialGroup = async () => {
      await handleFetchMaterialsGroup();
    };

    fetchMaterialGroup();
  }, []);

  const closeMaintenanceModal = () => {
    setMaintenanceIsModalOpen(false);
  };

  const handleOpenMaintenanceModal = () => {
    setMaintenanceIsModalOpen(true);
  };

  const handleAddLocalMaterial = () => {
    const newMaterial = {
      id: Date.now() + Math.random(),
      itemMaintenance_id: editingJobId || null, // Garante o vínculo com o serviço que está sendo editado
      material_id: null,
      name: "",
      quantity: 1,
      value_unit: "",
      receipt: "",
      supplier: "",
    };
    setMaterialsList((prev) => [...prev, newMaterial]);
  };

  const findMaterialById = (id) => {
    if (!id) return null;
    for (const group of materialsGroupData) {
      const found = group.materials.find((item) => item.id === id);
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

  const handleLocalMaterialInputChange = (matId, field, value) => {
    setMaterialsList((prev) =>
      prev.map((item) => {
        if (item.id !== matId) return item;

        // Trata a alteração do checkbox de fornecedor cliente
        if (field === "isCustomerSupplier") {
          return {
            ...item,
            isCustomerSupplier: value,
            // Se for marcado como true, já zera os campos dependentes de uma vez só
            ...(value
              ? {
                  value_unit: 0,
                  supplier: "",
                  receipt: "",
                }
              : {}),
          };
        }

        if (field === "material_id") {
          if (!value) return { ...item, material_id: null, value_unit: "" };
          const found = findMaterialById(value);
          if (found) {
            return {
              ...item,
              material_id: found.id,
              name: found.name,
              value_unit: found.value_unit ?? "",
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

        return { ...item, [field]: value };
      }),
    );
  };

  const handleRegistrarServico = () => {
    if (!selectedService) {
      alert("Por favor, selecione um serviço!");
      return;
    }

    const formattedMaterials = materialsList.map((mat) => {
      const foundMat = findMaterialById(mat.material_id);
      return {
        ...mat,
        name: mat.name || foundMat?.name || "Peça",
        isCustomerSupplier: !!mat.isCustomerSupplier,
      };
    });

    const itemService = {
      service: {
        id: selectedService.id,
        name: selectedService.name,
      },
      description: svcObs,
      materialsList: formattedMaterials,
    };

    handleAddMaintenanceJob(itemService, editingJobId);

    // Limpa o formulário de edição
    setEditingJobId(null);
    setSvcNome("");
    setSelectedService(null);
    setSvcObs("");
    setMaterialsList([]);
  };

  const handleRemoveLocalMaterial = (matId) => {
    setMaterialsList((prev) => prev.filter((item) => item.id !== matId));
  };

  return (
    <div
      className="wz-panel"
      style={{
        display: `${currentStep === 1 ? "flex" : "none"}`,
      }}
    >
      <div className="wz-panel-inner" style={{ padding: 0 }}>
        <div className="wz-panel-title">Serviços e Materiais</div>
        <CurrencyInput
          value={formData.labor_cost}
          handleFormFieldChange={(e) =>
            handleFormFieldChange("labor_cost", e.target.value)
          }
          label={"Mão de obra"}
        />

        {(listMaintenanceJobs?.length || []) > 0 && (
          <SvcRegistradosList
            listMaintenanceJobs={listMaintenanceJobs}
            setListMaintenanceJobs={setListMaintenanceJobs}
            handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
            onEditMaintenanceJob={handleEditMaintenanceJob}
          />
        )}

        {/* <div
          id="svcEntryForm"
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div style={{ position: "relative" }} id="svcAcWrap">
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "var(--ink3)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Serviço *
              </label>
              <input
                type="text"
                className="input"
                id="svcNomeInput"
                placeholder="Digite o serviço..."
                autoComplete="off"
                onInput={(e) => svcAcFilter(e.currentTarget.value)}
                onKeyDown={(e) => svcAcKey(e)}
                onFocus={(e) => svcAcFilter(e.currentTarget.value)}
              />
              <div
                id="svcAcDropdown"
                style={{
                  display: "none",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "calc(100% + 3px)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-lg)",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 300,
                }}
              ></div>
            </div>

            <div>
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "var(--ink3)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Observações
              </label>
              <input
                type="text"
                className="input"
                id="svcObsInput"
                placeholder="Opcional..."
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "var(--ink3)",
                marginBottom: "6px",
              }}
            >
              Peças & Materiais
            </div>
            <div
              id="svcMatsList"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "6px",
              }}
            ></div>
            <button
              className="svc-add-mat-btn"
              onClick={() => addSvcMat("svcMatsList")}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar peça
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => registrarServico()}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registrar serviço
            </button>
          </div>
        </div> */}
        <div id="svcEntryForm" className="svc-entry-form">
          <div className="svc-grid-container">
            <AutoComplete
              label="Serviço *"
              placeholder="Digite o nome do serviço..."
              items={updatedServices}
              filterKey="name"
              value={svcNome}
              selectedItem={selectedService}
              onInputChange={(text) => setSvcNome(text)}
              onSelect={(service) => {
                setSvcNome(service.name);
                setSelectedService(service);
              }}
              onClear={() => {
                setSvcNome("");
                setSelectedService(null);
              }}
              renderOption={(service) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    opacity: service.disabled ? 0.5 : 1,
                  }}
                >
                  <div>
                    <div className="ac-option-name">{service.name}</div>
                    <div className="ac-option-sub">{service.groupName}</div>
                  </div>
                  {service.disabled && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--accent)",
                        fontWeight: "700",
                        marginLeft: "8px",
                      }}
                    >
                      Já adicionado
                    </span>
                  )}
                </div>
              )}
            />

            <div className="field">
              <label>Observações</label>
              <input
                type="text"
                className="input"
                placeholder="Opcional..."
                value={svcObs}
                onChange={(e) => setSvcObs(e.target.value)}
              />
            </div>
          </div>
          <WizardBtn
            label={"Novo serviço"}
            openModal={handleOpenMaintenanceModal}
          />

          <AddMaterialInMaintenace
            handleAddMaterial={handleAddLocalMaterial}
            materialsList={materialsList}
            handleMaterialInputChange={handleLocalMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveLocalMaterial}
            itemMaintenance_id={editingJobId}
            listMaintenanceJobs={listMaintenanceJobs}
            setMaterialsGroupData={setMaterialsGroupData}
          />

          <div className="svc-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRegistrarServico}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="svc-btn-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {editingJobId ? "Atualizar serviço" : "Registrar serviço"}
            </button>
          </div>
        </div>

        <div
          className="total-row"
          style={{
            margin: 0,
            borderTop: "1px solid var(--border)",
            borderRadius: 0,
          }}
        >
          <div className="total-item">
            Mão de obra: <strong id="moValue">R$ 0,00</strong>
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "var(--border)",
            }}
          ></div>
          <div className="total-item">
            Peças: <strong id="pecasValue">R$ 0,00</strong>
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "var(--border)",
            }}
          ></div>
          <div className="total-item">
            Total:{" "}
            <span className="grand-total" id="grandTotal">
              R$ 0,00
            </span>
          </div>
        </div>
      </div>
      <div className="wz-footer">
        <button className="btn btn-ghost" onClick={() => wzBack(1)}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>
        <button className="btn btn-primary" onClick={() => wzNext(1)}>
          Próximo — Detalhes
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServicesMaterialsStep;
