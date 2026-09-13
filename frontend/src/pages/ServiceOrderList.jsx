import { useEffect, useMemo, useState } from "react";
import { priClass, statusClass } from "../data/mockData";
import { formattedPrice } from "../utils/convertPrice";
import { formatLocalDateTimeStringISO } from "../utils/convertDateTime";
import { orderApi } from "../api/orders";
import { convertPriority, convertStatus } from "../utils/convertPriorityStatus";
import ServiceOrderDetailPanel from "../components/ServiceOrderDetailPanel.component";
import { useServiceOrders } from "../context/ServiceOrder.context";
import {
  statusMap,
  statusReverseMap,
  statusReverseMapBadge,
} from "../utils/statusMap";
import {
  paymentStatusMap,
  paymentStatusReverseMap,
  paymentStatusReverseMapBadge,
} from "../utils/paymentStatusMap";
import Loading from "./Loading";
import StatusBadge from "../components/StatusBadge.component";
import VehicleBadge from "../components/VehicleBadge.component";
import Pagination from "../components/Pagination.component";
import { getNumberValue } from "../utils/parseValue";

// ========== CONFIGURAÇÃO DAS TABS ==========
const TABS = [
  { id: 0, title: "Todas", status: null },
  { id: 1, title: statusReverseMap[1], status: statusMap["Pendente"] },
  { id: 2, title: statusReverseMap[2], status: statusMap["Em andamento"] },
  { id: 3, title: statusReverseMap[3], status: statusMap["Concluído"] },
  { id: 4, title: statusReverseMap[4], status: statusMap["Aberta"] },
  { id: 5, title: statusReverseMap[5], status: statusMap["Aguardando peças"] },
  { id: 6, title: statusReverseMap[6], status: statusMap["Cancelada"] },
  // { id: 7, title: statusReverseMap[7], status: statusMap["Pendente"] },
];

