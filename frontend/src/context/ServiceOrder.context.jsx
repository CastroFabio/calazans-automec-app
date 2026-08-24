import { createContext, useContext, useEffect, useState } from "react";
import { orderApi } from "../api/orders";

const ServiceOrderContext = createContext();

export const ServiceOrderProvider = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);

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
    maintenanceJobsGroupData,
  ) => {
    setListMaintenanceJobs((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        // Se for o campo "name" (que na verdade é o select)
        if (field === "name") {
          let foundJob = null;
          let foundValue = "";

          // Procurar o serviço selecionado
          for (const group of maintenanceJobsGroupData) {
            const found = group.maintenanceJobs.find(
              (item) => item.name === value,
            );

            if (found) {
              foundJob = found;
              foundValue =
                typeof found.value_unity === "string"
                  ? found.value_unity.replace(",", ".")
                  : found.value_unity;
              break;
            }
          }

          return {
            ...element,
            maintenance_id: foundJob ? foundJob.id : null, // ✅ CAPTURA O ID
            value_unity: foundValue,
          };
        }

        // Se a alteração direta for no próprio campo value_unity
        if (field === "value_unity" && typeof value === "string") {
          return { ...element, [field]: value.replace(",", ".") };
        }

        return { ...element, [field]: value };
      }),
    );
  };

  const handleMaterialInputChange = (id, field, value, materialsGroupData) => {
    setMaterialsList((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        if (field === "name") {
          let foundJob = null;
          let foundValue = "";

          // Procurar o serviço selecionado
          for (const group of materialsGroupData) {
            const found = group.materials.find((item) => item.name === value);

            if (found) {
              foundJob = found;
              // Troca vírgula por ponto se o valor for string
              foundValue =
                typeof found.value_unity === "string"
                  ? found.value_unity.replace(",", ".")
                  : found.value_unity;
              break;
            }
          }

          return {
            ...element,
            name: value, // Atualiza o nome selecionado
            maintenance_id: foundJob ? foundJob.id : null,
            value_unity: foundValue,
          };
        }

        // Se a alteração direta for no próprio campo value_unity
        if (field === "value_unity" && typeof value === "string") {
          return { ...element, [field]: value.replace(",", ".") };
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
