const AddMaterialInMaintenace = ({
  handleAddMaterial,
  materialsList,
  handleMaterialInputChange,
  materialsGroupData,
  handleRemoveMaterial,
  findMaterialById,
}) => {
  return (
    <div className="add-material-by-maintenance-container">
      <div className="add-material-by-maintenance-label">
        Peças & Materiais deste serviço
      </div>
      <div className="mat-table-wrap">
        <table className="mat-table">
          <thead>
            <tr>
              <th className="mat-table-content-desc">Descrição</th>
              <th className="mat-table-content-qtd">Qtd.</th>
              <th className="mat-table-content-value">Unit.</th>
              <th className="mat-table-content-total">Total</th>
              <th className="mat-table-content-supplier">Fornecedor</th>
              <th className="mat-table-content-receipt">Nº Recibo</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="svc-mat-body">
            {materialsList.length > 0
              ? materialsList.map((element, index) => (
                  <tr className="add-material-row" key={index}>
                    <td>
                      <select
                        className="select select-new-order-material"
                        value={element.material_id || ""} // ← USA O ID, não o nome
                        onChange={(e) => {
                          const selectedId = e.target.value;

                          if (!selectedId) {
                            // Limpar
                            handleMaterialInputChange(
                              element.id,
                              "material_id",
                              null,
                              materialsGroupData,
                            );
                            handleMaterialInputChange(
                              element.id,
                              "name",
                              "",
                              materialsGroupData,
                            );
                            return;
                          }

                          // Buscar o material pelo ID
                          const foundMaterial = findMaterialById(
                            Number(selectedId),
                          );

                          if (foundMaterial) {
                            // Atualizar material_id e name
                            handleMaterialInputChange(
                              element.id,
                              "material_id",
                              foundMaterial.id,
                              materialsGroupData,
                            );
                            handleMaterialInputChange(
                              element.id,
                              "name",
                              foundMaterial.name,
                              materialsGroupData,
                            );
                          }
                        }}
                      >
                        <option value="">Selecione...</option>
                        {materialsGroupData.map((group, groupIndex) => (
                          <optgroup key={groupIndex} label={group.group}>
                            {group.materials.map((material, materialIndex) => (
                              <option key={materialIndex} value={material.id}>
                                {material.name}
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
                            materialsGroupData,
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="input-prefix">
                        <span>R$</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          className="input-new-order-material-cost"
                          value={element.value_unity ?? ""}
                          onChange={(e) =>
                            handleMaterialInputChange(
                              element.id,
                              "value_unity",
                              e.target.value,
                              materialsGroupData,
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
                        disabled
                        value={
                          element.value_unity && element.quantity
                            ? (
                                parseFloat(element.value_unity) *
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
                        value={element.supplier}
                        onChange={(e) =>
                          handleMaterialInputChange(
                            element.id,
                            "supplier",
                            e.target.value,
                            materialsGroupData,
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-new-order-material-ref"
                        placeholder="Ref."
                        value={element.receipt}
                        onChange={(e) =>
                          handleMaterialInputChange(
                            element.id,
                            "receipt",
                            e.target.value,
                            materialsGroupData,
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
              : null}
          </tbody>
        </table>
      </div>
      <button
        className="add-row-btn add-material-by-maintenance"
        onClick={handleAddMaterial}
      >
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
    </div>
  );
};

export default AddMaterialInMaintenace;
