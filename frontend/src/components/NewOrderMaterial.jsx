import { useState } from "react";

const NewOrderMaterial = ({ listMaintenanceJobs }) => {
  const [materialsList, setMaterialsList] = useState([]);
  const [materialInput, setMaterialInput] = useState({
    description: "",
    quantity: 1,
    unitValue: "",
    reference: "",
  });

  const handleAddMaterial = () => {
    if (materialInput.description) {
      const newMaterial = {
        id: Date.now(),
        ...materialInput,
        total: materialInput.unitValue * materialInput.quantity,
      };
      setMaterialsList([...materialsList, newMaterial]);
      // Reset material input
      setMaterialInput({
        description: "",
        quantity: 1,
        unitValue: "",
        reference: "",
      });
    }
  };

  const handleRemoveMaterial = (id) => {
    setMaterialsList(materialsList.filter((material) => material.id !== id));
  };

  const handleMaterialInputChange = (field, value) => {
    setMaterialInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateMaterialTotal = (unitValue, quantity) => {
    const unit = parseFloat(unitValue) || 0;
    const qty = parseFloat(quantity) || 0;
    return unit * qty;
  };

  const calculateTotalLabor = () => {
    return listMaintenanceJobs.reduce((total, job) => {
      return total + (parseFloat(job.serviceValue) || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalLabor() + calculateTotalMaterials();
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
              {materialsList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Nenhum material adicionado
                  </td>
                </tr>
              ) : (
                materialsList.map((material) => (
                  <tr key={material.id}>
                    <td>{material.description}</td>
                    <td>{material.quantity}</td>
                    <td>R$ {material.unitValue}</td>
                    <td>
                      R${" "}
                      {calculateMaterialTotal(
                        material.unitValue,
                        material.quantity,
                      ).toFixed(2)}
                    </td>
                    <td>{material.reference}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveMaterial(material.id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
              <tr className="add-material-row">
                <td>
                  <select
                    className="select select-new-order-material"
                    value={materialInput.description}
                    onChange={(e) =>
                      handleMaterialInputChange("description", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="Óleo do motor">Óleo do motor</option>
                    <option value="Filtro de óleo">Filtro de óleo</option>
                    <option value="Pastilha de freio">Pastilha de freio</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="input input-new-order-material-qtd"
                    value={materialInput.quantity}
                    min="1"
                    onChange={(e) =>
                      handleMaterialInputChange("quantity", e.target.value)
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
                      value={materialInput.unitValue}
                      onChange={(e) =>
                        handleMaterialInputChange("unitValue", e.target.value)
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
                      materialInput.unitValue && materialInput.quantity
                        ? (
                            parseFloat(materialInput.unitValue) *
                            parseFloat(materialInput.quantity)
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
                    value={materialInput.reference}
                    onChange={(e) =>
                      handleMaterialInputChange("reference", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="add-row-btn-small"
                    onClick={handleAddMaterial}
                    disabled={!materialInput.description}
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="total-row">
          <div className="total-item">
            Mão de obra: <strong>R$ {calculateTotalLabor().toFixed(2)}</strong>
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
