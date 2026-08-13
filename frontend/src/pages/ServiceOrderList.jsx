import { useEffect, useMemo, useState } from "react";
import { priClass, statusClass } from "../data/mockData";
import { formattedPrice } from "../utils/convertPrice";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { customerApi } from "../api/customers";
import { orderApi } from "../api/orders";
import { convertPriotity, convertStatus } from "../utils/convertPriorityStatus";

const ServiceOrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceOrderData, setServiceOrderData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const tabsData = [
    {
      id: 0,
      title: "Todas",
      status: "all",
    },
    {
      id: 1,
      title: "Pendentes",
      status: "pending",
    },
    {
      id: 2,
      title: "Em andamento",
      status: "progress",
    },
    {
      id: 3,
      title: "Concluídas",
      status: "done",
    },
    {
      id: 4,
      title: "Aberta",
      status: "done",
    },
    {
      id: 5,
      title: "Aguardando Peças",
      status: "done",
    },
    {
      id: 6,
      title: "Cancelada",
      status: "done",
    },
  ];

  const statusList = ["all", ...new Set(tabsData.map((p) => p.status))];

  const handleFilteredCustomers = useMemo(() => {
    return serviceOrderData.filter((element) => {
      const matchesTab = activeTab === 0 || element.status === activeTab;

      const matchesSearch =
        searchTerm === "" ||
        element.vehicle.license_plate
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch && matchesTab;
    });
  }, [serviceOrderData, activeTab, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await orderApi.getAll();
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setServiceOrderData(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço");
      console.error("Erro ao buscar ordens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loading">Carregando ordens...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="page active" id="page-os">
      <div className="page-header">
        <div>
          {/* <div className="ph-title">Ordens de Serviço</div> */}
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
              className={`chip ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
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
            handleFilteredCustomers.map((element) => (
              <tbody key={element.id}>
                <tr>
                  <td>
                    <span className="td-id">{`#${element.id}`}</span>
                  </td>
                  <td>
                    <div className="os-table-customer-name">
                      {element.customer ? element.customer.name : "—"}
                    </div>
                    <div className="os-table-vehicle-info">
                      {element.vehicle ? (
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {element.vehicle.license_plate}
                          </span>
                          <span className="svc-tag car-tag-model">{`${element.vehicle.brand} ${element.vehicle.model}`}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td>
                    {element.itemMaintenances.map((item) => (
                      <span key={item.id} className="svc-tag">
                        {item.maintenancejob.name}
                      </span>
                    ))}
                  </td>
                  <td className="os-table-professional-name">
                    {element.professional}
                  </td>
                  <td>
                    <span className={`badge ${priClass[element.priority]}`}>
                      {convertPriotity(element.priority)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[element.status]}`}>
                      {convertStatus(element.status)}
                    </span>
                  </td>
                  <td className="td-value">
                    {formattedPrice(element.subtotal)}
                  </td>
                  <td className="td-date">
                    {formatLocalDateTimeStringISO(element.arrived_at)}
                  </td>
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
