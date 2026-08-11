import { useEffect, useState } from "react";
import { materialGroupApi } from "../api/materialGroups";
import { materialApi } from "../api/materials";

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
  const [creatingGroupName, setCreatingGroupName] = useState("");
  const [materialsGroupData, setMaterialsGroupData] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const activeGroup = activeTab
    ? materialsGroupData.find(
        (element) => element.group === activeTab.groupName,
      )
    : null;

  // ========== BUSCAR DADOS ==========
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await materialGroupApi.getAll();

      setMaterialsGroupData(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar materiais");
      console.error("Erro ao buscar materiais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ========== CRIAR GRUPO ==========
  const handleClickCreatingGroup = async (e) => {
    e.preventDefault();

    // ✅ Usar creatingGroupName em vez de groupName
    if (!creatingGroupName.trim()) {
      setError("O nome do grupo é obrigatório");
      return;
    }

    setIsCreatingGroup(true); // ✅ Usar o estado correto
    setError(null);

    try {
      const response = await materialGroupApi.create({
        group: creatingGroupName.trim(),
      });

      console.log("✅ Grupo criado:", response.data);

      // ✅ Atualizar a lista de grupos
      setMaterialsGroupData((prevData) => [
        ...prevData,
        { ...response.data, materials: [] },
      ]);

      // ✅ Limpar o campo
      setCreatingGroupName("");

      // ✅ Fechar o input
      setIsCreatingGroup(false);

      // ✅ Opcional: Selecionar o novo grupo automaticamente
      setActiveTab({
        groupIndex: response.data.id,
        groupName: response.data.group,
      });
    } catch (error) {
      console.error("❌ Erro ao criar grupo:", error);
      const message = error.response?.data?.message || "Erro ao criar grupo";
      setError(message);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleCancelCreatingGroup = () => {
    setCreatingGroupName("");
    setIsCreatingGroup(false);
    setError(null);
  };

  const handleChangeCreatingGroup = (e) => {
    setCreatingGroupName(e.target.value);
    if (error) setError(null);
  };

  // ========== EDITAR ITEM ==========
  const handleEditClick = (groupName, itemIndex, currentValue) => {
    setEditingItem({
      group: groupName,
      index: itemIndex,
      value: currentValue,
    });
  };

  const handleEditSave = async (type) => {
    if (!editingItem.group || !editingItem.index) return;

    try {
      const { index: id, value: newName, group: groupName } = editingItem;

      await materialApi.update(id, { name: newName });

      setMaterialsGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.group === groupName) {
            return {
              ...group,
              materials: group.materials.map((element) => {
                if (element.id === id) {
                  return { ...element, name: newName };
                }
                return element;
              }),
            };
          }
          return group;
        });
      });

      setEditingItem({ group: null, index: null, value: "" });
    } catch (error) {
      console.error("Erro ao editar:", error);
      const message =
        error.response?.data?.message || "Erro ao adicionar materiais";
      setError(message);
    }
  };

  const handleEditSaveGroup = async () => {
    if (!editingItem.group || !editingItem.index) return;

    try {
      const { index: id, value: newName, group: groupName } = editingItem;

      await materialGroupApi.update(id, { group: newName });

      setMaterialsGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.id === id) {
            return {
              ...group,
              group: newName,
            };
          }
          return group;
        });
      });

      setActiveTab({ ...activeTab, groupName: newName });
      setEditingItem({ group: null, index: null, value: "" });
    } catch (error) {
      console.error("Erro ao editar:", error);
      const message =
        error.response?.data?.message || "Erro ao adicionar material";
      setError(message);
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

  const handleEditKeyPressGroup = (e) => {
    if (e.key === "Enter") {
      handleEditSaveGroup();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // ========== REMOVER ITEM ==========
  const handleRemoveItem = async (materialID) => {
    try {
      await materialApi.delete(materialID);

      // Remover localmente
      setMaterialsGroupData((prevData) => {
        return prevData.map((group) => {
          return {
            ...group,
            materials: group.materials.filter(
              (element) => element.id !== materialID,
            ),
          };
        });
      });
    } catch (error) {
      console.error("Erro ao remover:", error);
      const message = error.response?.data?.message || "Erro ao remover";
      setError(message);
    }
  };

  // ========== ADICIONAR ITEM ==========
  const handleAddItem = async (groupIndex, newItemName) => {
    if (!newItemName.trim()) return;

    setIsAdding(true);
    setError(null);

    try {
      const newItem = {
        name: newItemName.trim(),
        group_id: groupIndex,
      };

      const response = await materialApi.create(newItem);

      // Atualizar o estado localmente
      setMaterialsGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.id === groupIndex) {
            return {
              ...group,
              materials: [...group.materials, response.data],
            };
          }
          return group;
        });
      });

      // Limpar o campo
      setNewItemName("");
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      const message =
        error.response?.data?.message || "Erro ao adicionar material";
      setError(message);
    } finally {
      setIsAdding(false);
    }
  };

  // ========== REMOVER GRUPO ==========
  const handleRemoveItemGroup = async (groupID) => {
    try {
      // 1. Remover no backend
      await materialGroupApi.delete(groupID);

      // 2. Remover localmente
      setMaterialsGroupData((prevData) => {
        return prevData.filter((group) => group.id !== groupID);
      });

      // 3. Se o grupo removido era o grupo ativo, limpar a tab ativa
      if (activeTab.groupIndex === groupID) {
        setActiveTab({
          groupName: "",
          groupIndex: null,
        });
      }
    } catch (error) {
      console.error("Erro ao remover grupo:", error);
      const message = error.response?.data?.message || "Erro ao remover grupo";
      setError(message);
      alert(`Erro: ${message}`);
    }
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
          <div className=" flex">
            <div className="cad-subtitle-group ">Grupos</div>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreatingGroup(true)}
              disabled={isCreatingGroup}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          {isCreatingGroup && (
            <div
              className="cad-create-group-container"
              style={{ marginBottom: "8px" }}
            >
              <form onSubmit={handleClickCreatingGroup}>
                <input
                  type="text"
                  className="input cad-input cad-input-group-create"
                  value={creatingGroupName}
                  onChange={handleChangeCreatingGroup}
                  placeholder="Ex: Suspensão, Motor, Freios..."
                  autoFocus
                />
                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={!creatingGroupName.trim()}
                  >
                    Criar
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleCancelCreatingGroup}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
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
            {activeTab.groupName ? (
              <div className="cad-items-header ">
                <span className="cad-items-title " id="svcGroupTitle">
                  {editingItem.group === activeTab.groupName ? (
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
                    handleEditClick(
                      activeTab.groupName,
                      activeTab.groupIndex,
                      "",
                    )
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
      </div>
    </div>
  );
};

export default Materials;
