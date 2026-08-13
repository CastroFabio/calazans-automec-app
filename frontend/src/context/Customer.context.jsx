import React, { createContext, useState, useContext, useEffect } from "react";
import { customerApi } from "../api/customers";

// Criar o Contexto
const CustomerContext = createContext();

// Provider do Contexto
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar clientes
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await customerApi.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  const countAllCustomers = () => {
    return customers.length;
  };

  // Função para adicionar cliente (atualiza a lista)
  const addCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const removeCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerId),
    );
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
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
