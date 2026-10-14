const ServicesMaterialsStep = () => {
  const calcTotal = () => {};
  const svcAcFilter = () => {};
  const svcAcKey = () => {};
  const addSvcMat = () => {};
  const wzBack = () => {};
  const wzNext = () => {};
  const registrarServico = () => {};

  return (
    <div
      className="wz-panel"
      id="wzPanel1"
      style={
        {
          /* display: "none" */
        }
      }
    >
      <div className="wz-panel-inner" style={{ padding: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <label
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "var(--ink3)",
              whiteSpace: "nowrap",
            }}
          >
            Mão de obra
          </label>
          <div className="input-prefix" style={{ maxWidth: "180px" }}>
            <span>R$</span>
            <input
              type="text"
              id="moInput"
              className="input"
              placeholder="0,00"
              onInput={() => calcTotal()}
            />
          </div>
        </div>

        <div
          id="svcEntryForm"
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div style={{ position: "relative" }} id="svcAcWrap">
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "var(--ink3)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Serviço *
              </label>
              <input
                type="text"
                className="input"
                id="svcNomeInput"
                placeholder="Digite o serviço..."
                autoComplete="off"
                onInput={(e) => svcAcFilter(e.currentTarget.value)}
                onKeyDown={(e) => svcAcKey(e)}
                onFocus={(e) => svcAcFilter(e.currentTarget.value)}
              />
              <div
                id="svcAcDropdown"
                style={{
                  display: "none",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "calc(100% + 3px)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-lg)",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 300,
                }}
              ></div>
            </div>

            <div>
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "var(--ink3)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Observações
              </label>
              <input
                type="text"
                className="input"
                id="svcObsInput"
                placeholder="Opcional..."
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "var(--ink3)",
                marginBottom: "6px",
              }}
            >
              Peças & Materiais
            </div>
            <div
              id="svcMatsList"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "6px",
              }}
            ></div>
            <button
              className="svc-add-mat-btn"
              onClick={() => addSvcMat("svcMatsList")}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar peça
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => registrarServico()}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registrar serviço
            </button>
          </div>
        </div>

        <div id="svcRegistrados" style={{ display: "none" }}>
          <div id="svcRegistradosList"></div>
        </div>

        <div
          className="total-row"
          style={{
            margin: 0,
            borderTop: "1px solid var(--border)",
            borderRadius: 0,
          }}
        >
          <div className="total-item">
            Mão de obra: <strong id="moValue">R$ 0,00</strong>
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "var(--border)",
            }}
          ></div>
          <div className="total-item">
            Peças: <strong id="pecasValue">R$ 0,00</strong>
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "var(--border)",
            }}
          ></div>
          <div className="total-item">
            Total:{" "}
            <span className="grand-total" id="grandTotal">
              R$ 0,00
            </span>
          </div>
        </div>
      </div>

      <div className="wz-footer">
        <button className="btn btn-ghost" onClick={() => wzBack(1)}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>
        <button className="btn btn-primary" onClick={() => wzNext(1)}>
          Próximo — Detalhes
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServicesMaterialsStep;
