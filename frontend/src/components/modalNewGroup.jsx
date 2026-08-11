import { useState } from "react";
import { materialGroupApi } from "../api/materialGroups";

const ModalNewGroup = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("O nome do grupo é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await materialGroupApi.create({
        group: groupName.trim(),
      });

      setGroupName("");
      onClose();
    } catch (err) {
      console.error("Erro ao criar grupo:", err);

      // Extrair mensagem de erro
      const message = err.response.data.message || "Erro ao criar grupo";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setGroupName(e.target.value);
    if (error) setError(null);
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
                value={groupName}
                onChange={handleChange}
                placeholder="Ex: Suspensão, Motor, Freios..."
                disabled={loading}
                autoFocus
              />
              {error &&
                error.map((element, index) => (
                  <div
                    key={index}
                    className="error-message"
                    style={{ color: "red", marginTop: "8px" }}
                  >
                    ❌ {element}
                  </div>
                ))}
              <div className="modal-new-group-context-undertext">
                O grupo ficará disponível para organizar itens no catálogo.
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !groupName.trim()}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {loading ? "Criando..." : "Criar Grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNewGroup;
