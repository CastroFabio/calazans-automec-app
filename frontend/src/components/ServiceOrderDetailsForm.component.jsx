import React from "react";
import FormSectionHeader from "./FormSectionHeader.component";
import ProfessionalSelect from "./ProfessionalSelect.component";
import { statusReverseMap } from "../utils/statusMap";

const ServiceOrderDetailsForm = ({
  title,
  subtitle,
  handleFormFieldChange,
  formDataProfessional,
  formDataStatus,
  handleStatusChange,
  formDataDiagnosis,
}) => {
  return (
    <div className="form-section">
      <FormSectionHeader title={title} icon={subtitle} />
      <div className="fs-body">
        <div className="form-grid g3">
          <ProfessionalSelect
            handleFormFieldChange={handleFormFieldChange}
            professional={formDataProfessional}
          />
          {/* <div className="field">
                <label>Prioridade</label>
                <select
                  className="select"
                  value={priorityReverseMap[formData.priority] || "Normal"} // ← Mostra texto
                  onChange={(e) => handlePriorityChange(e.target.value)} // ← Salva ID
                >
                  <option value="Normal">Normal</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div> */}

          <div className="field">
            <label>Status Inicial</label>
            <select
              className="select"
              value={statusReverseMap[formDataStatus] || "Pendente"} // ← Mostra texto
              onChange={handleStatusChange} // ← Salva ID
            >
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Aberta">Aberta</option>
              <option value="Aguardando peças">Aguardando peças</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div className="field col-full">
            <label>Diagnóstico / Problema</label>
            <textarea
              className="textarea"
              placeholder="Descreva o problema relatado pelo cliente e o diagnóstico realizado..."
              value={formDataDiagnosis}
              onChange={(e) =>
                handleFormFieldChange("diagnosis", e.target.value)
              }
            />
          </div>
          {/* <div className="field col-full">
                <label>Observações Internas</label>
                <textarea
                  className="textarea form-textarea-obs"
                  placeholder="Notas internas da equipe..."
                  value={formData.observation}
                  onChange={(e) =>
                    handleFormFieldChange("observation", e.target.value)
                  }
                />
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderDetailsForm;
