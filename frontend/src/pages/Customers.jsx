import { useEffect, useMemo, useState } from "react";
import { customerListDTO } from "../data/mockDataDTO";
import { customerApi } from "../api/customers";
import CustomerDetailPanel from "../components/CustomerDetailPanel.component";
import { useCustomers } from "../context/Customer.context";
import NewVehicleModal from "../components/NewVehicleModal.component";
import { useNavigate } from "react-router-dom";
import VehicleBadge from "../components/VehicleBadge.component";
import { formatarCelular } from "../utils/convertCel";

const Customers = () => {
  const [itemColors, setItemColors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerModal, setSelectedCustomerModal] = useState(null);

  const { customers, removeCustomer } = useCustomers();

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return customers.filter((element) => {
      if (element.name.toLowerCase().includes(lowerCaseSearch)) {
        return true;
      }

      const vehicleMatch = element.vehicles.some((car) =>
        car.license_plate.toLowerCase().includes(lowerCaseSearch),
      );

      return vehicleMatch;
    });
  }, [customers, searchTerm]);

  const getCustomerNameInitials = (customerName) => {
    return customerName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFetchSelectedCustomer = async (customerID) => {
    const { data } = await customerApi.getById(customerID);

    setSelectedCustomer(data);
  };

  const handleOpenModal = (event, customer) => {
    if (event) event.stopPropagation();

    // ✅ Verificar se o cliente existe
    if (!customer) {
      alert("Selecione um cliente primeiro");
      return;
    }

    // ✅ Definir o cliente selecionado e abrir o modal
    setSelectedCustomerModal(customer);
    setIsModalOpen(true);
  };

  const handleRemoveCustomer = async (customerID, event) => {
    event.stopPropagation(); // Impede abrir o sidebar

    if (!window.confirm("Tem certeza que deseja remover este cliente?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Remover no backend
      await customerApi.delete(customerID);

      // 2. Remover da lista local (usando o contexto)
      removeCustomer(customerID);

      // 3. Se o cliente removido estava selecionado, fechar sidebar
      if (selectedCustomer?.id === customerID) {
        setSidebarOpen(false);
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      const message =
        error.response?.data?.message || "Erro ao remover cliente";
      setError(message);
      alert(`Erro: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomerClick = async (customerID) => {
    navigate(`/customers/edit/${customerID}`);
  };

  if (loading) return <div>Carregando clientes...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="page" id="page-clientes">
      <div className="page-header">
        <div>
          {/* <div className="ph-title">Clientes</div> */}
          <div className="ph-sub">Cadastro de clientes e seus veículos</div>
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
            placeholder="Buscar por placa..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="clients-grid" id="clientsGrid">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((element) => (
            <div
              className="client-card"
              key={element.id}
              onClick={() => {
                handleCardClick();
                handleFetchSelectedCustomer(element.id);
              }}
            >
              <button
                className="sp-close "
                onClick={(e) => handleRemoveCustomer(element.id, e)}
              >
                ×
              </button>
              <div className="client-card-header">
                <div className="client-avatar-lg bg-orange-50">
                  {getCustomerNameInitials(element.name)}
                </div>
                <div>
                  <div className="client-name">{element.name}</div>
                  <div className="client-sub">
                    {`${element._count.serviceOrders} OS · ${element._count.vehicles} veículo(s)`}
                  </div>
                </div>
              </div>
              {element.telephone ? (
                <div className="client-info-row ">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {formatarCelular(element.telephone)}
                </div>
              ) : (
                ""
              )}
              {element.cell ? (
                <div className="client-info-row">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {formatarCelular(element.cell)}
                </div>
              ) : (
                ""
              )}
              {element.observation ? (
                <div className="client-info-row client-info-row-observation">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="client-info-observation-text">
                    {element.observation}
                  </span>
                </div>
              ) : (
                ""
              )}
              <div className="client-footer">
                <div className="client-vehicle-tags">
                  {element._count.vehicles > 0
                    ? element.vehicles.map((vehicle, index) => (
                        <VehicleBadge vehicle={vehicle} key={index} />
                      ))
                    : ""}
                </div>
                <button
                  className="btn btn-sm btn-secondary client-btn-add-vehicle"
                  onClick={(e) => handleOpenModal(e, element)}
                >
                  + Veículo
                </button>
                <button
                  className="btn btn-sm btn-secondary client-btn-add-edit-customer"
                  onClick={() => handleEditCustomerClick(element.id)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="customer-grid-not-found">
            Nenhum cliente encontrado
          </div>
        )}
      </div>

      {sidebarOpen && selectedCustomer && (
        <CustomerDetailPanel
          onClose={closeSidebar}
          sidebarOpen={sidebarOpen}
          selectedCustomer={selectedCustomer}
        />
      )}

      {isModalOpen && selectedCustomerModal && (
        <NewVehicleModal
          onClose={closeModal}
          isModalOpen={isModalOpen}
          selectedCustomer={selectedCustomerModal}
        />
      )}
    </div>
  );
};

export default Customers;
