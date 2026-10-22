import { useEffect, useMemo, useRef, useState } from "react";
import CurrencyInput from "./CurrencyInput.component";
import { materialGroupApi } from "../api/materialGroups";
import AutoComplete from "./AutoComplete.component";
import WizardBtn from "./WizardBtn.component";
import AddMaterialInMaintenace from "./AddMaterialInMaintenace";
import { parseInputValue } from "../utils/parseValue";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { useServiceOrders } from "../context/ServiceOrder.context";

const ServicesMaterialsStep = ({
  currentStep,
  setCurrentStep,
  formData,
  handleFormFieldChange,
  listMaintenanceJobs,
  setListMaintenanceJobs,
  handleRemoveMaintenanceJob,
  handleAddMaintenanceJob,
  itemMaintenance_id,
}) => {
  const { handleMaterialInputChange } = useServiceOrders();

  const [editingJobId, setEditingJobId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [svcNome, setSvcNome] = useState("");
  const [svcObs, setSvcObs] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [isMaintenanceModalOpen, setMaintenanceIsModalOpen] = useState(false);
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);

  const materialRef = useRef({});

  const handleFetchGroupMaintenanceJobData = async () => {
    const { data } = await maintenanceGroupApi.getAll();

    setMaintenanceJobsGroupData(data);
  };

  useEffect(() => {
    const fetchGroupMaintenanceJob = () => {
      handleFetchGroupMaintenanceJobData;
    };

    fetchGroupMaintenanceJob();
  }, []);

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

  const serviceMaterials = itemMaintenance_id
    ? materialsList.filter(
        (item) =>
          Number(item.itemMaintenance_id) === Number(itemMaintenance_id),
      )
    : materialsList;

  const registeredMaterials = useMemo(() => {
    return listMaintenanceJobs.flatMap((job) => job.materialsList || []);
  }, [listMaintenanceJobs]);

  const flatMaterials = useMemo(() => {
    if (!materialsGroupData || materialsGroupData.length === 0) return [];

    return materialsGroupData.flatMap((group) =>
      group.materials.map((mat) => ({
        ...mat,
        groupName: group.group,
      })),
    );
  }, [materialsGroupData]);

  const updatedFlatMaterials = useMemo(() => {
    return flatMaterials.map((mat) => {
      const isAddedInCurrent = serviceMaterials.some(
        (item) => Number(item.material_id) === Number(mat.id),
      );

      const isAddedInRegistered = registeredMaterials.some(
        (item) => Number(item.material_id) === Number(mat.id),
      );

      return {
        ...mat,
        disabled: isAddedInCurrent || isAddedInRegistered,
      };
    });
  }, [flatMaterials, serviceMaterials, registeredMaterials]);

  const handleFocusOnValueUnit = (index) => {
    if (materialRef.current[index]) {
      materialRef.current[index].focus();
      materialRef.current[index].select();
    }
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

            {/* <div className="field">
              <label>Observações</label>
              <input
                type="text"
                className="input"
                placeholder="Opcional..."
                value={svcObs}
                onChange={(e) => setSvcObs(e.target.value)}
              />
            </div> */}
          </div>
          <WizardBtn
            label={"Novo serviço"}
            openModal={handleOpenMaintenanceModal}
          />

          {/* <AddMaterialInMaintenace
            handleAddMaterial={handleAddLocalMaterial}
            materialsList={materialsList}
            handleMaterialInputChange={handleLocalMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveLocalMaterial}
            itemMaintenance_id={editingJobId}
            listMaintenanceJobs={listMaintenanceJobs}
            setMaterialsGroupData={setMaterialsGroupData}
          /> */}

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
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "6px",
              }}
            >
              {
                /* serviceMaterials.length > 0 */ true
                  ? /* serviceMaterials */ [1].map((element, index) => {
                      // Encontra o item selecionado atualmente para o AutoComplete
                      const isClientSupplier = !!element.isCustomerSupplier;
                      const selectedMaterial = element.material_id
                        ? flatMaterials.find(
                            (m) => Number(m.id) === Number(element.material_id),
                          ) || { name: element.name }
                        : null;
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                          key={index}
                        >
                          <div className="mat-card">
                            <div
                              className="mat-card-row"
                              style={{ alignItems: "flex-start", gap: "6px" }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  position: "relative",
                                }}
                              >
                                <AutoComplete
                                  placeholder="Selecione..."
                                  items={updatedFlatMaterials} // Usa o array com a flag disabled
                                  filterKey="name"
                                  value={element.name || ""}
                                  selectedItem={selectedMaterial}
                                  onInputChange={(val) => {
                                    handleMaterialInputChange(
                                      element.id,
                                      "name",
                                      val,
                                      materialsGroupData,
                                    );
                                  }}
                                  onSelect={(foundMaterial) => {
                                    handleMaterialInputChange(
                                      element.id,
                                      "material_id",
                                      foundMaterial.id,
                                      materialsGroupData,
                                    );
                                    handleMaterialInputChange(
                                      element.id,
                                      "name",
                                      foundMaterial.name,
                                      materialsGroupData,
                                    );
                                    handleFocusOnValueUnit(element.id);
                                  }}
                                  onClear={() => {
                                    handleMaterialInputChange(
                                      element.id,
                                      "material_id",
                                      null,
                                      materialsGroupData,
                                    );
                                    handleMaterialInputChange(
                                      element.id,
                                      "name",
                                      "",
                                      materialsGroupData,
                                    );
                                  }}
                                  renderOption={(mat) => (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        opacity: mat.disabled ? 0.5 : 1,
                                      }}
                                    >
                                      <div>
                                        <div className="ac-option-name">
                                          {mat.name}
                                        </div>
                                        <div className="ac-option-sub">
                                          {mat.groupName}
                                        </div>
                                      </div>

                                      {mat.disabled && (
                                        <span
                                          style={{
                                            fontSize: "10px",
                                            color: "var(--accent)",
                                            fontWeight: "700",
                                            whiteSpace: "nowrap",
                                            marginLeft: "8px",
                                          }}
                                        >
                                          Já adicionado
                                        </span>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>

                              <div
                                className="mat-client-check"
                                title="Fornecido pelo cliente"
                              >
                                <input
                                  type="checkbox"
                                  className="mat-client-cb"
                                />
                                <label className="mat-client-label">
                                  Cliente
                                </label>
                              </div>

                              <input
                                type="number"
                                className="input mat-qty"
                                defaultValue="1"
                                min="1"
                                placeholder="Qtd"
                                style={{ width: "52px", flexShrink: 0 }}
                              />

                              <div
                                className="input-prefix mat-price-wrap"
                                style={{ width: "108px", flexShrink: 0 }}
                              >
                                <span>R$</span>
                                <input
                                  type="text"
                                  className="input mat-val"
                                  placeholder="0,00"
                                  ref={(el) =>
                                    (materialRef.current[element.id] = el)
                                  }
                                  value={element.value_unit ?? ""}
                                  onChange={(e) => {
                                    handleMaterialInputChange(
                                      element.id,
                                      "value_unit",
                                      e.target.value,
                                      materialsGroupData,
                                    );
                                  }}
                                />
                              </div>

                              <button
                                className="remove-btn"
                                style={{ flexShrink: 0, marginTop: "2px" }}
                              >
                                ×
                              </button>
                            </div>

                            <div
                              className="mat-card-row mat-supplier-row"
                              style={{ gap: "6px", alignItems: "center" }}
                            >
                              <input
                                type="text"
                                className="input mat-fornecedor"
                                placeholder="Fornecedor"
                                style={{ flex: 1, minWidth: 0 }}
                              />
                              <input
                                type="text"
                                className="input mat-recibo"
                                placeholder="Nº recibo"
                                style={{
                                  width: "120px",
                                  flexShrink: 0,
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                              />
                              <div
                                className="mat-total-badge"
                                style={{
                                  width: "84px",
                                  flexShrink: 0,
                                  textAlign: "right",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "var(--accent)",
                                  lineHeight: "38px",
                                }}
                              ></div>
                            </div>

                            <div
                              className="mat-card-actions"
                              style={{
                                padding: "2px 0 0",
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                className="mat-action-btn"
                                style={{ display: "none" }}
                              >
                                Aplicar fornecedor/recibo a todas as peças
                              </button>
                              <button
                                className="mat-action-btn mat-action-copy"
                                style={{ display: "none" }}
                              >
                                Copiar do anterior
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null
              }
              {/* <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                    <input
                      type="text"
                      className="input mat-nome"
                      placeholder="Peça ou material..."
                      autoComplete="off"
                    />
                    <div
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
                        maxHeight: "180px",
                        overflowY: "auto",
                        zIndex: 400,
                      }}
                    ></div>
                  </div> */}
            </div>
          </div>

          <button className="svc-add-mat-btn">
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
