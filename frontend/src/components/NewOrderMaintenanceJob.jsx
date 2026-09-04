import React, { useState, useMemo } from "react";
import InputPriceValue from "./InputPriceValue";
import AddMaterialInMaintenace from "./AddMaterialInMaintenace";
import AutoComplete from "./AutoComplete.component";
import SvcRegistradosList from "./SvcRegistradosList.component";
import { useServiceOrders } from "../context/ServiceOrder.context";
import WizardBtn from "./WizardBtn.component";

const NewOrderMaintenanceJob = ({
  formData,
  handleFormFieldChange,
  listMaintenanceJobs,
  handleRemoveMaintenanceJob,
  setListMaintenanceJobs,
  maintenanceJobsGroupData = [],
  materialsGroupData,
  findMaterialById,
  handleAddMaintenanceJob,
  calculateTotalMaintenanceJob,
  calculateTotalMaterials,
  calculateGrandTotal,
  openMaintenanceModal,
  openMaterialModal,
}) => {
  const [svcNome, setSvcNome] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [svcObs, setSvcObs] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);

  const { setMaterialsList, materialsList } = useServiceOrders();

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

  // Função para adicionar pecas temporárias ao serviço em criação
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

  const handleRemoveLocalMaterial = (matId) => {
    setMaterialsList((prev) => prev.filter((item) => item.id !== matId));
  };

  const handleLocalMaterialInputChange = (matId, field, value) => {
    setMaterialsList((prev) =>
      prev.map((item) => {
        if (item.id !== matId) return item;

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
        return { ...item, [field]: value };
      }),
    );
  };

  // Função para carregar os dados do card para o formulário de edição
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

  const updatedServices = flatMaintenanceJobs.map((service) => ({
    ...service,
    disabled: listMaintenanceJobs.some(
      (job) => job.maintenance_id === service.id && job.id !== editingJobId,
    ),
  }));

  return (
    <div className="form-section">
      <div className="fs-header">
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="fs-title">Serviços & Materiais</span>
      </div>

      <div className="fs-body fs-body-new-service-order">
        <InputPriceValue
          labor_cost={formData.labor_cost}
          handleFormFieldChange={handleFormFieldChange}
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
          {true && (
            <WizardBtn
              label={"Novo serviço"}
              openModal={openMaintenanceModal}
            />
          )}

          <AddMaterialInMaintenace
            handleAddMaterial={handleAddLocalMaterial}
            materialsList={materialsList}
            handleMaterialInputChange={handleLocalMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveLocalMaterial}
            findMaterialById={findMaterialById}
            itemMaintenance_id={editingJobId}
            listMaintenanceJobs={listMaintenanceJobs}
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

        <div className="total-row">
          <div className="total-item">
            Mão de obra:
            <strong>R$ {calculateTotalMaintenanceJob().toFixed(2)}</strong>
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
  );
};

export default NewOrderMaintenanceJob;
