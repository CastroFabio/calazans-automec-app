import React, { useEffect, useState } from "react";
import {
  maintenanceJobsListDTO,
  newServiceOrderCustomerListDTO,
} from "../data/mockDataDTO";

const NewServiceOrder = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState({});
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [listMaintenanceJobs, setListMaintenanceJobs] = useState([]);

  const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // The "T" is a required separator between date and time
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set the initial state with the current local time formatted correctly
  const [dateTimeValue, setDateTimeValue] = useState(
    formatLocalDateTime(new Date()),
  );

  const handleChange = (event) => {
    setDateTimeValue(event.target.value);
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = newServiceOrderCustomerListDTO.filter((suggestion) =>
      suggestion.customer.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.customer.name);
    setSelectedCustomerInfo(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleBlur = () => {
    // Delay para permitir clique na sugestão
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  const handleClearCustomer = () => {
    setInputValue("");
    setSelectedCustomerInfo({});
    setSelectedVehicleInfo({});
  };

  const handleSelectedVehicle = (vehicle) => setSelectedVehicleInfo(vehicle);

  const handleAddMaintenanceJob = () => {
    const newMaintenanceJob = {
      id: Date.now(),
      serviceType: "",
      serviceValue: "",
      observation: "",
    };

    setListMaintenanceJobs([...listMaintenanceJobs, newMaintenanceJob]);
  };

  const handleRemoveMaintenanceJob = (id) => {
    setListMaintenanceJobs(
      listMaintenanceJobs.filter((element) => element.id !== id),
    );
  };

  const handleInputMaintenanceJobChange = (id, field, value) => {
    setListMaintenanceJobs(
      listMaintenanceJobs.map((element) =>
        element.id === id ? { ...element, [field]: value } : element,
      ),
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="ph-title">Nova Ordem de Serviço</div>
          <div className="ph-sub">Preencha os dados para registrar</div>
        </div>
        <div className="os-num-badge">#OS-2025-0143</div>
      </div>
      <div className="form-wrap">
        {/* <!-- Cliente & Veículo --> */}
        <div className="form-section">
          <div className="fs-header">
            <svg
              className="fs-header-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="fs-title">Cliente & Veículo</span>
          </div>
          <div className="fs-body">
            <div className="form-grid">
              <div className="field">
                <label>Cliente *</label>
                {/* <!-- Autocomplete Cliente --> */}
                <div className="ac-wrap">
                  <div className="ac-input-row">
                    <span className="ac-icon">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    {selectedCustomerInfo &&
                    Object.keys(selectedCustomerInfo).length > 0 ? (
                      <div className="ac-selected-pill">
                        {selectedCustomerInfo.customer?.name}
                        <button onClick={handleClearCustomer}>×</button>
                      </div>
                    ) : (
                      <>
                        <input
                          className="ac-input"
                          type="text"
                          placeholder="Digite o nome do cliente..."
                          value={inputValue}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <span
                          className="ac-clear"
                          onClick={handleClearCustomer}
                        >
                          ×
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`ac-dropdown ${showSuggestions ? "open" : ""}`}
                  >
                    {showSuggestions && filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((element, index) => (
                        <div
                          key={index}
                          className="ac-option"
                          onClick={() => handleSuggestionClick(element)}
                        >
                          <div className="ac-option-name">
                            {element.customer.name}
                          </div>
                          <div className="ac-option-sub">
                            {`${element.customer.cell} · ${element.numberOfVehicles}  veículo(s) `}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="ac-empty">Nenhum cliente encontrado</div>
                    )}
                    <div
                      className="ac-option-create" /* onmousedown="acCreateClient('${inst}','${q.replace(/'/g, "\\'")}')" */
                    >
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {`Cadastrar "${inputValue}" como novo cliente`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Veículo *</label>
                <div className="car-badge-row">
                  {selectedCustomerInfo &&
                  Object.keys(selectedCustomerInfo).length > 0 ? (
                    selectedCustomerInfo.vehicle.length > 0 ? (
                      selectedCustomerInfo.vehicle.map((element, index) => (
                        <div
                          className={`car-badge ${selectedVehicleInfo === element ? "selected" : ""}`}
                          key={index}
                          onClick={() => handleSelectedVehicle(element)}
                        >
                          <svg
                            className="car-badge-svg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm-1-9l-3-6H7l-3 6H1v4h22v-4h-3z"
                            />
                          </svg>
                          {`${element.licensePlate} · ${element.brand} ${element.model}`}
                        </div>
                      ))
                    ) : (
                      <>
                        <span className="car-badge-row-text-no-car">
                          Nenhum veículo cadastrado
                        </span>
                        <button className="add-row-btn add-row-btn-car-badge">
                          + Cadastrar veículo
                        </button>
                      </>
                    )
                  ) : (
                    <span className="car-badge-row-text">
                      Selecione o cliente primeiro
                    </span>
                  )}
                </div>
              </div>
              <div className="field">
                <label>Km na entrada</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: 52.300 km"
                />
              </div>
              <div className="field">
                <label>Data / Hora de Entrada</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={dateTimeValue}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Serviços --> */}
        <div className="form-section">
          <div className="fs-header">
            <svg
              className="fs-header-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            <span className="fs-title">Serviços</span>
          </div>
          <div className="fs-body">
            <div className="services-list">
              {listMaintenanceJobs.length > 0
                ? listMaintenanceJobs.map((element, index) => (
                    <div key={index} className="service-row">
                      <div className="service-row-header">
                        <div className="service-num">{index + 1}</div>
                        <span className="service-row-label">
                          Serviço #{index + 1}
                        </span>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveMaintenanceJob(element.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="form-grid g3 form-grid-servico">
                        <div className="field col-2">
                          <label>Tipo de Serviço *</label>
                          <select className="select">
                            <option value="">Selecione o serviço...</option>

                            {maintenanceJobsListDTO.map((element, index) => (
                              <optgroup key={index} label={element.group}>
                                {element.items.map((element, index) => (
                                  <option key={index} value={element}>
                                    {element}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        <div className="field">
                          <label>Mão de Obra</label>
                          <div className="input-prefix">
                            <span>R$</span>
                            <input
                              type="text"
                              className="svc-mo-input"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                        <div className="field col-full">
                          <label>Observações</label>
                          <textarea
                            className="textarea service-row-textarea"
                            placeholder="Detalhes adicionais do serviço..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            <button className="add-row-btn" onClick={handleAddMaintenanceJob}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar serviço
            </button>
          </div>
        </div>

        {/* <!-- Peças & Materiais --> */}
        <div className="form-section">
          <div className="fs-header">
            <svg
              className="fs-header-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="fs-title">Peças & Materiais</span>
          </div>
          <div className="fs-body">
            <div className="mat-table-wrap">
              <table className="mat-table">
                <thead>
                  <tr>
                    <th className="mat-table-content-desc">Descrição</th>
                    <th className="mat-table-content-qtd">Qtd.</th>
                    <th className="mat-table-content-value">Valor Unit.</th>
                    <th className="mat-table-content-total">Total</th>
                    <th className="mat-table-content-ref">Referência</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
            <button className="add-row-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar peça / material
            </button>
            <div className="total-row">
              <div className="total-item">
                Mão de obra: <strong>R$ 0,00</strong>
              </div>
              <div className="total-row-divider"></div>
              <div className="total-item">
                Peças: <strong>R$ 0,00</strong>
              </div>
              <div className="total-row-divider"></div>
              <div className="total-item">
                Total:
                <span className="grand-total">R$ 0,00</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Info OS --> */}
        <div className="form-section">
          <div className="fs-header">
            <svg
              className="fs-header-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="fs-title">Informações da OS</span>
          </div>
          <div className="fs-body">
            <div className="form-grid g3">
              <div className="field">
                <label>Técnico Responsável</label>
                <select className="select">
                  <option value="">Selecione...</option>
                  <option>Carlos Mendes</option>
                  <option>Ana Lima</option>
                  <option>Pedro Santos</option>
                  <option>Fernanda Costa</option>
                </select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select className="select">
                  <option>Normal</option>
                  <option>Baixa</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </div>
              <div className="field">
                <label>Status Inicial</label>
                <select className="select">
                  <option>Pendente</option>
                  <option>Em andamento</option>
                </select>
              </div>
              <div className="field col-full">
                <label>Diagnóstico / Problema *</label>
                <textarea
                  className="textarea"
                  placeholder="Descreva o problema relatado pelo cliente e o diagnóstico realizado..."
                ></textarea>
              </div>
              <div className="field col-full">
                <label>Observações Internas</label>
                <textarea
                  className="textarea form-textarea-obs"
                  placeholder="Notas internas da equipe..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-ghost" /* onclick="navigate('os', null)" */
          >
            Cancelar
          </button>
          <button className="btn btn-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
              />
            </svg>
            Imprimir
          </button>
          <button className="btn btn-primary" /* onclick="saveOS()" */>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Salvar OS
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
