import React, { createContext, useState, useContext, useEffect } from "react";
import { customerApi } from "../api/customers";

// Criar o Contexto
const CustomerContext = createContext();

// Provider do Contexto
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
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

  // Função para adicionar cliente (atualiza a lista)
  const addCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
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