const ServiceOrderList = () => {
  // ========== CONTEXTO ==========
  const {
    serviceOrders,
    fetchServiceOrders,
    loading,
    error,
    setError,
    updateServiceOrder,
  } = useServiceOrders();

  // ========== ESTADOS LOCAIS ==========
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [serviceOrdersPerPage, setServiceOrdersPerPage] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    perPage: 5,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ========== FILTRAR ORDENS ==========
  /* const filteredOrders = useMemo(() => {
    return serviceOrdersPerPage.filter((order) => {
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
  }, [serviceOrdersPerPage, activeTab, searchTerm]); */

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
      let found = serviceOrdersPerPage.find((order) => order.id === orderId);

      if (found) {
        setSelectedServiceOrder(found);
      } else {
        // Se não encontrar, buscar no backend
        const { data } = await orderApi.getById(orderId);
        setSelectedServiceOrder(data);
      }
    } catch (err) {
      console.error("Erro ao buscar ordem:", err);
      const message =
        error.response?.data?.message || "Erro ao buscar clientes";
      setError(message);
    } finally {
      setLocalLoading(false);
    }
  };

  const fetchServiceOrdersPerPage = async (
    page = 1,
    limit = 5,
    search = "",
    status = null,
  ) => {
    try {
      const { data: result } = await orderApi.getAllPerPage({
        page,
        limit,
        search,
        status,
      });

      setServiceOrdersPerPage(result.data); //
      setPaginationMeta(result.meta); //
    } catch (err) {
      setError(err.message || "Erro ao carregar ordens de serviço."); //
      console.error("Erro ao buscar ordens:", err); //
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeTabConfig = TABS.find((tab) => tab.id === activeTab);
      const statusParam = activeTab === 0 ? null : activeTabConfig?.status;

      // Reseta para a página 1 e traz os dados novos filtrados do backend
      fetchServiceOrdersPerPage(
        1,
        paginationMeta.perPage,
        searchTerm,
        statusParam,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const getPagesArray = (currentPage, totalPages) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  // ========== RENDER ==========
  if (loading) return <Loading />;

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
            <button
              className="search-clear"
              onClick={() => {
                setSearchTerm("");
                const activeTabConfig = TABS.find(
                  (tab) => tab.id === activeTab,
                );
                fetchServiceOrdersPerPage(
                  1,
                  paginationMeta.perPage,
                  "",
                  activeTab === 0 ? null : activeTabConfig?.status,
                );
              }}
            >
              ×
            </button>
          )}
        </div>

        <div className="chips" id="osChips">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`chip ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id); // 1. Atualiza a aba ativa na interface

                const statusParam = tab.id === 0 ? null : tab.status; // 2. Pega o status diretamente da aba clicada

                // 3. Busca imediatamente na API resetando para a página 1
                fetchServiceOrdersPerPage(
                  1,
                  paginationMeta.perPage,
                  searchTerm,
                  statusParam,
                );
              }}
            >
              {tab.title}
              {tab.id === activeTab && (
                <span className="chip-count">
                  {" "}
                  ({paginationMeta.totalItems})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Pagination
        osPage={paginationMeta.currentPage}
        totalPages={paginationMeta.totalPages}
        totalItems={paginationMeta.totalItems}
        pagesArray={getPagesArray(
          paginationMeta.currentPage,
          paginationMeta.totalPages,
        )}
        onPageChange={(newPage) => {
          const activeTabConfig = TABS.find((tab) => tab.id === activeTab);
          fetchServiceOrdersPerPage(
            newPage,
            paginationMeta.perPage,
            searchTerm,
            activeTabConfig?.status,
          );
        }}
      />

      {/* TABELA */}
      <div className="os-table-wrap">
        <table className="os-table">
          <thead className="os-table-cabecalho">
            <tr>
              <th>Nº OS</th>
              <th>Cliente / Veículo</th>
              <th>Serviços</th>
              {/* <th>Técnico</th> */}
              <th>Status</th>
              <th>Status de Pagamento</th>
              <th>Valor</th>
              <th>Entrada</th>
              <th className="os-table-th-center">Pago?</th>
            </tr>
          </thead>
          <tbody>
            {serviceOrdersPerPage.length > 0 ? (
              serviceOrdersPerPage.map((order) => {
                const isPaid =
                  getNumberValue(order.paid) >= getNumberValue(order.subtotal);
                return (
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
                          <VehicleBadge vehicle={order.vehicle} />
                        ) : (
                          "—"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="os-services-tags">
                        {order.itemMaintenances &&
                        order.itemMaintenances.length > 0 ? (
                          order.itemMaintenances.slice(0, 2).map((item) => (
                            <span key={item.id} className="svc-tag">
                              {item.maintenancejob?.name || "Serviço"}
                            </span>
                          ))
                        ) : (
                          <span className="no-services">—</span>
                        )}
                        {order.itemMaintenances &&
                          order.itemMaintenances.length > 2 && (
                            <span className="svc-tag more-tag">
                              +{order.itemMaintenances.length - 2}
                            </span>
                          )}
                      </div>
                    </td>
                    {/*    <td className="os-table-professional-name">
                    {order.professional || "—"}
                  </td> */}
                    <td>
                      <StatusBadge
                        className="os-table-th-center"
                        reverseMapBadge={statusReverseMapBadge[order.status]}
                        reverseMap={statusReverseMap[order.status]}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        className="os-table-th-center"
                        reverseMapBadge={
                          paymentStatusReverseMapBadge[order.paymentStatus]
                        }
                        reverseMap={
                          paymentStatusReverseMap[order.paymentStatus]
                        }
                      />
                    </td>
                    <td className="td-value">
                      {formattedPrice(order.subtotal)}
                    </td>
                    <td className="td-date">
                      {formatLocalDateTimeStringISO(order.arrived_at)}
                    </td>
                    <td className="td-date">
                      <button
                        className={`${isPaid ? "btn btn-sm btn-ghost" : "btn btn-sm btn-primary"}`}
                        disabled={isPaid}
                        onClick={async (event) => {
                          event.stopPropagation(); // Evita abrir a sidebar ao clicar no botão

                          try {
                            const updatedValue = getNumberValue(order.subtotal);

                            // 1. Envia a atualização para a API
                            const { data } = await orderApi.update(order.id, {
                              paid: updatedValue,
                              paymentStatus:
                                paymentStatusMap["Pago Integralmente"],
                            });

                            // 2. Prepara o objeto atualizado (usa a resposta do servidor ou mescla localmente)
                            const updatedOrder = {
                              ...order,
                              paid: updatedValue,
                              paymentStatus:
                                paymentStatusMap["Pago Integralmente"],
                              ...(data || {}),
                            };

                            // 3. Atualiza o estado global no Contexto
                            updateServiceOrder(updatedOrder);

                            // 4. Se a ordem clicada estiver aberta no painel lateral, atualiza ela também
                            if (selectedServiceOrder?.id === order.id) {
                              setSelectedServiceOrder(updatedOrder);
                            }
                          } catch (err) {
                            console.error(
                              "Erro ao quitar pagamento da OS:",
                              err,
                            );
                            alert(
                              err.response?.data?.message ||
                                "Ocorreu um erro ao quitar o pagamento.",
                            );
                          }
                        }}
                      >
                        {isPaid ? "Quitado" : "Quitar"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="empty-row">
                <td colSpan="7">
                  <div className="empty-state">
                    {searchTerm
                      ? `Nenhuma ordem encontrada para ${searchTerm}`
                      : "Nenhuma ordem encontrada"}
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
