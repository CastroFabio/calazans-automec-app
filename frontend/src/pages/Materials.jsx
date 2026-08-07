import { useEffect, useState } from "react";
import { materialGroupApi } from "../api/materialGroups";

const Materials = () => {
  const [activeTab, setActiveTab] = useState({
    groupName: "",
    groupIndex: null,
  });
  const [editingItem, setEditingItem] = useState({
    group: null,
    index: null,
    value: "",
  });
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeGroup = activeTab
    ? materialsGroupData.find(
        (element) => element.group === activeTab.groupName,
      )
    : null;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await materialGroupApi.getAll();

      setMaterialsGroupData(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço");
      console.error("Erro ao buscar ordens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = (groupName, itemIndex, currentValue) => {
    setEditingItem({
      group: groupName,
      index: itemIndex,
      value: currentValue,
    });
  };

  const handleEditSave = async () => {
    handleEditSaveUpdate(editingItem, "material");
    setEditingItem({ group: null, index: null, value: "" });
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

  const handleRemoveItem = async (materialID) => {
    handleRemoveJobMaterial("material", materialID);
  };

  const handleAddItem = async (groupIndex, newItemName) => {
    const newItem = {
      name: newItemName,
      group_id: groupIndex,
    };
    handleAddJobMaterial(newItem, "material");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="ph-sub">
            Catálogo de materiais disponíveis na oficina
          </div>
        </div>
      </div>
      <div className="cad-layout">
        <div>
          <div className="cad-subtitle-group">Grupos</div>
          <div className="cad-groups" id="svcGroupList">
            {materialsGroupData.length > 0
              ? materialsGroupData.map((element, index) => (
                  <div key={index} className="cad-group-wrap">
                    <button
                      onClick={() =>
                        setActiveTab({
                          groupIndex: element.id,
                          groupName: element.group,
                        })
                      }
                      className={`cad-group-btn ${activeTab.groupName === element.group ? "active" : ""}`}
                    >
                      <span>{element.group}</span>
                      <div className="cad-group-container">
                        <span className="cad-group-count">
                          {element.materials.length}
                        </span>
                        <span className="cad-chevron">
                          <svg
                            className={`cad-chevron-symbol ${activeTab.groupName ? "transform:rotate(180deg)" : ""}`}
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
                {activeTab.groupName
                  ? activeTab.groupName
                  : "Selecione um grupo"}
              </span>
            </div>
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
      </div>
    </div>
  );
};

export default Materials;
