import React, { useState } from "react";

const NewOrderMaintenanceJob = ({
  listMaintenanceJobs,
  setListMaintenanceJobs,
  maintenanceJobsGroupData,
}) => {
  const handleAddMaintenanceJob = () => {
    const newMaintenanceJob = {
      id: Date.now(),
      maintenance_id: "",
      value_unit: "",
      description: "",
      name: "",
    };

    setListMaintenanceJobs([...listMaintenanceJobs, newMaintenanceJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    setListMaintenanceJobs(
      listMaintenanceJobs.filter((element) => element.id !== id),
    );
  };

  const handleMaintenanceJobChange = (id, field, value) => {
    setListMaintenanceJobs((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;

        if (field === "name") {
          let foundValue = ""; // ← default to empty string, NOT undefined

          for (const group of maintenanceJobsGroupData) {
            const found = group.maintenancejob.find(
              (item) => item.name === value,
            );

            if (found && found.value_unit !== undefined) {
              foundValue = formattedPrice(found.value_unit);
              break;
            }
          }

          return {
            ...job,
            name: value,
            value_unit: foundValue, // ← always a string
          };
        }

        // Ensure we never set undefined for any field
        const newValue = value === undefined || value === null ? "" : value;
        return { ...job, [field]: newValue };
      }),
    );
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
        <span className="fs-title">Serviços</span>
      </div>
      <div className="fs-body">
        <div className="services-list">
          {listMaintenanceJobs.length > 0
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
                        value={element.name}
                        onChange={(e) => {
                          handleMaintenanceJobChange(
                            element.id,
                            "name",
                            e.target.value,
                          );
                        }}
                      >
                        <option value="">Selecione o serviço...</option>
                        {maintenanceJobsGroupData.map((element, groupIndex) => (
                          <optgroup key={groupIndex} label={element.group}>
                            {element.maintenancejob.map((item, itemIndex) => (
                              <option key={itemIndex} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
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
                          value={element.value_unit}
                          onChange={(e) =>
                            handleMaintenanceJobChange(
                              element.id,
                              "value_unit",
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
                        value={element.description}
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
            : ""}
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
  );
};

export default NewOrderMaintenanceJob;
