import React, { useState } from "react";
import { useCustomers } from "../context/Customer.context";
import { formattedPrice } from "../utils/convertPrice";
import { useServiceOrders } from "../context/ServiceOrder.context";

const SvcRegistradosList = ({
  listMaintenanceJobs,
  setListMaintenanceJobs,
  handleRemoveMaintenanceJob,
}) => {
  const toggleSvcCard = (id) => {
    setListMaintenanceJobs((prevList) =>
      prevList.map((element) =>
        element.id === id ? { ...element, isOpen: !element.isOpen } : element,
      ),
    );
  };

  return (
    <div className="svc-container-card-list">
      {(listMaintenanceJobs?.length || []) > 0
        ? listMaintenanceJobs.map((element, index) => (
            <div key={index} className="svc-card">
              {/* Header do Card */}

              <div
                className={`svc-card-header ${element.isOpen ? "open" : ""}`}
                onClick={() => toggleSvcCard(element.id)}
                key={index}
              >
                <div className="svc-badge">{index + 1}</div>
                <div className="svc-title">{element.name}</div>
                <span
                  className={`svc-total-price ${
                    element.totalPrice > 0
                      ? "svc-total-active"
                      : "svc-total-muted"
                  }`}
                >
                  {formattedPrice(element.totalPrice)}
                </span>
                <svg
                  className={`svc-chevron ${element.isOpen ? "open" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Corpo Expansível */}
              <div className={`svc-card-body ${element.isOpen ? "open" : ""}`}>
                {null && <div className="svc-obs">Observação</div>}
                {(element?.materialsList?.length || []) > 0 ? (
                  element.materialsList.map((element, index) => (
                    <div key={index} className="svc-materials-wrapper">
                      <div className="svc-material-item">
                        <span className="svc-material-name">
                          {element.name}
                        </span>
                        <span className="svc-material-price">
                          {`${element.quantity}x ${formattedPrice(element.value_unit)}`}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="svc-materials-wrapper">
                    <div className="svc-card-body-no-material">Sem peças</div>
                  </div>
                )}
                {/* Ações */}
                <div className="svc-card-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost svc-btn-edit"
                    onClick={() => editarSvcRegistrado(i)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveMaintenanceJob(element.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};

export default SvcRegistradosList;
