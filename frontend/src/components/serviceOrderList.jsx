import { useMemo, useState } from "react";
import { serviceOrderListDTO } from "../data/mockDataDTO";
import { priClass, statusClass } from "../data/mockData";

const ServiceOrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tabsData = [
    {
      id: "tab1",
      title: "Todas",
      status: "all",
    },
    {
      id: "tab2",
      title: "Pendentes",
      status: "pending",
    },
    {
      id: "tab3",
      title: "Em andamento",
      status: "progress",
    },
    {
      id: "tab4",
      title: "Concluídas",
      status: "done",
    },
  ];

  const statusList = ["all", ...new Set(tabsData.map((p) => p.status))];

  const handleFilteredCustomers = useMemo(() => {
    return serviceOrderListDTO.filter((customer) => {
      const matchesTab =
        activeTab === "all" || customer.serviceOrder.status === activeTab;

      const matchesSearch =
        searchTerm === "" ||
        customer.vehicle.licensePlate
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch && matchesTab;
    });
  }, [serviceOrderListDTO, activeTab, searchTerm]);

  return (
    <div className="page active" id="page-os">
      <div className="page-header">
        <div>
          <div className="ph-title">Ordens de Serviço</div>
          <div className="ph-sub">Gerencie e acompanhe todas as ordens</div>
        </div>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="chips" id="osChips">
          {tabsData.map((tab, index) => (
            <div
              key={index}
              className={`chip ${activeTab === tab.status ? "active" : ""}`}
              onClick={() => setActiveTab(tab.status)}
            >
              {tab.title}
            </div>
          ))}
        </div>
      </div>
      <div className="os-table-wrap">
        <table className="os-table">
          <thead>
            <tr>
              <th>Nº OS</th>
              <th>Cliente / Veículo</th>
              <th>Serviços</th>
              <th>Técnico</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Entrada</th>
            </tr>
          </thead>
          <tbody id="osTableBody"></tbody>
          {handleFilteredCustomers.length > 0 ? (
            handleFilteredCustomers.map((os) => (
              <tbody key={os.serviceOrder.id}>
                <tr>
                  <td>
                    <span className="td-id">{`#${os.serviceOrder.id}`}</span>
                  </td>
                  <td>
                    <div className="os-table-customer-name">
                      {os.customer ? os.customer.name : "—"}
                    </div>
                    <div className="os-table-vehicle-info">
                      {os.vehicle ? (
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {os.vehicle.licensePlate}
                          </span>
                          <span className="svc-tag car-tag-model">{`${os.vehicle.brand} ${os.vehicle.model}`}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td>
                    {os.maintenanceJob.map((job, index) => (
                      <span key={index} className="svc-tag">
                        {job.name}
                      </span>
                    ))}
                  </td>
                  <td className="os-table-professional-name">
                    {os.serviceOrder.professional}
                  </td>
                  <td>
                    <span
                      className={`badge ${priClass[os.serviceOrder.priority]}`}
                    >
                      {os.serviceOrder.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${statusClass[os.serviceOrder.status]}`}
                    >
                      {os.serviceOrder.status}
                    </span>
                  </td>
                  <td className="td-value">{os.serviceOrder.value}</td>
                  <td className="td-date">{os.serviceOrder.arrived_at}</td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody className="empty-row">
              <tr>
                <td colSpan="8">Nenhuma OS encontrada</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ServiceOrderList;
