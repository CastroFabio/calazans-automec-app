import React, { useState } from "react";
import InputPriceValue from "./InputPriceValue";
import AddMaterialInMaintenace from "./AddMaterialInMaintenace";

const NewOrderMaintenanceJob = ({
  formData,
  handleFormFieldChange,
  listMaintenanceJobs,
  handleRemoveMaintenanceJob,
  handleMaintenanceJobChange,
  findMaintenanceJobById,
  setListMaintenanceJobs,
  maintenanceJobsGroupData,
  handleAddMaterial,
  materialsList,
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
  const [svcObs, setSvcObs] = useState("");

  const handleAcFilter = (value) => {
    setSvcNome(value);
    // Insira a lógica de busca/filtro do autocomplete aqui
  };

  const handleAcKey = (event) => {
    // Insira a lógica de navegação do teclado aqui
  };

  const handleAddMat = () => {
    // Insira a lógica para adicionar nova peça/material aqui
  };

  const handleRegistrarServico = () => {
    // Insira a lógica para registrar o serviço aqui
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

        <div className="svc-card-container" style={{ display: "none" }}>
          <div className="svc-card">
            <div className="svc-card-header">
              <div className="svc-card-badge">1</div>
              <div className="svc-card-title">Nome do serviço</div>
              <span className={`svc-card-total ${1 > 0 ? "active" : ""}`}>
                {1 > 0 ? "R$ 1,00" : "—"}
              </span>
              <svg
                className="svc-chevron"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="svc-card-body">
              {"s.obs" && <div className="svc-card-obs">Observação</div>}

              <div className="svc-card-content">
                <div className="svc-card-grid">
                  {[{}] && [{}].length > 0 ? (
                    [].map((m, idx) => (
                      <div key={1} className="svc-item-row">
                        <span className="svc-item-name">Nome do serviço</span>
                        <span className="svc-item-qty-price">1x R$ 300,00</span>
                      </div>
                    ))
                  ) : (
                    <div className="svc-item-empty">Sem peças</div>
                  )}
                </div>
              </div>

              <div className="svc-card-actions">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => editarSvcRegistrado(i)}
                >
                  Editar
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeSvcRegistrado(i)}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="svcEntryForm" className="svc-entry-form">
          <div className="svc-grid-container">
            {/* Autocomplete de serviço */}
            <div id="svcAcWrap" className="svc-ac-wrap">
              <label className="svc-label">Serviço *</label>
              <input
                type="text"
                className="input"
                id="svcNomeInput"
                placeholder="Digite o serviço..."
                autoComplete="off"
                value={svcNome}
                onChange={(e) => handleAcFilter(e.target.value)}
                onKeyDown={handleAcKey}
                onFocus={(e) => handleAcFilter(e.target.value)}
              />
              <div id="svcAcDropdown" className="svc-ac-dropdown"></div>
            </div>

            {/* Observações */}
            <div>
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

          {/* {listMaintenanceJobs.length > 0
            ? listMaintenanceJobs.map((element, index) => (
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
                        onChange={(e) => {
                          const selectedId = e.target.value;

                          if (!selectedId) {
                            handleMaintenanceJobChange(
                              element.id,
                              "maintenance_id",
                              null,
                              maintenanceJobsGroupData,
                            );

                            return;
                          }

                          const foundJob = findMaintenanceJobById(
                            Number(selectedId),
                          );

                          if (foundJob) {
                            setListMaintenanceJobs((prev) =>
                              prev.map((job) => {
                                if (job.id !== element.id) return job;
                                return {
                                  ...job,
                                  maintenance_id: foundJob.id,
                                };
                              }),
                            );
                          }
                        }}
                      >
                        <option value="">Selecione o serviço...</option>
                        {maintenanceJobsGroupData.map((group, groupIndex) => (
                          <optgroup key={groupIndex} label={group.group}>
                            {group.maintenanceJobs.map((item, itemIndex) => {
                              const isSelected = listMaintenanceJobs.some(
                                (job) =>
                                  Number(job.maintenance_id) ===
                                  Number(item.id),
                              );
                              const isCurrentSelection =
                                Number(element.maintenance_id) ===
                                Number(item.id);

                              return (
                                <option
                                  key={itemIndex}
                                  value={item.id}
                                  disabled={isSelected && !isCurrentSelection}
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="field col-full">
                      <label>Observações</label>
                      <textarea
                        className="textarea service-row-textarea"
                        placeholder="Detalhes adicionais do serviço..."
                        value={element.description || ""}
                        onChange={(e) =>
                          handleMaintenanceJobChange(
                            element.id, // ID do item na lista
                            "description", // Campo a ser atualizado
                            e.target.value, // Novo valor
                            maintenanceJobsGroupData,
                          )
                        }
                      />
                    </div>
                  </div>
                  <AddMaterialInMaintenace
                    handleAddMaterial={() => handleAddMaterial(element.id)}
                    materialsList={materialsList}
                    handleMaterialInputChange={handleMaterialInputChange}
                    materialsGroupData={materialsGroupData}
                    handleRemoveMaterial={handleRemoveMaterial}
                    findMaterialById={findMaterialById}
                    itemMaintenance_id={element.id}
                  />
                </div>
              ))
            : ""} */}
          {/* <button className="add-row-btn" onClick={handleAddMaintenanceJob}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar serviço
        </button> */}
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
    </div>
  );
};

export default NewOrderMaintenanceJob;
