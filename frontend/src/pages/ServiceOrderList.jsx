import { useEffect, useMemo, useState } from "react";
import { priClass, statusClass } from "../data/mockData";
import { formattedPrice } from "../utils/convertPrice";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { orderApi } from "../api/orders";
import { convertPriority, convertStatus } from "../utils/convertPriorityStatus";
import ServiceOrderDetailPanel from "../components/ServiceOrderDetailPanel.component";
import { useServiceOrders } from "../context/ServiceOrder.context";

// ========== CONFIGURAÇÃO DAS TABS ==========
const TABS = [
  { id: 0, title: "Todas", status: null },
  { id: 1, title: "Pendentes", status: 1 },
  { id: 2, title: "Em andamento", status: 2 },
  { id: 3, title: "Concluídas", status: 3 },
  { id: 4, title: "Aberta", status: 4 },
  { id: 5, title: "Aguardando Peças", status: 5 },
  { id: 6, title: "Cancelada", status: 6 },
];

const ServiceOrderList = () => {
  // ========== CONTEXTO ==========
  const {
    serviceOrders,
    fetchServiceOrders,
    loading,
    error,
    updateServiceOrder,
  } = useServiceOrders();

  // ========== ESTADOS LOCAIS ==========
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // ========== CARREGAR DADOS AO INICIAR ==========
  useEffect(() => {
    fetchServiceOrders();
  }, []);

  // ========== FILTRAR ORDENS ==========
  const filteredOrders = useMemo(() => {
    return serviceOrders.filter((order) => {
      // Filtrar por status (tab)
      const activeTabConfig = TABS.find((tab) => tab.id === activeTab);
      const matchesTab =
        activeTab === 0 || order.status === activeTabConfig?.status;

      // Filtrar por busca (placa ou nome do cliente)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        order.vehicle?.license_plate?.toLowerCase().includes(searchLower) ||
        order.customer?.name?.toLowerCase().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [serviceOrders, activeTab, searchTerm]);

  // ========== HANDLERS ==========
  const handleCardClick = (order) => {
    setSelectedServiceOrder(order);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedServiceOrder(null);
  };

  const handleFetchSelectedServiceOrder = async (orderId) => {
    try {
      setLocalLoading(true);

      // Buscar no contexto primeiro
      let found = serviceOrders.find((order) => order.id === orderId);

      if (found) {
        setSelectedServiceOrder(found);
      } else {
        // Se não encontrar, buscar no backend
        const { data } = await orderApi.getById(orderId);
        setSelectedServiceOrder(data);
      }
    } catch (err) {
      console.error("Erro ao buscar ordem:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  // ========== RENDER ==========
  if (loading) {
    return <div className="loading">Carregando ordens...</div>;
  }

  if (error) {
    return <div className="error">❌ {error}</div>;
  }

  return (
    <div className="page active" id="page-os">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="ph-sub">Gerencie e acompanhe todas as ordens</div>
        </div>
      </div>

      {/* TOOLBAR */}
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
            placeholder="Buscar por placa ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>

        <div className="chips" id="osChips">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`chip ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {`${tab.title} (`}
              {tab.id !== 0 ? (
                <span className="chip-count">
                  {serviceOrders.filter((o) => o.status === tab.status).length}
                </span>
              ) : (
                <span className="chip-count">{serviceOrders.length}</span>
              )}
              {`)`}
            </div>
          ))}
        </div>
      </div>

      {/* TABELA */}
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
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => {
                    handleCardClick(order);
                    handleFetchSelectedServiceOrder(order.id);
                  }}
                  className="os-row"
                >
                  <td>
                    <span className="td-id">#{order.id}</span>
                  </td>
                  <td>
                    <div className="os-table-customer-name">
                      {order.customer?.name || "—"}
                    </div>
                    <div className="os-table-vehicle-info">
                      {order.vehicle ? (
                        <span className="car-tag-group">
                          <span className="svc-tag car-tag-placa">
                            {order.vehicle.license_plate}
                          </span>
                          <span className="svc-tag car-tag-model">
                            {order.vehicle.brand} {order.vehicle.model}
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="os-services-tags">
                      {order.itemMaintenances &&
                      order.itemMaintenances.length > 0 ? (
                        order.itemMaintenances.slice(0, 3).map((item) => (
                          <span key={item.id} className="svc-tag">
                            {item.maintenancejob?.name || "Serviço"}
                          </span>
                        ))
                      ) : (
                        <span className="no-services">—</span>
                      )}
                      {order.itemMaintenances &&
                        order.itemMaintenances.length > 3 && (
                          <span className="svc-tag more-tag">
                            +{order.itemMaintenances.length - 3}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="os-table-professional-name">
                    {order.professional || "—"}
                  </td>
                  <td>
                    <span
                      className={`badge ${priClass[order.priority] || "badge-default"}`}
                    >
                      {convertPriority(order.priority)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${statusClass[order.status] || "badge-default"}`}
                    >
                      {convertStatus(order.status)}
                    </span>
                  </td>
                  <td className="td-value">{formattedPrice(order.subtotal)}</td>
                  <td className="td-date">
                    {formatLocalDateTimeStringISO(order.arrived_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="8">
                  <div className="empty-state">
                    {searchTerm ? (
                      <>Nenhuma ordem encontrada para "{searchTerm}"</>
                    ) : (
                      <>
                        Nenhuma ordem de serviço{" "}
                        {activeTab > 0
                          ? TABS.find(
                              (t) => t.id === activeTab,
                            )?.title.toLowerCase()
                          : ""}{" "}
                        encontrada
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && selectedServiceOrder && (
        <ServiceOrderDetailPanel
          onClose={closeSidebar}
          sidebarOpen={sidebarOpen}
          selectedServiceOrder={selectedServiceOrder}
          onOrderUpdated={fetchServiceOrders} // ← Atualiza lista após edição
        />
      )}
    </div>
  );
};

export default ServiceOrderList;
