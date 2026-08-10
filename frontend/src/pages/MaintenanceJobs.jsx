import { useEffect, useState } from "react";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { maintenanceJobApi } from "../api/maintenanceJobs";

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
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const activeGroup = activeTab
    ? maintenanceJobsGroupData.find(
        (element) => element.group === activeTab.groupName,
      )
    : null;

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await maintenanceGroupApi.getAll();

      setMaintenanceJobsGroupData(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço");
      console.error("Erro ao buscar ordens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleEditClick = (groupName, itemIndex, currentValue) => {
    setEditingItem({
      group: groupName,
      index: itemIndex,
      value: currentValue,
    });
  };

  const handleEditSave = async () => {
    if (!editingItem.group || !editingItem.index) return;

    try {
      const { index: id, value: newName, group: groupName } = editingItem;

      // Atualizar no backend
      await maintenanceJobApi.update(id, { name: newName });

      // Atualizar localmente
      setMaintenanceJobsGroupData((prevData) => {
        return prevData.map((group) => {
          if (group.group === groupName) {
            return {
              ...group,
              maintenanceJobs: group.maintenanceJobs.map((job) => {
                if (job.id === id) {
                  return { ...job, name: newName };
                }
                return job;
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
        error.response?.data?.message || "Erro ao adicionar serviço";
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

  const handleRemoveItem = async (maintenanceID) => {
    try {
      await maintenanceJobApi.delete(maintenanceID);

      // Remover localmente
      setMaintenanceJobsGroupData((prevData) => {
        return prevData.map((group) => {
          return {
            ...group,
            maintenanceJobs: group.maintenanceJobs.filter(
              (job) => job.id !== maintenanceID,
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

      // Atualizar o estado localmente
      setMaintenanceJobsGroupData((prevData) => {
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

      // Limpar o campo
      setNewItemName("");
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      const message =
        error.response?.data?.message || "Erro ao adicionar serviço";
      setError(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="ph-sub">
            Catálogo de serviços disponíveis na oficina
          </div>
        </div>
      </div>
      <div className="cad-layout">
        <div>
          <div className="cad-subtitle-group">Grupos</div>
          <div className="cad-groups" id="svcGroupList">
            {maintenanceJobsGroupData.length > 0
              ? maintenanceJobsGroupData.map((element, index) => (
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
                          {element.maintenanceJobs.length}
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
            {activeGroup && activeGroup.maintenanceJobs.length > 0 ? (
              activeGroup.maintenanceJobs.map((element) => (
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

export default MaintenanceJobs;
