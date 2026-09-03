const ItemGroupList = ({
  setIsCreatingGroup,
  isCreatingGroup,
  handleClickCreatingGroup,
  creatingGroupName,
  handleChangeCreatingGroup,
  handleCancelCreatingGroup,
  itemGroupData,
  setActiveTab,
  activeTab,
}) => {
  return (
    <div>
      <div className="flex">
        <div className="cad-subtitle-group">Grupos</div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreatingGroup(true)}
          disabled={isCreatingGroup}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {isCreatingGroup && (
        <div
          className="cad-create-group-container"
          style={{ marginBottom: "8px" }}
        >
          <form onSubmit={handleClickCreatingGroup}>
            <input
              type="text"
              className="input cad-input cad-input-group-create"
              value={creatingGroupName}
              onChange={handleChangeCreatingGroup}
              placeholder="Ex: Suspensão, Motor, Freios..."
              autoFocus
            />
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!creatingGroupName.trim()}
              >
                Criar
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleCancelCreatingGroup}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cad-groups" id="svcGroupList">
        {itemGroupData && itemGroupData.length > 0
          ? itemGroupData.map((element) => {
              // Obtém a contagem de itens de forma polimórfica (para Serviços ou Materiais)
              const itemCount =
                element.maintenanceJobs?.length ??
                element.materials?.length ??
                0;

              const isActive = activeTab.groupName === element.group;

              return (
                <div
                  key={element.id || element.group}
                  className="cad-group-wrap"
                >
                  <button
                    onClick={() =>
                      setActiveTab({
                        groupIndex: element.id,
                        groupName: element.group,
                      })
                    }
                    className={`cad-group-btn ${isActive ? "active" : ""}`}
                  >
                    <span>{element.group}</span>
                    <div className="cad-group-container">
                      <span className="cad-group-count">{itemCount}</span>
                      <span className="cad-chevron">
                        <svg
                          className="cad-chevron-symbol"
                          style={{
                            transform: isActive
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
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
                      </span>
                    </div>
                  </button>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default ItemGroupList;
