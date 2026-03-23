import { useState } from "react";
import { materialsListDTO } from "../data/mockDataDTO";

const MaintenanceJobs = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [editingItem, setEditingItem] = useState({
    group: null,
    index: null,
    value: "",
  });
  const [materialsData, setMaterialsData] = useState(materialsListDTO);

  const activeGroup = activeTab
    ? materialsData.find((job) => job.group === activeTab)
    : null;

  const handleEditClick = (groupName, itemIndex, currentValue) => {
    setEditingItem({
      group: groupName,
      index: itemIndex,
      value: currentValue,
    });
  };

  const handleEditSave = () => {
    if (editingItem.group && editingItem.index !== null) {
      const updatedJobs = materialsData.map((group) => {
        if (group.group === editingItem.group) {
          const updatedItems = [...group.items];
          updatedItems[editingItem.index] = editingItem.value;
          return { ...group, items: updatedItems };
        }
        return group;
      });
      setMaterialsData(updatedJobs);
      setEditingItem({ group: null, index: null, value: "" });
    }
  };

  const handleEditCancel = () => {
    setEditingItem({ group: null, index: null, value: "" });
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleRemoveItem = (groupName, itemIndex) => {
    const updatedJobs = materialsData.map((category) => {
      if (category.group === groupName) {
        const updatedItems = category.items.filter(
          (_, idx) => idx !== itemIndex,
        );
        return { ...category, items: updatedItems };
      }
      return category;
    });
    setMaterialsData(updatedJobs);
  };

  const handleAddItem = (groupName, newItemName) => {
    if (newItemName && newItemName.trim()) {
      const updatedJobs = materialsData.map((category) => {
        if (category.group === groupName) {
          return {
            ...category,
            items: [...category.items, newItemName.trim()],
          };
        }
        return category;
      });
      setMaterialsData(updatedJobs);
    }
  };

  const [newItemName, setNewItemName] = useState("");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          {/* <div className="ph-title">Serviços</div> */}
          <div className="ph-sub">
            Catálogo de serviços disponíveis na oficina
          </div>
        </div>
      </div>
      <div className="cad-layout">
        <div>
          <div className="cad-subtitle-group">Grupos</div>
          <div className="cad-groups" id="svcGroupList">
            {materialsData.length > 0
              ? materialsData.map((job, index) => (
                  <div key={index} className="cad-group-wrap">
                    <button
                      onClick={() => setActiveTab(job.group)}
                      className={`cad-group-btn ${activeTab === job.group ? "active" : ""}`}
                    >
                      <span>{job.group}</span>
                      <div className="cad-group-container">
                        <span className="cad-group-count">
                          {job.items.length}
                        </span>
                        <span className="cad-chevron">
                          <svg
                            className={`cad-chevron-symbol ${activeTab ? "transform:rotate(180deg)" : ""}`}
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
                        </span>
                      </div>
                    </button>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="cad-items-outer">
          <div className="cad-items-wrap">
            <div className="cad-items-header">
              <span className="cad-items-title" id="svcGroupTitle">
                {activeTab ? activeTab : "Selecione um grupo"}
              </span>

              {/* Nao achei necessario filtrar os itens */}
              {/* <div className="search-box cad-search-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input type="text" placeholder="Filtrar serviços..." />
              </div> */}
            </div>
            {activeGroup && activeGroup.items.length > 0 ? (
              activeGroup.items.map((job, jobIdx) => (
                <div key={jobIdx} className="cad-item-row">
                  {editingItem.group === activeTab &&
                  editingItem.index === jobIdx ? (
                    <input
                      type="text"
                      className="input cad-input cad-edit-input"
                      value={editingItem.value}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          value: e.target.value,
                        })
                      }
                      onBlur={handleEditSave}
                      onKeyDown={handleEditKeyPress}
                      autoFocus
                    />
                  ) : (
                    <div className="cad-item-name">{job}</div>
                  )}
                  <div className="cad-item-actions">
                    <button
                      onClick={() => handleEditClick(activeTab, jobIdx, job)}
                      className="btn btn-sm btn-ghost cad-btn-editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoveItem(activeTab, jobIdx)}
                      className="btn btn-sm btn-danger cad-btn-remover"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div id="svcItemList">
                <div className="cad-empty">
                  {activeTab
                    ? "Nenhum serviço encontrado neste grupo"
                    : "Selecione um grupo à esquerda"}
                </div>
              </div>
            )}
            <div className="cad-add-form">
              <input
                type="text"
                className="input cad-input"
                id="svcNewItem"
                placeholder="Nome do novo serviço..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (activeTab && newItemName.trim()) {
                    handleAddItem(activeTab, newItemName);
                    setNewItemName("");
                  }
                }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceJobs;
