import React, { useState, useMemo } from "react";
import InputPriceValue from "./InputPriceValue";
import AddMaterialInMaintenace from "./AddMaterialInMaintenace";
import AutoComplete from "./AutoComplete.component"; // Importe o componente reutilizável
import SvcRegistradosList from "./SvcRegistradosList.component";
import { useServiceOrders } from "../context/ServiceOrder.context";

const NewOrderMaintenanceJob = ({
  formData,
  handleFormFieldChange,
  listMaintenanceJobs,
  handleRemoveMaintenanceJob,
  handleMaintenanceJobChange,
  findMaintenanceJobById,
  setListMaintenanceJobs,
  maintenanceJobsGroupData = [], // Dados dos grupos de serviços
  handleAddMaterial,
  handleMaterialInputChange,
  materialsGroupData,
  handleRemoveMaterial,
  findMaterialById,
  itemMaintenance_id,
  handleAddMaintenanceJob,
  calculateTotalMaintenanceJob,
  calculateTotalMaterials,
  calculateGrandTotal,
}) => {
  const [svcNome, setSvcNome] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [svcObs, setSvcObs] = useState("");

  const { setMaterialsList, materialsList } = useServiceOrders();

  // Transforma os dados agrupados (maintenanceJobsGroupData) em um array linear para o AutoComplete
  const flatMaintenanceJobs = useMemo(() => {
    if (!maintenanceJobsGroupData || maintenanceJobsGroupData.length === 0)
      return [];

    return maintenanceJobsGroupData.flatMap((group) =>
      group.maintenanceJobs.map((job) => ({
        ...job,
        groupName: group.group, // Mantém a referência do nome do grupo
      })),
    );
  }, [maintenanceJobsGroupData]);

  const handleRegistrarServico = () => {
    if (!selectedService) {
      alert("Por favor, selecione um serviço!");
      return;
    }

    const itemService = {
      service: selectedService,
      description: svcObs,
      materialsList,
    };

    handleAddMaintenanceJob(itemService);

    // Limpa os campos após registrar
    setSvcNome("");
    setSelectedService(null);
    setSvcObs("");
    setMaterialsList([]);
  };

  return (
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
        <span className="fs-title">Serviços & Materiais</span>
      </div>

      <div className="fs-body fs-body-new-service-order">
        <InputPriceValue
          labor_cost={formData.labor_cost}
          handleFormFieldChange={handleFormFieldChange}
        />
        {(listMaintenanceJobs?.length || []) > 0 ? (
          <SvcRegistradosList
            listMaintenanceJobs={listMaintenanceJobs}
            setListMaintenanceJobs={setListMaintenanceJobs}
            handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
          />
        ) : (
          ""
        )}

        <div id="svcEntryForm" className="svc-entry-form">
          <div className="svc-grid-container">
            {/* Componente AutoComplete para Serviços */}
            <AutoComplete
              label="Serviço *"
              placeholder="Digite o nome do serviço..."
              items={flatMaintenanceJobs}
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
                <>
                  <div className="ac-option-name">{service.name}</div>
                  <div className="ac-option-sub">{service.groupName}</div>
                </>
              )}
            />

            {/* Observações */}
            <div className="field">
              <label className="svc-label">Observações</label>
              <input
                type="text"
                className="input"
                id="svcObsInput"
                placeholder="Opcional..."
                value={svcObs}
                onChange={(e) => setSvcObs(e.target.value)}
              />
            </div>
          </div>

          {/* Peças */}
          <AddMaterialInMaintenace
            handleAddMaterial={() => handleAddMaterial(1)}
            materialsList={materialsList}
            handleMaterialInputChange={handleMaterialInputChange}
            materialsGroupData={materialsGroupData}
            handleRemoveMaterial={handleRemoveMaterial}
            findMaterialById={findMaterialById}
            itemMaintenance_id={1}
          />

          {/* Botão registrar */}
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
              Registrar serviço
            </button>
          </div>
        </div>

        {/* Totais */}
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
