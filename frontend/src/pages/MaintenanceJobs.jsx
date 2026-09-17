import { useEffect, useState } from "react";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { maintenanceJobApi } from "../api/maintenanceJobs";
import MaintenanceGroupList from "../components/MaintenanceGroupList.component";
import MaintenanceActiveGroupItemList from "../components/MaintenanceActiveGroupItemList.component";
import ActiveGroupItemList from "../components/ActiveGroupItemList.component";
import ItemGroupList from "../components/ItemGroupList.component";
import ItemGroupHeader from "../components/ItemGroupHeader.component";

const MaintenanceJobs = () => {
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
  const [maintenanceGroupData, setMaintenanceGroupData] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const activeGroup = activeTab
    ? maintenanceGroupData.find(
        (element) => element.group === activeTab.groupName,
      )
    : null;

  // ========== BUSCAR DADOS ==========
  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await maintenanceGroupApi.getAll();

      setMaintenanceGroupData(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar materiais");
      console.error("Erro ao buscar materiais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // ========== CRIAR GRUPO ==========
  const handleClickCreatingGroup = async (e) => {
    e.preventDefault();

    if (!creatingGroupName.trim()) {
      setError("O nome do grupo é obrigatório");
      return;
    }

    setIsCreatingGroup(true);
    setError(null);

    try {
      const response = await maintenanceGroupApi.create({
        group: creatingGroupName.trim(),
      });

      const updatedGroupList = (prevData) => {
        return [...prevData, { ...response.data, maintenanceJobs: [] }];
      };

      const sortedGroupList = updatedGroupList(maintenanceGroupData).sort(
        (a, b) => a.group.localeCompare(b.group),
      );
      setMaintenanceGroupData(sortedGroupList);

      setCreatingGroupName("");

      setIsCreatingGroup(false);

      setActiveTab({
        groupIndex: response.data.id,
        groupName: response.data.group,
      });
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
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

      await maintenanceJobApi.update(id, { name: newName });

      setMaintenanceGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.group === groupName) {
            return {
              ...group,
              maintenanceJobs: group.maintenanceJobs.map((element) => {
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

      await maintenanceGroupApi.update(id, { group: newName });

      setMaintenanceGroupData((prevData) => {
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
        error.response?.data?.message ||
        "Erro ao adicionar serviço de manutenção";
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
  const handleRemoveItem = async (maintenanceID) => {
    try {
      await maintenanceJobApi.delete(maintenanceID);

      setMaintenanceGroupData((prevData) => {
        return prevData.map((group) => {
          return {
            ...group,
            maintenanceJobs: group.maintenanceJobs.filter(
              (element) => element.id !== maintenanceID,
            ),
          };
        });
      });
    } catch (error) {
      console.error("Erro ao remover:", error);
      const message =
        error.response?.data?.message ||
        "Erro ao remover serviço de manutenção";
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

      const response = await maintenanceJobApi.create(newItem);

      setMaintenanceGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.id === groupIndex) {
            return {
              ...group,
              maintenanceJobs: [...group.maintenanceJobs, response.data],
            };
          }
          return group;
        });
      });

      setNewItemName("");
    } catch (error) {
      console.error("Erro ao adicionar serviço de manutenção:", error);
      const message =
        error.response?.data?.message ||
        "Erro ao adicionar serviço de manutenção";
      setError(message);
    } finally {
      setIsAdding(false);
    }
  };

  // ========== REMOVER GRUPO ==========
  const handleRemoveItemGroup = async (groupID) => {
    try {
      await maintenanceGroupApi.delete(groupID);

      setMaintenanceGroupData((prevData) => {
        return prevData.filter((group) => group.id !== groupID);
      });

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

  // ========== DEIXAR GRUPO UNIFORME ==========

  return (
    <div className="page">
      <ItemGroupHeader category={"manutenção"} />
      <div className="cad-layout">
        <ItemGroupList
          setIsCreatingGroup={setIsCreatingGroup}
          isCreatingGroup={isCreatingGroup}
          handleClickCreatingGroup={handleClickCreatingGroup}
          creatingGroupName={creatingGroupName}
          handleChangeCreatingGroup={handleChangeCreatingGroup}
          handleCancelCreatingGroup={handleCancelCreatingGroup}
          itemGroupData={maintenanceGroupData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        <ActiveGroupItemList
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

export default MaintenanceJobs;
