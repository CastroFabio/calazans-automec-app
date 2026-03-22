import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const pathData = [
    { pathURL: "/", title: "Ordens de Serviço" },
    { pathURL: "/customers", title: "Clientes" },
    { pathURL: "/services", title: "Serviços" },
    { pathURL: "/materials", title: "Materiais e Peças" },
  ];
  const isActive = (path) =>
    pathData.find((element) =>
      element.pathURL === path ? element.title : null,
    );

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
        <span className="page-title">{isActive(currentPath)}</span>
        <div className="topbar-right">
          <button className="btn btn-primary">
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
        </div>
      </header>
    </>
  );
};

export default NavBar;
