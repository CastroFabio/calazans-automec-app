import { useEffect, useState } from "react";
import {
  customerListDTO,
  maintenanceJobsListDTO,
  materialsListDTO,
  serviceOrderListDTO,
} from "../data/mockDataDTO";
import SideBarList from "../components/sideBarList";
import { useLocation } from "react-router-dom";
import { handleFetchGroupData } from "../api/supabase";

const SideBar = () => {
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [materialGroupData, setMaterialGroupData] = useState([]);

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => (currentPath === path ? "active" : "");

  useEffect(() => {
    const fetchData = async () => {
      const maintenanceJobData = await handleFetchGroupData(
        "maintenancejob_group",
      );
      setMaintenanceJobsGroupData(maintenanceJobData);

      const materialData = await handleFetchGroupData("material_group");
      setMaterialGroupData(materialData);
    };

    fetchData();
  }, [maintenanceJobsGroupData]);

  const tabsData = {
    listagemCategory: "Listagem",
    cadastroCategory: "Cadastro",
    listagemData: [
      {
        id: "serviceOrdersTab",
        title: "Ordens de Serviço",
        navigateURL: "/",
        numberOf: serviceOrderListDTO.length,
        svgIcon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
      },
      {
        id: "customersTab",
        title: "Clientes",
        navigateURL: "/customers",
        numberOf: customerListDTO.length,
        svgIcon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
    casdastroData: [
      {
        id: "maintanenceJobsTab",
        title: "Serviços",
        navigateURL: "/services",
        numberOf: maintenanceJobsGroupData.length,
        svgIcon: (
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
      },
      {
        id: "materialsTab",
        title: "Materiais & Peças",
        navigateURL: "/materials",
        numberOf: materialGroupData.length,
        svgIcon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-wrap">
          <div className="logo-icon">
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
          </div>
          <div className="logo-text">
            MecânicaOS<small>Gestão de oficina</small>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <SideBarList
          categoryName={tabsData.listagemCategory}
          tabsDataCategory={tabsData.listagemData}
          isActive={isActive}
        />

        <SideBarList
          categoryName={tabsData.cadastroCategory}
          tabsDataCategory={tabsData.casdastroData}
          isActive={isActive}
        />
      </nav>

      <div className="sidebar-user">
        <div className="user-row">
          <div className="avatar">JC</div>
          <div>
            <div className="user-name">João Carlos</div>
            <div className="user-role">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
