import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalNewGroup from "./modalNewGroup";
import NewCustomerModal from "./NewCustomerModal.component";

// ========== CONFIGURAÇÃO DE ROTAS ==========
const ROUTES_CONFIG = {
  // Rotas exatas
  "/": {
    title: "Home",
    btn: null,
  },
  "/service-order": {
    title: "Ordens de Serviço",
    btn: (navigate) => (
      <button
        onClick={() => navigate("/new-service-order")}
        className="btn btn-primary"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nova OS
      </button>
    ),
  },
  "/customers": {
    title: "Clientes",
    btn: (navigate, openModal) => (
      <button className="btn btn-primary" onClick={openModal}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Novo Cliente
      </button>
    ),
  },
  "/services": {
    title: "Serviços",
    btn: null,
  },
  "/materials": {
    title: "Materiais e Peças",
    btn: null,
  },
  "/new-service-order": {
    title: "Nova Ordem de Serviço",
    btn: null,
  },

  // ========== ROTAS DINÂMICAS ==========
  "/customers/edit": {
    title: "Editar Cliente",
    btn: null,
    isDynamic: true,
    getTitle: (path) => {
      // Extrai o ID da URL: /customers/edit/123 → "Editar Cliente #123"
      const id = path.split("/").pop();
      return `Editar Cliente`;
    },
  },
  "/service-order/print": {
    title: "Imprimir Ordem de Serviço",
    btn: null,
    isDynamic: true,
    getTitle: (path) => {
      const id = path.split("/").pop();
      return `Imprimir Ordem de Serviço`;
    },
  },
  "/service-order/edit": {
    title: "Editar Ordem de Serviço",
    btn: null,
    isDynamic: true,
    getTitle: (path) => {
      const id = path.split("/").pop();
      return `Editar Cliente`;
    },
  },
};

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ========== FUNÇÃO PARA ENCONTRAR A ROTA ATIVA ==========
  const getActiveRoute = (path) => {
    // 1. Verifica rota exata
    if (ROUTES_CONFIG[path]) {
      return {
        ...ROUTES_CONFIG[path],
        path: path,
      };
    }

    // 2. Verifica rotas dinâmicas
    for (const [routePattern, config] of Object.entries(ROUTES_CONFIG)) {
      if (config.isDynamic && path.startsWith(routePattern)) {
        return {
          ...config,
          path: path,
          // Se tiver getTitle, usa para personalizar
          title: config.getTitle ? config.getTitle(path) : config.title,
        };
      }
    }

    // 3. Fallback: tenta encontrar por prefixo
    for (const [routePattern, config] of Object.entries(ROUTES_CONFIG)) {
      if (path.startsWith(routePattern) && routePattern !== "/") {
        return {
          ...config,
          path: path,
        };
      }
    }

    // 4. Rota padrão
    return {
      title: "Página não encontrada",
      btn: null,
      path: path,
    };
  };

  const activeRoute = useMemo(() => getActiveRoute(currentPath), [currentPath]);

  // ========== RENDER BOTÃO ==========
  const renderButton = () => {
    if (!activeRoute.btn) return null;

    // Se btn é uma função, chama com navigate e openModal
    if (typeof activeRoute.btn === "function") {
      return activeRoute.btn(navigate, openModal);
    }

    return activeRoute.btn;
  };

  return (
    <>
      <header className={`topbar `}>
        <button className="hamburger">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span
          className={`page-title ${activeRoute.title === "Home" ? "home" : ""}`}
        >
          {activeRoute.title}
        </span>

        <div className="topbar-right">{renderButton()}</div>

        {isModalOpen && (
          <NewCustomerModal isOpen={isModalOpen} onClose={closeModal} />
        )}
      </header>
    </>
  );
};

export default NavBar;
