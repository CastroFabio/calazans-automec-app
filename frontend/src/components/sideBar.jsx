import { useEffect, useMemo, useState } from "react";

import SideBarList from "../components/sideBarList";

import { customerApi } from "../api/customers";
import { orderApi } from "../api/orders";
import { maintenanceGroupApi } from "../api/maintenanceGroups";
import { materialGroupApi } from "../api/materialGroups";
import { useCustomers } from "../context/Customer.context";

import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useServiceOrders } from "../context/ServiceOrder.context";

const ICONS = {
  orders: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  customers: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  newOrder: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  services: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  materials: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  edit: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  logo: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { countAllCustomers } = useCustomers();
  const { countAllServiceOrders } = useServiceOrders();

  // Estados
  const [counts, setCounts] = useState({
    materials: 0,
    maintenanceJobs: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Função para verificar se rota está ativa (suporta rotas dinâmicas)
  const isActive = (path) => {
    if (path.includes(":id")) {
      // Para rotas dinâmicas como "/customer/edit/:id"
      const basePath = path.split("/:")[0];
      return currentPath.startsWith(basePath);
    }
    return currentPath === path;
  };

  // Buscar contagens
  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orders, materials, maintenance] = await Promise.all([
        orderApi.getTotal(),
        materialGroupApi.getTotal(),
        maintenanceGroupApi.getTotal(),
      ]);

      setCounts({
        materials: materials.data,
        maintenanceJobs: maintenance.data,
      });
    } catch (err) {
      setError(err.message || "Erro ao carregar dados");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // Configuração das tabs (useMemo para evitar recriação desnecessária)
  const tabsConfig = useMemo(
    () => ({
      listagem: {
        category: "Listagem",
        items: [
          {
            id: "serviceOrdersTab",
            title: "Ordens de Serviço",
            path: "/service-order",
            count: countAllServiceOrders(),
            icon: ICONS.orders,
          },
          {
            id: "customersTab",
            title: "Clientes",
            path: "/customers",
            count: countAllCustomers(),
            icon: ICONS.customers,
          },
        ],
      },
      operacoes: {
        category: "Operações",
        items: [
          {
            id: "newServiceOrderTab",
            title: "Nova Ordem de Serviço",
            path: "/new-service-order",
            count: null,
            icon: ICONS.newOrder,
          },
          // ✅ ROTA DINÂMICA - Será ativada quando estiver em /customer/edit/:id
          {
            id: "editCustomerTab",
            title: "Editar Cliente",
            path: "/customer/edit/:id", // ← Rota dinâmica
            count: null,
            icon: ICONS.edit,
            hidden: true,
          },
        ],
      },
      inventario: {
        category: "Inventário",
        items: [
          {
            id: "maintenanceJobsTab",
            title: "Serviços",
            path: "/services",
            count: counts.maintenanceJobs,
            icon: ICONS.services,
          },
          {
            id: "materialsTab",
            title: "Materiais & Peças",
            path: "/materials",
            count: counts.materials,
            icon: ICONS.materials,
          },
        ],
      },
    }),
    [counts, countAllCustomers, countAllServiceOrders],
  );

  // Filtrar itens ocultos (se houver)
  const getVisibleItems = (items) => items.filter((item) => !item.hidden);

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate("/")}>
        <div className="logo-wrap">
          <div className="logo-icon">{ICONS.logo}</div>
          <div className="logo-text">
            Calazans<span className="home-greeting-accent"> Auto</span>mec
            <small>Gestão de oficina</small>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        <SideBarList
          categoryName={tabsConfig.listagem.category}
          tabsDataCategory={getVisibleItems(tabsConfig.listagem.items)}
          isActive={isActive}
        />

        <SideBarList
          categoryName={tabsConfig.operacoes.category}
          tabsDataCategory={getVisibleItems(tabsConfig.operacoes.items)}
          isActive={isActive}
        />

        <SideBarList
          categoryName={tabsConfig.inventario.category}
          tabsDataCategory={getVisibleItems(tabsConfig.inventario.items)}
          isActive={isActive}
        />
      </nav>

      {/* Usuário */}
      <div className="sidebar-user">
        <div className="user-row">
          <div className="avatar">JC</div>
          <div>
            <div className="user-name">João Calazans</div>
            <div className="user-role">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
