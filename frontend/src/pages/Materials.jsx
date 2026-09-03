import { useEffect, useState } from "react";
import { materialGroupApi } from "../api/materialGroups";
import { materialApi } from "../api/materials";
import MaterialGroupList from "../components/MaterialGroupList.component";
import MaterialActiveGroupItemList from "../components/MaterialActiveGroupItemList.component";

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

      const updatedGroupList = (prevData) => {
        return [...prevData, { ...response.data, materials: [] }];
      };

      const sortedGroupList = updatedGroupList(materialsGroupData).sort(
        (a, b) => a.group.localeCompare(b.group),
      );
      setMaterialsGroupData(sortedGroupList);

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
        <MaterialGroupList
          setIsCreatingGroup={setIsCreatingGroup}
          isCreatingGroup={isCreatingGroup}
          handleClickCreatingGroup={handleClickCreatingGroup}
          creatingGroupName={creatingGroupName}
          handleChangeCreatingGroup={handleChangeCreatingGroup}
          handleCancelCreatingGroup={handleCancelCreatingGroup}
          materialsGroupData={materialsGroupData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        <MaterialActiveGroupItemList
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          activeTab={activeTab}
          activeGroup={activeGroup}
          newItemName={newItemName}
          setNewItemName={setNewItemName}
          handleEditSaveGroup={handleEditSaveGroup}
          handleEditSave={handleEditSave}
          handleEditKeyPress={handleEditKeyPress}
          handleEditKeyPressGroup={handleEditKeyPressGroup}
          handleEditClick={handleEditClick}
          handleRemoveItemGroup={handleRemoveItemGroup}
          handleRemoveItem={handleRemoveItem}
          handleAddItem={handleAddItem}
        />
      </div>
    </div>
  );
};

export default Materials;
