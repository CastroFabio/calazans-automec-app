const NewOrderInfo = ({ handleFormFieldChange, formData }) => {
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="fs-title">Informações da OS</span>
      </div>
      <div className="fs-body">
        <div className="form-grid g3">
          <div className="field">
            <label>Técnico Responsável</label>
            <select
              className="select"
              value={formData.technician}
              onChange={(e) =>
                handleFormFieldChange("technician", e.target.value)
              }
            >
              <option value="">Selecione...</option>
              <option value="Carlos Mendes">Carlos Mendes</option>
              <option value="Ana Lima">Ana Lima</option>
              <option value="Pedro Santos">Pedro Santos</option>
              <option value="Fernanda Costa">Fernanda Costa</option>
            </select>
          </div>
          <div className="field">
            <label>Prioridade</label>
            <select
              className="select"
              value={formData.priority}
              onChange={(e) =>
                handleFormFieldChange("priority", e.target.value)
              }
            >
              <option value="Normal">Normal</option>
              <option value="Baixa">Baixa</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
          <div className="field">
            <label>Status Inicial</label>
            <select
              className="select"
              value={formData.status}
              onChange={(e) => handleFormFieldChange("status", e.target.value)}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
            </select>
          </div>
          <div className="field col-full">
            <label>Diagnóstico / Problema *</label>
            <textarea
              className="textarea"
              placeholder="Descreva o problema relatado pelo cliente e o diagnóstico realizado..."
              value={formData.diagnosis}
              onChange={(e) =>
                handleFormFieldChange("diagnosis", e.target.value)
              }
            />
          </div>
          <div className="field col-full">
            <label>Observações Internas</label>
            <textarea
              className="textarea form-textarea-obs"
              placeholder="Notas internas da equipe..."
              value={formData.internalObservations}
              onChange={(e) =>
                handleFormFieldChange("internalObservations", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderInfo;
