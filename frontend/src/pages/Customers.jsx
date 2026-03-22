import { useEffect, useMemo, useState } from "react";
import { customerListDTO } from "../data/mockDataDTO";

const Customers = () => {
  const [itemColors, setItemColors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [customersData] = useState(customerListDTO);

  const getCustomerNameInitials = (customerName) => {
    return customerName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return customersData;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return customersData.filter((customers) => {
      if (customers.customer.name.toLowerCase().includes(lowerCaseSearch)) {
        return true;
      }

      const vehicleMatch = customers.vehicle.some((car) =>
        car.licensePlate.toLowerCase().includes(lowerCaseSearch),
      );

      return vehicleMatch;
    });
  }, [customersData, searchTerm]);

  useEffect(() => {
    const newColors = {};
    customerListDTO.forEach((item, index) => {
      newColors[index] =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
    });
    setItemColors(newColors);
  }, [customerListDTO]);

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
        {filteredData.length > 0 ? (
          filteredData.map((customer, index) => (
            <div className="client-card" key={index}>
              <div className="client-card-header">
                <div
                  className="client-avatar-lg"
                  style={{
                    backgroundColor: itemColors[index],
                  }}
                >
                  {getCustomerNameInitials(customer.customer.name)}
                </div>
                <div>
                  <div className="client-name">{customer.customer.name}</div>
                  <div className="client-sub">
                    {`${customer.numberOfOS} OS · ${customer.numberOfVehicles} veículo(s)`}
                  </div>
                </div>
              </div>
              {customer.customer.telephone ? (
                <div className="client-info-row ">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {customer.customer.telephone}
                </div>
              ) : (
                ""
              )}
              {customer.customer.cell ? (
                <div className="client-info-row">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {customer.customer.cell}
                </div>
              ) : (
                ""
              )}
              {customer.customer.observation ? (
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
                    {customer.customer.observation}
                  </span>
                </div>
              ) : (
                ""
              )}
              <div className="client-footer">
                <div className="client-vehicle-tags">
                  {customer.vehicle.length > 0
                    ? customer.vehicle.map((car, index) => (
                        <span className="car-tag-group" key={index}>
                          <span className="svc-tag car-tag-placa">
                            {car.licensePlate}
                          </span>
                          <span className="svc-tag car-tag-model">
                            {car.brand} {car.model}
                          </span>
                        </span>
                      ))
                    : ""}
                </div>
                <button className="btn btn-sm btn-secondary client-btn-add-vehicle">
                  + Veículo
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
    </div>
  );
};

export default Customers;
