import React, { createContext, useState, useContext, useEffect } from "react";
import { customerApi } from "../api/customers";

// Criar o Contexto
const CustomerContext = createContext();

// Provider do Contexto
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [customerID, setCustomerID] = useState(null);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar clientes
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await customerApi.getAll();

      const dataWithColor = data.map((element) => ({
        ...element,
        color: getRandomNumberBackground(),
      }));

      setCustomers(dataWithColor);
    } catch (err) {
      setError(err.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  const countAllCustomers = () => {
    return customers.length;
  };

  const getRandomNumberBackground = () => {
    return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
  };

  // ========== ✅ BUSCAR CLIENTE POR ID NO BACKEND ==========
  const fetchCustomerById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro tenta encontrar na lista local
      const localCustomer = customers.find((c) => c.id === id);
      if (localCustomer) return localCustomer;

      // Se não encontrar, busca no backend
      const { data } = await customerApi.getById(id);

      // Atualiza a lista local com o cliente encontrado (opcional)
      setCustomers((prev) => {
        // Verifica se já existe na lista
        const exists = prev.some((c) => c.id === data.id);
        if (!exists) {
          return [...prev, data];
        }
        return prev.map((c) => (c.id === data.id ? data : c));
      });

      return data;
    } catch (err) {
      console.error(`Erro ao buscar cliente ${id}:`, err);

      let errorMessage = "Erro ao buscar cliente";
      if (err.response?.status === 404) {
        errorMessage = "Cliente não encontrado";
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

  // ========== ✅ BUSCAR CLIENTE POR ID ==========
  const getCustomerById = (id) => {
    // Buscar na lista de clientes
    const customer = customers.find((c) => c.id === id);

    if (!customer) {
      console.warn(`Cliente com ID ${id} não encontrado na lista local`);
      return null;
    }

    return customer;
  };

  const getCustomerByName = (name) => {
    // Buscar na lista de clientes
    const customer = customers.find((c) => c.name === name);

    if (!customer) {
      console.warn(`Cliente com nome ${name} não encontrado na lista local`);
      return null;
    }

    return customer;
  };

  const getFirstCustomer = () => {
    if (customers.length <= 0) {
      console.warn(`Nenhum cliente registrado`);
      return null;
    }

    return customers[0];
  };

  // ========== ✅ BUSCAR CLIENTE POR ID COM DETALHES ==========
  const getCustomerByIdWithDetails = (id) => {
    const customer = customers.find((c) => c.id === id);

    if (!customer) {
      console.warn(`Cliente com ID ${id} não encontrado na lista local`);
      return null;
    }

    // Retorna o cliente com estatísticas
    return {
      ...customer,
      totalVehicles: customer.vehicles?.length || 0,
      totalServiceOrders: customer.serviceOrders?.length || 0,
      totalValue:
        customer.serviceOrders?.reduce(
          (sum, order) => sum + (order.subtotal || 0),
          0,
        ) || 0,
    };
  };

  // Função para adicionar cliente (atualiza a lista)
  const addCustomer = (newCustomer) => {
    const newCustomerWithColor = {
      ...newCustomer,
      color: getRandomNumberBackground(),
      vehicles: [],
      serviceOrders: [],
    };
    setCustomers((prev) => [newCustomerWithColor, ...prev]);
  };

  const removeCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerId),
    );
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== updatedCustomer.id) return customer;

        // Se o backend não enviou veículos, mantém os que já existem
        const vehicles =
          updatedCustomer.vehicles?.length > 0
            ? updatedCustomer.vehicles
            : customer.vehicles || [];

        const serviceOrders =
          updatedCustomer.serviceOrders?.length > 0
            ? updatedCustomer.serviceOrders
            : customer.serviceOrders || [];

        return {
          ...customer, // Mantém tudo que já existia
          ...updatedCustomer, // Sobrescreve com os novos dados
          vehicles, // ✅ Mantém veículos
          serviceOrders, // ✅ Mantém ordens de serviço
          _count: {
            vehicles: vehicles.length,
            serviceOrders: serviceOrders.length,
          },
        };
      }),
    );
  };

  const addVehicleToCustomer = (customerId, newVehicle) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== customerId) return customer;

        // Atualizar o cliente com o novo veículo
        const updatedCustomer = {
          ...customer,
          vehicles: [...(customer.vehicles || []), newVehicle],
          _count: {
            ...customer._count,
            vehicles: (customer._count?.vehicles || 0) + 1,
          },
        };

        return updatedCustomer;
      }),
    );
  };

  const removeVehicleFromCustomer = (customerId, vehicleId) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== customerId) return customer;

        const updatedVehicles = (customer.vehicles || []).filter(
          (vehicle) => vehicle.id !== vehicleId,
        );

        return {
          ...customer,
          vehicles: updatedVehicles,
          _count: {
            ...customer._count,
            vehicles: updatedVehicles.length,
          },
        };
      }),
    );
  };

  const updateVehicleFromCustomer = (customerId, updatedVehicle) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== customerId) return customer;

        const updatedVehicles = (customer.vehicles || []).map((vehicle) =>
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle,
        );

        return {
          ...customer,
          vehicles: updatedVehicles,
          _count: {
            ...customer._count,
            vehicles: updatedVehicles.length,
          },
        };
      }),
    );
  };

  // Carregar clientes ao iniciar
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        loading,
        error,
        fetchCustomers,
        addCustomer,
        removeCustomer,
        updateCustomer,
        countAllCustomers,
        addVehicleToCustomer,
        removeVehicleFromCustomer,
        updateVehicleFromCustomer,
        fetchCustomerById,
        getCustomerByIdWithDetails,
        getCustomerById,
        getCustomerByName,
        getFirstCustomer,
        customerID,
        setCustomerID,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

// Hook para usar o contexto
export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};
