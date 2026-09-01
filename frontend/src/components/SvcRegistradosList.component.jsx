import React from "react";
import { formattedPrice } from "../utils/convertPrice";

const SvcRegistradosList = ({
  listMaintenanceJobs,
  setListMaintenanceJobs,
  handleRemoveMaintenanceJob,
  onEditMaintenanceJob, // Prop para carregar os dados de volta no formulário
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
      {(listMaintenanceJobs?.length || []) > 0 &&
        listMaintenanceJobs.map((element, index) => (
          <div key={element.id || index} className="svc-card">
            {/* Header do Card */}
            <div
              className={`svc-card-header ${element.isOpen ? "open" : ""}`}
              onClick={() => toggleSvcCard(element.id)}
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
              {element.description && (
                <div className="svc-obs" style={{ marginBottom: "8px" }}>
                  <strong>Obs:</strong> {element.description}
                </div>
              )}

              {(element?.materialsList?.length || []) > 0 ? (
                element.materialsList.map((mat, idx) => (
                  <div key={mat.id || idx} className="svc-materials-wrapper">
                    <div className="svc-material-item">
                      <span className="svc-material-name">{mat.name}</span>
                      <span className="svc-material-price">
                        {`${mat.quantity}x ${formattedPrice(mat.value_unit)}`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditMaintenanceJob) onEditMaintenanceJob(element);
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveMaintenanceJob(element.id);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SvcRegistradosList;
