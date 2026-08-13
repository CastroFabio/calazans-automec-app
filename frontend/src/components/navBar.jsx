import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalNewGroup from "./modalNewGroup";
import NewCustomerModal from "./NewCustomerModal.component";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const pathData = [
    {
      pathURL: "/",
      title: "Ordens de Serviço",
      btn: (
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
    {
      pathURL: "/customers",
      title: "Clientes",
      btn: (
        <button
          className="btn btn-primary"
          onClick={() => {
            openModal();
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
          Novo Cliente
        </button>
      ),
    },
    {
      pathURL: "/services",
      title: "Serviços",
      btn: null,
    },
    {
      pathURL: "/materials",
      title: "Materiais e Peças",
      btn: null,
    },
    {
      pathURL: "/new-customer",
      title: "Novo Cliente",
      btn: null,
    },
    {
      pathURL: "/new-service-order",
      title: "Nova Ordem de Serviço",
      btn: null,
    },
    {
      pathURL: "/new-vehicle",
      title: "Novo Veículo",
      btn: null,
    },
  ];

  const isActive = (path) => {
    const activePath = pathData.find((element) => element.pathURL === path);
    return activePath || pathData[0];
  };

  const activeItem = isActive(currentPath);

  return (
    <>
      <header className="topbar">
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
        <span className="page-title">{activeItem.title}</span>
        <div className="topbar-right">{activeItem.btn}</div>
        {isModalOpen && (
          <NewCustomerModal isOpen={isModalOpen} onClose={closeModal} />
        )}
      </header>
    </>
  );
};

export default NavBar;
