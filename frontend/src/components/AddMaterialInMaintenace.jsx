import { useMemo, useState } from "react";
import AutoComplete from "./AutoComplete.component"; // Importe o AutoComplete genérico
import { parseValue } from "../utils/parseValue";
import NewItemModal from "../components/NewItemModal.component";
import WizardBtn from "./WizardBtn.component";
import { materialApi } from "../api/materials";

const AddMaterialInMaintenace = ({
  handleAddMaterial,
  materialsList,
  handleMaterialInputChange,
  materialsGroupData = [],
  handleRemoveMaterial,
  itemMaintenance_id,
  listMaintenanceJobs = [],
  setMaterialsGroupData,
}) => {
  const [isMaterialModalOpen, setMaterialIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  // Filtra apenas os materiais deste serviço específico
  const serviceMaterials = itemMaintenance_id
    ? materialsList.filter(
        (item) =>
          Number(item.itemMaintenance_id) === Number(itemMaintenance_id),
      )
    : materialsList;

  const registeredMaterials = useMemo(() => {
    return listMaintenanceJobs.flatMap((job) => job.materialsList || []);
  }, [listMaintenanceJobs]);

  const flatMaterials = useMemo(() => {
    if (!materialsGroupData || materialsGroupData.length === 0) return [];

    return materialsGroupData.flatMap((group) =>
      group.materials.map((mat) => ({
        ...mat,
        groupName: group.group,
      })),
    );
  }, [materialsGroupData]);

  // Mapeia os materiais aplicando o status 'disabled' se já estiver na lista deste serviço
  const updatedFlatMaterials = useMemo(() => {
    return flatMaterials.map((mat) => {
      const isAddedInCurrent = serviceMaterials.some(
        (item) => Number(item.material_id) === Number(mat.id),
      );

      const isAddedInRegistered = registeredMaterials.some(
        (item) => Number(item.material_id) === Number(mat.id),
      );

      return {
        ...mat,
        disabled: isAddedInCurrent || isAddedInRegistered,
      };
    });
  }, [flatMaterials, serviceMaterials, registeredMaterials]);

  const closeMaterialModal = () => {
    setMaterialIsModalOpen(false);
  };

  const handleOpenMaterialModal = () => {
    setMaterialIsModalOpen(true);
  };

  const handleCheckboxChange = (event, materialID) => {
    const isChecked = event.target.checked;
    setCheckedItems((prev) => ({
      ...prev,
      [materialID]: isChecked,
    }));
  };

  return (
    <div className="add-material-by-maintenance-container">
      <div className="add-material-by-maintenance-label">
        Peças & Materiais deste serviço
      </div>
      <WizardBtn label={"Novo material"} openModal={handleOpenMaterialModal} />
      <div className="mat-table-wrap">
        <table className="mat-table">
          <thead>
            <tr>
              <th className="mat-table-content-desc">Descrição</th>
              <th className="mat-table-content-qtd">Qtd.</th>
              <th className="mat-table-content-qtd">Fornecido pelo cliente?</th>
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
                          items={updatedFlatMaterials} // Usa o array com a flag disabled
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
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                opacity: mat.disabled ? 0.5 : 1,
                              }}
                            >
                              <div>
                                <div className="ac-option-name">{mat.name}</div>
                                <div className="ac-option-sub">
                                  {mat.groupName}
                                </div>
                              </div>

                              {mat.disabled && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    color: "var(--accent)",
                                    fontWeight: "700",
                                    whiteSpace: "nowrap",
                                    marginLeft: "8px",
                                  }}
                                >
                                  Já adicionado
                                </span>
                              )}
                            </div>
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
                        <div
                          className="mat-client-check"
                          title="Fornecido pelo cliente"
                        >
                          <input
                            type="checkbox"
                            id={`matClient-${element.id}`}
                            className="mat-client-cb"
                            checked={!!checkedItems[element.id]} // Ensures boolean value
                            onChange={(event) => {
                              handleCheckboxChange(event, element.id);
                              handleMaterialInputChange(
                                element.id,
                                "isCustomerSupplier",
                                event.target.checked,
                                materialsGroupData,
                              );
                              handleMaterialInputChange(
                                element.id,
                                "value_unit",
                                0,
                                materialsGroupData,
                              );
                              handleMaterialInputChange(
                                element.id,
                                "supplier",
                                "",
                                materialsGroupData,
                              );
                              handleMaterialInputChange(
                                element.id,
                                "supplier",
                                "",
                                materialsGroupData,
                              );
                            }}
                          />
                          <label className="mat-client-label">Cliente</label>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`input-prefix ${!!checkedItems[element.id] ? "input-div-disabled" : ""}`}
                        >
                          <span>R$</span>
                          <input
                            type="text"
                            placeholder="0.00"
                            className="input-new-order-material-cost"
                            disabled={!!checkedItems[element.id]}
                            value={element.value_unit ?? ""}
                            onChange={(e) => {
                              let val = e.target.value
                                .replace(",", ".")
                                .replace(/[^0-9.]/g, "");

                              // Garante no máximo um ponto decimal
                              const parts = val.split(".");
                              if (parts.length > 2) {
                                val = parts[0] + "." + parts.slice(1).join("");
                              }

                              // Limita a no máximo 2 casas decimais
                              if (parts[1] && parts[1].length > 2) {
                                val = `${parts[0]}.${parts[1].slice(0, 2)}`;
                              }

                              handleMaterialInputChange(
                                element.id,
                                "value_unit",
                                val,
                                materialsGroupData,
                              );
                            }}
                          />
                        </div>
                      </td>

                      <td>
                        <input
                          type="text"
                          className={`input input-new-order-material-total ${!!checkedItems[element.id] ? "input-div-disabled" : ""}`}
                          readOnly
                          disabled
                          value={
                            element.value_unit && element.quantity
                              ? (
                                  parseValue(element.value_unit) *
                                  parseFloat(element.quantity || 0)
                                ).toFixed(2)
                              : "—"
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={`input input-new-order-material-ref ${!!checkedItems[element.id] ? "input-div-disabled" : ""}`}
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
                          className={`input input-new-order-material-ref ${!!checkedItems[element.id] ? "input-div-disabled" : ""}`}
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
      {/* Modal para Materiais */}
      {isMaterialModalOpen && (
        <NewItemModal
          title="Novo Material"
          placeholder="Digite o novo material..."
          buttonLabel="Salvar e cadastrar material"
          closeModal={closeMaterialModal}
          isModalOpen={isMaterialModalOpen}
          items={materialsGroupData}
          createItem={async (groupIndex, newItemName) => {
            if (!newItemName.trim()) {
              setError("O nome do material é obrigatório");
              return;
            }

            if (!groupIndex) {
              setError("Selecione um grupo");
              return;
            }

            try {
              const newItem = {
                name: newItemName.trim(),
                group_id: groupIndex,
              };

              // 1. Chamada de API de Materiais
              const response = await materialApi.create(newItem);
              const createdItem = response.data || response;

              // 2. Atualiza o estado local materialsGroupData
              setMaterialsGroupData((prevData) =>
                prevData.map((group) => {
                  if (group.id === groupIndex) {
                    return {
                      ...group,
                      materials: [...(group.materials || []), createdItem],
                    };
                  }
                  return group;
                }),
              );

              closeMaterialModal();
            } catch (err) {
              console.error("Erro ao adicionar material:", err);
              setError(
                err.response?.data?.message || "Erro ao adicionar material.",
              );
              /* alert(
                err.response?.data?.message || "Erro ao adicionar material.",
              ); */
            }
          }}
          onError={error}
        />
      )}
    </div>
  );
};

export default AddMaterialInMaintenace;
