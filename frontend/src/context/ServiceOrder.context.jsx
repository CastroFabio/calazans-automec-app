import { createContext, useContext, useEffect, useState } from "react";
import { orderApi } from "../api/orders";

const ServiceOrderContext = createContext();

export const ServiceOrderProvider = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [itemMaterials, setItemMaterials] = useState([]);
  const [itemMaintenances, setItemMaintenances] = useState([]);

  // ========== BUSCAR TODAS AS ORDENS ==========
  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await orderApi.getAll();
      setServiceOrders(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço.");
      console.error("Erro ao buscar ordens:", err);
    } finally {
      setLoading(false);
    }
  };

  const countAllServiceOrders = () => {
    return serviceOrders.length;
  };

  // ========== BUSCAR ORDEM POR ID (LOCAL) ==========
  const getServiceOrderById = (id) => {
    const serviceOrder = serviceOrders.find(
      (element) => Number(element.id) === Number(id),
    );

    if (!serviceOrder) {
      console.warn(
        `Ordem de serviço com ID ${id} não encontrada na lista local`,
      );
      return null;
    }

    return serviceOrder;
  };

  // ========== BUSCAR ORDEM POR ID (BACKEND) ==========
  const fetchServiceOrderById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Tenta encontrar na lista local
      const localServiceOrder = getServiceOrderById(Number(id));
      if (localServiceOrder) {
        return localServiceOrder;
      }

      // 2. Busca no backend
      const { data } = await orderApi.getById(Number(id));

      // 3. Atualiza a lista local
      setServiceOrders((prev) => {
        const exists = prev.some((element) => element.id === data.id);
        if (!exists) {
          return [...prev, data];
        }
        return prev.map((element) => (element.id === data.id ? data : element));
      });

      return data;
    } catch (err) {
      console.error(`❌ Erro ao buscar ordem ${id}:`, err);

      let errorMessage = "Erro ao buscar ordem de serviço";
      if (err.response?.status === 404) {
        errorMessage = "Ordem de serviço não encontrada";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = "Servidor não respondeu";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========== ADICIONAR ORDEM ==========
  const addServiceOrder = (newOrder) => {
    setServiceOrders((prev) => [newOrder, ...prev]);
  };

  // ========== ATUALIZAR ORDEM ==========
  const updateServiceOrder = (updatedOrder) => {
    setServiceOrders((prev) =>
      prev.map((order) => {
        if (order.id !== updatedOrder.id) return order;

        // Manter os arrays existentes se o updatedOrder não tiver
        const itemMaintenances =
          updatedOrder.itemMaintenances || order.itemMaintenances || [];
        const itemMaterials =
          updatedOrder.itemMaterials || order.itemMaterials || [];

        return {
          ...updatedOrder,
          itemMaintenances,
          itemMaterials,
          // Garantir que customer e vehicle existem
          customer: updatedOrder.customer || order.customer,
          vehicle: updatedOrder.vehicle || order.vehicle,
        };
      }),
    );
  };

  // ========== HANDLE INPUT ==========

  const handleMaintenanceJobChange = (
    id,
    field,
    value,
    maintenanceJobsGroupData = [],
  ) => {
    setListMaintenanceJobs((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        // Trata a troca do serviço no select
        if (field === "maintenance_id" || field === "name") {
          // Converte o valor do select para número se não for vazio
          const selectedId =
            value !== "" && value !== null ? Number(value) : null;

          let foundJob = null;
          let foundValue = "";

          if (selectedId !== null) {
            for (const group of maintenanceJobsGroupData) {
              const found = group.maintenanceJobs?.find(
                (item) => Number(item.id) === selectedId || item.name === value,
              );

              if (found) {
                foundJob = found;
                foundValue =
                  typeof found.value_unit === "string"
                    ? found.value_unit.replace(",", ".")
                    : String(found.value_unit ?? "");
                break;
              }
            }
          }

          return {
            ...element,
            maintenance_id: foundJob ? foundJob.id : selectedId,
            value_unit: foundJob ? foundValue : element.value_unit,
          };
        }

        // Se a alteração direta for no campo de valor da mão de obra
        if (field === "value_unit" && typeof value === "string") {
          return { ...element, [field]: value.replace(",", ".") };
        }

        return { ...element, [field]: value };
      }),
    );
  };

  const handleMaterialInputChange = (
    id,
    field,
    value,
    materialsGroupData = [],
  ) => {
    setMaterialsList((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        // Trata seleção pelo dropdown (espera id do material ou name)
        if (field === "material_id" || field === "name") {
          let foundMaterial = null;
          let foundValue = "";
          const numericId = Number(value);

          for (const group of materialsGroupData) {
            const found = group.materials?.find(
              (item) => item.id === numericId || item.name === value,
            );

            if (found) {
              foundMaterial = found;
              foundValue =
                typeof found.value_unit === "string"
                  ? found.value_unit.replace(",", ".")
                  : String(found.value_unit ?? "");
              break;
            }
          }

          return {
            ...element,
            material_id: foundMaterial ? foundMaterial.id : numericId || null,
            name: foundMaterial ? foundMaterial.name : value,
            value_unit: foundValue !== "" ? foundValue : element.value_unit,
          };
        }

        // Trata digitação direta do preço do material
        if (field === "value_unit" && typeof value === "string") {
          return { ...element, [field]: value.replace(",", ".") };
        }

        return { ...element, [field]: value };
      }),
    );
  };

  const handleEditMaintenanceJobChange = (id, field, value) => {
    setItemMaintenances((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;

        if (field === "maintenance_id") {
          if (!value) {
            return { ...job, maintenance_id: null, value_unit: "" };
          }
          const foundJob = findMaintenanceJobById(value);
          if (foundJob) {
            const rawValue = foundJob.value_unit ?? foundJob.value_unit ?? "";
            return {
              ...job,
              maintenance_id: foundJob.id,
              value_unit:
                typeof rawValue === "string" ? rawValue : String(rawValue),
            };
          }
        }

        return { ...job, [field]: value };
      }),
    );
  };

  const handleEditMaterialInputChange = (id, field, value) => {
    setItemMaterials((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        if (field === "material_id") {
          if (!value) {
            return { ...element, material_id: null, value_unit: "" };
          }
          const foundMat = findMaterialById(value);
          if (foundMat) {
            return {
              ...element,
              material_id: foundMat.id,
              name: foundMat.name,
              value_unit: foundMat.value_unit ?? foundMat.value_unit ?? "",
            };
          }
        }

        return { ...element, [field]: value };
      }),
    );
  };

  // ========== REMOVER ORDEM ==========
  const removeServiceOrder = (orderId) => {
    setServiceOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  // ========== LIMPAR ERRO ==========
  const clearError = () => setError(null);

  // ========== ADICIONAR / ATUALIZAR SERVIÇO DE MANUTENÇÃO ==========
  const handleAddMaintenanceJob = (itemService, customId = null) => {
    // Calcula o valor total incluindo os materiais/peças vinculados ao serviço
    const totalPrice = (itemService.materialsList || []).reduce(
      (acc, cur) =>
        parseFloat(cur.value_unit || 0) * parseFloat(cur.quantity || 0) + acc,
      0,
    );

    const updatedJob = {
      id: customId || Date.now(),
      maintenance_id: itemService.service?.id || itemService.maintenance_id,
      name: itemService.service?.name || itemService.name,
      description: itemService.description || "",
      materialsList: itemService.materialsList || [],
      totalPrice,
    };

    setListMaintenanceJobs((prev) => {
      // Se o customId existir na lista, atualiza o item (modo edição)
      const exists = prev.some((job) => job.id === customId);
      if (exists) {
        return prev.map((job) => (job.id === customId ? updatedJob : job));
      }
      // Caso contrário, adiciona o novo serviço à lista (modo criação)
      return [...prev, updatedJob];
    });
  };

  const transformBackendToUIJob = (rawJob, allMaterials = []) => {
    // 1. Identifica o nome do serviço no objeto do backend
    const jobName =
      rawJob.maintenancejob?.name || rawJob.maintenance?.name || "";

    // 2. Filtra os materiais associados especificamente a este serviço
    const linkedMaterials = allMaterials
      .filter((mat) => Number(mat.itemMaintenance_id) === Number(rawJob.id))
      .map((mat) => ({
        id: mat.id,
        created_at: mat.created_at,
        quantity: mat.quantity,
        value_unit: String(mat.value_unit ?? ""),
        serviceorder_id: mat.serviceorder_id,
        itemMaintenance_id: mat.itemMaintenance_id,
        material_id: mat.material_id,
        receipt: mat.receipt ?? null,
        supplier: mat.supplier ?? null,
        isCustomerSupplier: !!mat.isCustomerSupplier,
        material: mat.material || null,
        name: mat.material?.name || mat.name || "Peça",
      }));

    // 3. Calcula o subtotal das peças vinculadas ao serviço
    const totalPrice = linkedMaterials.reduce((sum, mat) => {
      if (mat.isCustomerSupplier) return sum;
      const qty = parseFloat(mat.quantity) || 0;
      const val = parseFloat(mat.value_unit) || 0;
      return sum + qty * val;
    }, 0);

    // 4. Retorna a nova estrutura desejada
    return {
      id: rawJob.id,
      maintenance_id: rawJob.maintenance_id,
      name: jobName,
      description: rawJob.description || "",
      materialsList: linkedMaterials,
      totalPrice: totalPrice,
      maintenance: {
        id: rawJob.maintenance_id,
        name: jobName,
      },
      isOpen: true,
    };
  };

  // ========== CARREGAR ORDENS AO INICIAR ==========
  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        setServiceOrders,
        loading,
        error,
        fetchServiceOrders,
        fetchServiceOrderById,
        getServiceOrderById,
        addServiceOrder,
        updateServiceOrder,
        removeServiceOrder,
        clearError,
        countAllServiceOrders,
        handleMaintenanceJobChange,
        setListMaintenanceJobs,
        listMaintenanceJobs,
        handleMaterialInputChange,
        setMaterialsList,
        materialsList,
        handleEditMaterialInputChange,
        handleEditMaintenanceJobChange,
        handleAddMaintenanceJob,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

// ========== HOOK PERSONALIZADO ==========
export const useServiceOrders = () => {
  const context = useContext(ServiceOrderContext);
  if (!context) {
    throw new Error(
      "useServiceOrders must be used within a ServiceOrderProvider",
    );
  }
  return context;
};
