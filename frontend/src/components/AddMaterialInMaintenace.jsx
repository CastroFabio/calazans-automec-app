import { useMemo, useRef, useState } from "react";
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

  const materialRef = useRef({});

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

  const handleFocusOnValueUnit = (index) => {
    if (materialRef.current[index]) {
      materialRef.current[index].focus();
      materialRef.current[index].select();
    }
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
                            handleFocusOnValueUnit(element.id);
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
                            ref={(el) => (materialRef.current[element.id] = el)}
                            value={element.value_unit ?? ""}
                            onChange={(e) => {
                              handleMaterialInputChange(
                                element.id,
                                "value_unit",
                                e.target.value,
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
                      {index > 0 ? (
                        <td>
                          <button
                            className="mat-action-btn mat-action-copy"
                            onClick={() => {
                              handleMaterialInputChange(
                                element.id,
                                "receipt",
                                materialsList[index - 1].receipt,
                                materialsGroupData,
                              );
                              handleMaterialInputChange(
                                element.id,
                                "supplier",
                                materialsList[index - 1].supplier,
                                materialsGroupData,
                              );
                            }}
                          >
                            <svg
                              width="16"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 11V17M12 11L14 13M12 11L10 13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                xmlns="http://www.w3.org/2000/svg"
                                d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 11V17M12 11L14 13M12 11L10 13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </td>
                      ) : (
                        <td>
                          <button
                            className="mat-action-btn mat-action-copy"
                            onClick={() => {
                              materialsList.forEach((material) => {
                                handleMaterialInputChange(
                                  material.id,
                                  "receipt",
                                  element.receipt,
                                  materialsGroupData,
                                );
                                handleMaterialInputChange(
                                  material.id,
                                  "supplier",
                                  element.supplier,
                                  materialsGroupData,
                                );
                              });
                            }}
                          >
                            <svg
                              xmlns="http://w3.org"
                              width="16"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        </td>
                      )}
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
