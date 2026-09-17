import { useState } from "react";
import AutoComplete from "./AutoComplete.component";

const NewItemModal = ({
  closeModal,
  isModalOpen,
  createItem,
  items,
  title,
  placeholder,
  onError,
  buttonLabel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveItem = async () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    if (!selectedGroup) {
      setError("Escolha um grupo válido");
      return;
    }

    /* if (!formData.groupName.trim()) {
      setError("Nome do grupo é obrigatório.");
      return;
    } */

    const itemData = {
      name: formData.name.trim(),
      group_id: Number(selectedGroup.id),
    };

    try {
      setError(null);

      createItem(itemData.group_id, itemData.name);

      setFormData({
        name: "",
      });

      closeModal();
    } catch (err) {
      console.error("Erro ao salvar item:", err);

      let errorMessage = "Erro ao salvar item";
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Dados:", err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
    }
  };

  return (
    <div
      className={`modal-overlay ${isModalOpen ? "open" : ""}`}
      onClick={closeModal}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="sp-close" onClick={closeModal}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid modal-customer-form-grid">
            <AutoComplete
              label="Grupo"
              placeholder="Digite o grupo..."
              items={items}
              filterKey="group"
              value={inputValue}
              selectedItem={selectedGroup}
              onInputChange={(val) => setInputValue(val)}
              onSelect={(group) => {
                setInputValue(group.name);
                setSelectedGroup(group);
              }}
              onClear={() => {
                setSelectedGroup(null);
                setInputValue("");
              }}
            />
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                className="input"
                id="novoClienteTel"
                placeholder={placeholder}
                value={formData.name}
                onChange={(e) => {
                  handleFormFieldChange("name", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSaveItem}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {buttonLabel}
          </button>
        </div>
        <div className="customer-error-message-container">
          {error && <div className="login-error">{error}</div>}
        </div>
      </div>
      {onError && <div className="login-error">{onError}</div>}
    </div>
  );
};

export default NewItemModal;
