import React from "react";

const MaterialActiveGroupItemList = ({
  editingItem,
  setEditingItem,
  activeTab,
  activeGroup,
  newItemName,
  setNewItemName,
  handleEditSaveGroup,
  handleEditSave,
  handleEditKeyPress,
  handleEditKeyPressGroup,
  handleEditClick,
  handleRemoveItemGroup,
  handleRemoveItem,
  handleAddItem,
}) => {
  return (
    <div className="cad-items-outer">
      <div className="cad-items-wrap">
        {activeTab.groupName ? (
          <div className="cad-items-header ">
            <span className="cad-items-title " id="svcGroupTitle">
              {editingItem.group === activeTab.groupName &&
              editingItem.index === activeTab.groupIndex ? (
                <input
                  type="text"
                  className="input cad-input cad-edit-input"
                  value={editingItem.value}
                  onChange={(e) => {
                    setEditingItem({
                      ...editingItem,
                      value: e.target.value,
                    });
                  }}
                  onBlur={handleEditSaveGroup}
                  onKeyDown={handleEditKeyPressGroup}
                  autoFocus
                />
              ) : (
                <div className="cad-item-name">{activeTab.groupName}</div>
              )}
            </span>
            <button
              className="btn btn-sm btn-ghost cad-btn-editar"
              onClick={() =>
                handleEditClick(activeTab.groupName, activeTab.groupIndex, "")
              }
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-danger cad-btn-remover"
              onClick={() => handleRemoveItemGroup(activeTab.groupIndex)}
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="cad-items-header ">
            <span className="cad-items-title " id="svcGroupTitle">
              Selecione um grupo
            </span>
          </div>
        )}
        {activeGroup && activeGroup.materials.length > 0 ? (
          activeGroup.materials.map((element) => (
            <div key={element.id} className="cad-item-row">
              {editingItem.group === activeTab.groupName &&
              editingItem.index === element.id ? (
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
                <div className="cad-item-name">{element.name}</div>
              )}
              <div className="cad-item-actions">
                <button
                  onClick={() =>
                    handleEditClick(
                      activeTab.groupName,
                      element.id,
                      element.name,
                    )
                  }
                  className="btn btn-sm btn-ghost cad-btn-editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoveItem(element.id)}
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
              {activeTab.groupName
                ? "Nenhum material encontrado neste grupo"
                : "Selecione um grupo à esquerda"}
            </div>
          </div>
        )}
        <div className="cad-add-form">
          <input
            type="text"
            className="input cad-input"
            id="svcNewItem"
            placeholder="Nome do novo material..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (activeTab.groupName && newItemName.trim()) {
                handleAddItem(activeTab.groupIndex, newItemName);
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
  );
};

export default MaterialActiveGroupItemList;
