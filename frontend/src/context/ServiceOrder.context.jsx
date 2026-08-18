/* import React, { createContext, useContext, useEffect, useState } from "react";
import { orderApi } from "../api/orders";

const ServiceOrderContext = createContext();

export const ServiceOrderProvider = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // BUSCAR ORDENS
  const fetchServiceOrders = async () => {
    try {
      const { data } = await orderApi.getAll();
      setServiceOrders(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço.");
    }
  };

  // ========== BUSCAR ORDEM POR ID (LOCAL) ==========

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
  const fetchServiceOrderById = async (id) => {
    try {
      setError(null);

      // Primeiro tenta encontrar na lista local
      const localServiceOrder = serviceOrders.find(
        (element) => element.id === id,
      );
      if (localServiceOrder) return localServiceOrder;

      const { data } = await orderApi.getById(id);

      setServiceOrders((prev) => {
        // Verifica se já existe na lista
        const exists = prev.some((element) => element.id === data.id);
        if (!exists) {
          return [...prev, data];
        }
        return prev.map((element) => (element.id === data.id ? data : element));
      });

      return data;
    } catch (err) {
      console.error(`Erro ao buscar Ordens de Serviço ${id}:`, err);

      let errorMessage = "Erro ao buscar Ordens de Serviço";
      if (err.response?.status === 404) {
        errorMessage = "Ordens de Serviço não encontrado";
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

  // Carregar clientes ao iniciar
  useEffect(() => {
    fetchServiceOrders();
  }, []);
  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        setServiceOrders,
        error,
        fetchServiceOrders,
        fetchServiceOrderById,
        getServiceOrderById,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

// Hook para usar o contexto
export const useServiceOrders = () => {
  const context = useContext(ServiceOrderContext);
  if (!context) {
    throw new Error(
      "useServiceOrders must be used within a ServiceOrerProvider",
    );
  }
  return context;
};
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { orderApi } from "../api/orders";

const ServiceOrderContext = createContext();

export const ServiceOrderProvider = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
