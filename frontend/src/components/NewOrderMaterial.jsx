import { useState } from "react";
import { materialsListDTO } from "../data/mockDataDTO";

const NewOrderMaterial = ({ listMaintenanceJobs }) => {
  const [materialsList, setMaterialsList] = useState([]);

  const handleAddMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      description: "",
      quantity: "",
      unitValue: "",
      reference: "",
    };
    setMaterialsList([...materialsList, newMaterial]);
  };

  const handleRemoveMaterial = (id) => {
    setMaterialsList(materialsList.filter((material) => material.id !== id));
  };

  const handleMaterialInputChange = (id, field, value) => {
    setMaterialsList((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, [field]: value } : element,
      ),
    );
  };

  const calculateTotalMaintenanceJob = () => {
    return listMaintenanceJobs.reduce((total, job) => {
      return total + (parseFloat(job.serviceValue) || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalMaintenanceJob() + calculateTotalMaterials();
  };

  const calculateTotalMaterials = () => {
    return materialsList.reduce((total, material) => {
      const materialTotal =
        (parseFloat(material.unitValue) || 0) *
        (parseFloat(material.quantity) || 0);
      return total + materialTotal;
    }, 0);
  };

  return (
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
            <tbody>
              {materialsList.length > 0
                ? materialsList.map((element, index) => (
                    <tr className="add-material-row" key={index}>
                      <td>
                        <select
                          className="select select-new-order-material"
                          value={element.description}
                          onChange={(e) =>
                            handleMaterialInputChange(
                              element.id,
                              "description",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Selecione...</option>
                          {materialsListDTO.map((element, index) => (
                            <optgroup key={index} label={element.group}>
                              {element.items.map((element, index) => (
                                <option key={index} value={element}>
                                  {element}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-new-order-material-qtd"
                          value={element.quantity}
                          min="1"
                          onChange={(e) =>
                            handleMaterialInputChange(
                              element.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <div className="input-prefix">
                          <span>R$</span>
                          <input
                            type="text"
                            placeholder="0,00"
                            className="input-new-order-material-cost"
                            value={element.unitValue}
                            onChange={(e) =>
                              handleMaterialInputChange(
                                element.id,
                                "unitValue",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-new-order-material-total"
                          readOnly
                          value={
                            element.unitValue && element.quantity
                              ? (
                                  parseFloat(element.unitValue) *
                                  parseFloat(element.quantity)
                                ).toFixed(2)
                              : "—"
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-new-order-material-ref"
                          placeholder="Ref."
                          value={element.reference}
                          onChange={(e) =>
                            handleMaterialInputChange(
                              element.id,
                              "reference",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveMaterial(element.id)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
        <button class="add-row-btn" onClick={handleAddMaterial}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar peça / material
        </button>
        <div className="total-row">
          <div className="total-item">
            Mão de obra:{" "}
            <strong>R$ {calculateTotalMaintenanceJob().toFixed(2)}</strong>
          </div>
          <div className="total-row-divider"></div>
          <div className="total-item">
            Peças: <strong>R$ {calculateTotalMaterials().toFixed(2)}</strong>
          </div>
          <div className="total-row-divider"></div>
          <div className="total-item">
            Total:
            <span className="grand-total">
              R$ {calculateGrandTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderMaterial;
