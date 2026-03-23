const ModalNewGroup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div onClick={onClose} className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div
        onClick={handleContentClick}
        className="modal modal-new-group-container"
      >
        <div className="modal-header">
          <span className="modal-title">Novo Grupo de Serviços</span>
          <button onClick={onClose} className="sp-close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="field">
              <label>Nome do Grupo *</label>
              <input
                type="text"
                className="input"
                id="novoGrupoNome"
                placeholder="Ex: Suspensão, Motor, Freios..."
              />
              <div className="modal-new-group-context-undertext">
                O grupo ficará disponível para organizar itens no catálogo.
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Criar Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNewGroup;
