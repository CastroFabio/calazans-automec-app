import { useState } from "react";
import { maintenanceJobsListDTO } from "../data/mockDataDTO";

const MaintenanceJobs = () => {
  const [activeTab, setActiveTab] = useState(null);

  const activeGroup = activeTab
    ? maintenanceJobsListDTO.find((job) => job.group === activeTab)
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          {/* <div className="ph-title">Serviços</div> */}
          <div className="ph-sub">
            Catálogo de serviços disponíveis na oficina
          </div>
        </div>
      </div>
      <div className="cad-layout">
        <div>
          <div className="cad-subtitle-group">Grupos</div>
          <div className="cad-groups" id="svcGroupList">
            {maintenanceJobsListDTO.length > 0
              ? maintenanceJobsListDTO.map((job, index) => (
                  <div key={index} className="cad-group-wrap">
                    <button
                      onClick={() => setActiveTab(job.group)}
                      className={`cad-group-btn ${activeTab === job.group ? "active" : ""}`}
                    >
                      <span>{job.group}</span>
                      <div className="cad-group-container">
                        <span className="cad-group-count">
                          {job.items.length}
                        </span>
                        <span className="cad-chevron">chevron</span>
                      </div>
                    </button>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="cad-items-outer">
          <div className="cad-items-wrap">
            <div className="cad-items-header">
              <span className="cad-items-title" id="svcGroupTitle">
                {activeTab ? activeTab : "Selecione um grupo"}
              </span>

              {/* <div className="search-box cad-search-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input type="text" placeholder="Filtrar serviços..." />
              </div> */}
            </div>
            {activeGroup && activeGroup.items.length > 0 ? (
              activeGroup.items.map((job, jobIdx) => (
                <div key={jobIdx} className="cad-item-row">
                  <div className="cad-item-name">{job}</div>
                  <div className="cad-item-actions">
                    <button className="btn btn-sm btn-ghost cad-btn-editar">
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger cad-btn-remover">
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div id="svcItemList">
                <div className="cad-empty">
                  {activeTab
                    ? "Nenhum serviço encontrado neste grupo"
                    : "Selecione um grupo à esquerda"}
                </div>
              </div>
            )}
            <div className="cad-add-form">
              <input
                type="text"
                className="input cad-input"
                id="svcNewItem"
                placeholder="Nome do novo serviço..."
              />
              <button className="btn btn-primary btn-sm">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceJobs;
