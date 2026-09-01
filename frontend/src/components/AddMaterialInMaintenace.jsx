import React, { useMemo } from "react";
import AutoComplete from "./AutoComplete.component"; // Importe o AutoComplete genérico

const AddMaterialInMaintenace = ({
  handleAddMaterial,
  materialsList,
  handleMaterialInputChange,
  materialsGroupData = [],
  handleRemoveMaterial,
  findMaterialById,
  itemMaintenance_id,
}) => {
  // Filtra apenas os materiais deste serviço específico
  const serviceMaterials = materialsList.filter(
    (item) => item.itemMaintenance_id === itemMaintenance_id,
  );

  // Transforma os grupos de materiais em um array linear para a busca do AutoComplete
  const flatMaterials = useMemo(() => {
    if (!materialsGroupData || materialsGroupData.length === 0) return [];

    return materialsGroupData.flatMap((group) =>
      group.materials.map((mat) => ({
        ...mat,
        groupName: group.group,
      })),
    );
  }, [materialsGroupData]);

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
            {serviceMaterials.length > 0
              ? serviceMaterials.map((element, index) => {
                  // Encontra o item selecionado atualmente para o AutoComplete
                  const selectedMaterial = element.material_id
                    ? flatMaterials.find(
                        (m) => Number(m.id) === Number(element.material_id),
                      ) || { name: element.name }
                    : null;

                  return (
                    <tr className="add-material-row" key={element.id || index}>
                      <td>
                        <AutoComplete
                          placeholder="Selecione..."
                          items={flatMaterials}
                          filterKey="name"
                          value={element.name || ""}
                          selectedItem={selectedMaterial}
                          onInputChange={(val) => {
                            handleMaterialInputChange(
                              element.id,
                              "name",
                              val,
                              materialsGroupData,
                            );
                          }}
                          onSelect={(foundMaterial) => {
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
                          }}
                          onClear={() => {
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
                          }}
                          renderOption={(mat) => (
                            <>
                              <div className="ac-option-name">{mat.name}</div>
                              <div className="ac-option-sub">
                                {mat.groupName}
                              </div>
                            </>
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-new-order-material-qtd"
                          value={element.quantity}
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
                            value={element.value_unit ?? ""}
                            onChange={(e) =>
                              handleMaterialInputChange(
                                element.id,
                                "value_unit",
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
                            element.value_unit && element.quantity
                              ? (
                                  parseFloat(
                                    String(element.value_unit)
                                      .replace(",", ".")
                                      .replace(/[^0-9.]/g, ""),
                                  ) * parseFloat(element.quantity)
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
                          value={element.supplier || ""}
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
                          value={element.receipt || ""}
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
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveMaterial(element.id)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      <button
        type="button"
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
