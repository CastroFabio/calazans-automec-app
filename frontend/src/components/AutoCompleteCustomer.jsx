import React, { useEffect, useState } from "react";
import { newServiceOrderCustomerListDTO } from "../data/mockDataDTO";

const AutoCompleteCustomer = ({
  selectedCustomerInfo,
  setSelectedCustomerInfo,
  setSelectedVehicleInfo,
  customerData,
  handleFormFieldChange,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = customerData.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);
  }, [inputValue]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.name);
    setSelectedCustomerInfo(suggestion);
    setShowSuggestions(false);
    handleFormFieldChange("customer_id", suggestion.id);
    setFilteredSuggestions([]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
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

  return (
    <div className="ac-wrap">
      <div className="ac-input-row">
        <span className="ac-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {selectedCustomerInfo.name}
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
            <span className="ac-clear" onClick={handleClearCustomer}>
              ×
            </span>
          </>
        )}
      </div>
      <div className={`ac-dropdown ${showSuggestions ? "open" : ""}`}>
        {showSuggestions && filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((element, index) => (
            <div
              key={index}
              className="ac-option"
              onClick={() => handleSuggestionClick(element)}
            >
              <div className="ac-option-name">{element.name}</div>
              <div className="ac-option-sub">
                {`${element.cell} · ${element.vehicle.length}  veículo(s) `}
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
  );
};

export default AutoCompleteCustomer;
