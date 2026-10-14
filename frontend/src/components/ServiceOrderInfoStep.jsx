const ServiceOrderInfoStep = () => {
  const wzBack = () => {};
  const wzNext = () => {};

  return (
    <div
      className="wz-panel"
      id="wzPanel2"
      style={
        {
          /*  display: "none"  */
        }
      }
    >
      <div className="wz-panel-inner">
        <div className="wz-panel-title">Detalhes da OS</div>
        <div className="form-grid g3">
          <div className="field">
            <label>Técnico Responsável</label>
            <select className="select" id="wzTecnico">
              <option value="">Selecione...</option>
              <option>Carlos Mendes</option>
              <option>Ana Lima</option>
              <option>Pedro Santos</option>
              <option>Fernanda Costa</option>
            </select>
          </div>
          <div className="field">
            <label>Status da OS</label>
            <select className="select" id="wzStatus">
              <option value="pending">Pendente</option>
              <option value="progress">Em andamento</option>
            </select>
          </div>
          <div className="field col-full">
            <label>Diagnóstico / Problema</label>
            <textarea
              className="textarea"
              id="wzDiagnostico"
              placeholder="Descreva o problema relatado pelo cliente e o diagnóstico..."
            ></textarea>
          </div>
          <div className="field col-full">
            <label>Observações internas</label>
            <textarea
              className="textarea"
              style={{ minHeight: "52px" }}
              id="wzObsInternas"
              placeholder="Notas internas da equipe..."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="wz-footer">
        <button className="btn btn-ghost" onClick={() => wzBack(2)}>
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
        <button className="btn btn-primary" onClick={() => wzNext(2)}>
          Próximo — Pagamento
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

export default ServiceOrderInfoStep;
