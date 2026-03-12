function App() {
  return (
    <>
      <div
        className="sidebar-backdrop"
        id="sidebarBackdrop"
        onClick={toggleSidebar()}
      ></div>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="logo-text">
              MecânicaOS<small>Gestão de oficina</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Operações</div>
          <div
            className="nav-item active"
            data-page="os"
            onClick={navigate("os", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Ordens de Serviço
            <span className="nav-count" id="osCount">
              8
            </span>
          </div>
          <div
            className="nav-item"
            data-page="nova-os"
            onClick={navigate("nova-os", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova OS
          </div>
          <div
            className="nav-item"
            data-page="editar-os"
            id="navEditarOS"
            style="display:none;"
            onClick={navigate("editar-os", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar OS
          </div>
          <div className="nav-label">Cadastros</div>
          <div
            className="nav-item"
            data-page="clientes"
            onClick={navigate("clientes", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Clientes
            <span className="nav-count" id="clientCount">
              5
            </span>
          </div>
          <div
            className="nav-item"
            data-page="servicos-cad"
            onClick={navigate("servicos-cad", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Serviços
            <span className="nav-count" id="servicosCount">
              —
            </span>
          </div>
          <div
            className="nav-item"
            data-page="materiais-cad"
            onClick={navigate("materiais-cad", this)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Materiais & Peças
            <span className="nav-count" id="materiaisCount">
              —
            </span>
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-row">
            <div className="avatar">JC</div>
            <div>
              <div className="user-name">João Carlos</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button
            className="hamburger"
            onClick={toggleSidebar()}
            aria-label="Menu"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="page-title" id="pageTitle">
            Ordens de Serviço
          </span>
          <div className="topbar-right" id="topbarRight"></div>
        </header>
        <div className="content">
          <div className="page active" id="page-os">
            <div className="page-header">
              <div>
                <div className="ph-title">Ordens de Serviço</div>
                <div className="ph-sub">
                  Gerencie e acompanhe todas as ordens
                </div>
              </div>
            </div>
            <div className="toolbar">
              <div className="search-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar OS, cliente, veículo, placa..."
                  oninput="filterOS(this.value)"
                />
              </div>
              <div className="chips" id="osChips">
                <div className="chip active" onClick={setChip(this, "all")}>
                  Todas
                </div>
                <div className="chip" onClick={setChip(this, "pending")}>
                  Pendentes
                </div>
                <div className="chip" onClick={setChip(this, "progress")}>
                  Em andamento
                </div>
                <div className="chip" onClick={setChip(this, "done")}>
                  Concluídas
                </div>
              </div>
            </div>
            <div className="os-table-wrap">
              <table className="os-table">
                <thead>
                  <tr>
                    <th>Nº OS</th>
                    <th>Cliente / Veículo</th>
                    <th>Serviços</th>
                    <th>Técnico</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Entrada</th>
                  </tr>
                </thead>
                <tbody id="osTableBody"></tbody>
              </table>
            </div>
          </div>

          <div className="page" id="page-nova-os">
            <div className="page-header">
              <div>
                <div className="ph-title">Nova Ordem de Serviço</div>
                <div className="ph-sub">Preencha os dados para registrar</div>
              </div>
              <div className="os-num-badge">#OS-2025-0143</div>
            </div>
            <div className="form-wrap">
              <div className="form-section">
                <div className="fs-header">
                  <svg
                    style="width:13px;height:13px;color:var(--accent)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="fs-title">Cliente & Veículo</span>
                </div>
                <div className="fs-body">
                  <div className="form-grid">
                    <div className="field">
                      <label>Cliente *</label>
                      <div className="ac-wrap" id="acClientWrap">
                        <div className="ac-input-row" id="acClientRow">
                          <span className="ac-icon">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </span>
                          <input
                            className="ac-input"
                            id="acClientInput"
                            type="text"
                            placeholder="Digite o nome do cliente..."
                            autocomplete="off"
                            oninput="acSearch('client',this.value)"
                            onfocus="acOpen('client')"
                            onkeydown="acKey(event,'client')"
                          />
                          <span
                            className="ac-clear"
                            id="acClientClear"
                            onClick={acClear("client")}
                          >
                            ×
                          </span>
                        </div>
                        <div
                          className="ac-dropdown"
                          id="acClientDropdown"
                        ></div>
                      </div>
                    </div>
                    <div className="field">
                      <label>Veículo *</label>
                      <div className="car-badge-row" id="carBadgeRow">
                        <span style="font-size:12px;color:var(--ink3);">
                          Selecione o cliente primeiro
                        </span>
                      </div>
                    </div>
                    <div className="field">
                      <label>Km na entrada</label>
                      <input
                        type="text"
                        className="input"
                        id="kmEntrada"
                        placeholder="Ex: 52.300 km"
                      />
                    </div>
                    <div className="field">
                      <label>Data / Hora de Entrada</label>
                      <input
                        type="datetime-local"
                        className="input"
                        id="dataEntrada"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div className="form-section">
                <div className="fs-header">
                  <svg
                    style="width:13px;height:13px;color:var(--accent)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="fs-title">Serviços</span>
                </div>
                <div className="fs-body">
                  <div className="services-list" id="servicesList"></div>
                  <button className="add-row-btn" onClick={addService()}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Adicionar serviço
                  </button>
                </div>
              </div>

              {/* Peças & Materiais */}
              <div className="form-section">
                <div className="fs-header">
                  <svg
                    style="width:13px;height:13px;color:var(--accent)"
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
                          <th style="width:38%">Descrição</th>
                          <th style="width:9%">Qtd.</th>
                          <th style="width:17%">Valor Unit.</th>
                          <th style="width:17%">Total</th>
                          <th style="width:15%">Referência</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="matBody"></tbody>
                    </table>
                  </div>
                  <button className="add-row-btn" onClick={addMatRow()}>
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
                  <div className="total-row">
                    <div className="total-item">
                      Mão de obra: <strong id="moValue">R$ 0,00</strong>
                    </div>
                    <div style="width:1px;height:18px;background:var(--border)"></div>
                    <div className="total-item">
                      Peças: <strong id="pecasValue">R$ 0,00</strong>
                    </div>
                    <div style="width:1px;height:18px;background:var(--border)"></div>
                    <div className="total-item">
                      Total:{" "}
                      <span className="grand-total" id="grandTotal">
                        R$ 0,00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info OS */}
              <div className="form-section">
                <div className="fs-header">
                  <svg
                    style="width:13px;height:13px;color:var(--accent)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="fs-title">Informações da OS</span>
                </div>
                <div className="fs-body">
                  <div className="form-grid g3">
                    <div className="field">
                      <label>Técnico Responsável</label>
                      <select className="select">
                        <option value="">Selecione...</option>
                        <option>Carlos Mendes</option>
                        <option>Ana Lima</option>
                        <option>Pedro Santos</option>
                        <option>Fernanda Costa</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Prioridade</label>
                      <select className="select">
                        <option>Normal</option>
                        <option>Baixa</option>
                        <option>Alta</option>
                        <option>Urgente</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Status Inicial</label>
                      <select className="select">
                        <option>Pendente</option>
                        <option>Em andamento</option>
                      </select>
                    </div>
                    <div className="field col-full">
                      <label>Diagnóstico / Problema *</label>
                      <textarea
                        className="textarea"
                        placeholder="Descreva o problema relatado pelo cliente e o diagnóstico realizado..."
                      ></textarea>
                    </div>
                    <div className="field col-full">
                      <label>Observações Internas</label>
                      <textarea
                        className="textarea"
                        style="min-height:56px;"
                        placeholder="Notas internas da equipe..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-ghost"
                  onClick={navigate("os", null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-secondary">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
                    />
                  </svg>
                  Imprimir
                </button>
                <button className="btn btn-primary" onClick={saveOS()}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Salvar OS
                </button>
              </div>
            </div>
          </div>

          {/* ══════ CLIENTES ══════ */}
          <div className="page" id="page-clientes">
            <div className="page-header">
              <div>
                <div className="ph-title">Clientes</div>
                <div className="ph-sub">
                  Cadastro de clientes e seus veículos
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={openModal("modalCliente")}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Cliente
              </button>
            </div>
            <div className="toolbar">
              <div className="search-box" style="max-width:360px;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone, placa..."
                  oninput="filterClientes(this.value)"
                />
              </div>
            </div>
            <div className="clients-grid" id="clientsGrid"></div>
          </div>

          {/* ══════ SERVIÇOS CADASTRO ══════ */}
          <div className="page" id="page-servicos-cad">
            <div className="page-header">
              <div>
                <div className="ph-title">Serviços</div>
                <div className="ph-sub">
                  Catálogo de serviços disponíveis na oficina
                </div>
              </div>
            </div>
            <div className="cad-layout">
              <div>
                <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink3);margin-bottom:8px;">
                  Grupos
                </div>
                <div className="cad-groups" id="svcGroupList"></div>
              </div>
              <div className="cad-items-outer">
                <div className="cad-items-wrap">
                  <div className="cad-items-header">
                    <span className="cad-items-title" id="svcGroupTitle">
                      Selecione um grupo
                    </span>
                    <div className="search-box" style="max-width:220px;">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Filtrar serviços..."
                        oninput="filterCadItems('svc',this.value)"
                      />
                    </div>
                  </div>
                  <div id="svcItemList">
                    <div className="cad-empty">
                      Selecione um grupo à esquerda
                    </div>
                  </div>
                  <div className="cad-add-form">
                    <input
                      type="text"
                      className="input"
                      id="svcNewItem"
                      placeholder="Nome do novo serviço..."
                      style="flex:1;"
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={addCadItem("svc")}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════ MATERIAIS CADASTRO ══════ */}
          <div className="page" id="page-materiais-cad">
            <div className="page-header">
              <div>
                <div className="ph-title">Materiais & Peças</div>
                <div className="ph-sub">
                  Catálogo de peças e materiais utilizados
                </div>
              </div>
            </div>
            <div className="cad-layout">
              <div>
                <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink3);margin-bottom:8px;">
                  Grupos
                </div>
                <div className="cad-groups" id="matGroupList"></div>
              </div>
              <div className="cad-items-outer">
                <div className="cad-items-wrap">
                  <div className="cad-items-header">
                    <span className="cad-items-title" id="matGroupTitle">
                      Selecione um grupo
                    </span>
                    <div className="search-box" style="max-width:220px;">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Filtrar materiais..."
                        oninput="filterCadItems('mat',this.value)"
                      />
                    </div>
                  </div>
                  <div id="matItemList">
                    <div className="cad-empty">
                      Selecione um grupo à esquerda
                    </div>
                  </div>
                  <div className="cad-add-form">
                    <input
                      type="text"
                      className="input"
                      id="matNewItem"
                      placeholder="Nome da nova peça / material..."
                      style="flex:1;"
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={addCadItem("mat")}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════ EDITAR / ATUALIZAR OS ══════ */}
          <div className="page" id="page-editar-os">
            {/* Breadcrumb */}
            <div style="padding:18px 24px 0;">
              <div className="breadcrumb">
                <a onClick={navigate("os", null)}>Ordens de Serviço</a>
                <span className="breadcrumb-sep">›</span>
                <span
                  id="editBreadcrumbId"
                  style="color:var(--accent);font-family:'JetBrains Mono',monospace;font-weight:700;"
                ></span>
              </div>
            </div>

            <div className="page-header" style="padding-top:10px;">
              <div>
                <div className="ph-title" id="editPageTitle">
                  Editar Ordem de Serviço
                </div>
                <div className="ph-sub" id="editPageSub">
                  Atualize os dados, status e registre observações
                </div>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <div id="editStatusBadge"></div>
                <div id="editPriBadge"></div>
              </div>
            </div>

            <div className="edit-layout">
              {/* LEFT: form sections */}
              <div className="edit-main">
                {/* Cliente & Veículo (readonly summary) */}
                <div className="form-section">
                  <div className="fs-header">
                    <svg
                      style="width:13px;height:13px;color:var(--accent)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="fs-title">Cliente & Veículo</span>
                    <span style="margin-left:auto;font-size:11px;color:var(--ink3);">
                      Somente leitura — altere na OS original
                    </span>
                  </div>
                  <div className="fs-body">
                    <div className="form-grid" style="gap:12px;">
                      <div className="field">
                        <label>Cliente</label>
                        <div
                          className="input"
                          style="background:var(--surface2);color:var(--ink2);cursor:default;"
                          id="editClientName"
                        >
                          —
                        </div>
                      </div>
                      <div className="field">
                        <label>Veículo</label>
                        <div
                          className="input"
                          style="background:var(--surface2);color:var(--ink2);cursor:default;"
                          id="editCarInfo"
                        >
                          —
                        </div>
                      </div>
                      <div className="field">
                        <label>Km na Entrada</label>
                        <div
                          className="input"
                          style="background:var(--surface2);color:var(--ink2);cursor:default;font-family:'JetBrains Mono',monospace;"
                          id="editKm"
                        >
                          —
                        </div>
                      </div>
                      <div className="field">
                        <label>Data / Hora Entrada</label>
                        <div
                          className="input"
                          style="background:var(--surface2);color:var(--ink2);cursor:default;"
                          id="editEntrada"
                        >
                          —
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serviços editáveis */}
                <div className="form-section">
                  <div className="fs-header">
                    <svg
                      style="width:13px;height:13px;color:var(--accent)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="fs-title">Serviços</span>
                  </div>
                  <div className="fs-body">
                    <div className="services-list" id="editServicesList"></div>
                    <button
                      className="add-row-btn"
                      onClick={addEditService("", true)}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Adicionar serviço
                    </button>
                  </div>
                </div>

                {/* Peças editáveis */}
                <div className="form-section">
                  <div className="fs-header">
                    <svg
                      style="width:13px;height:13px;color:var(--accent)"
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
                            <th style="width:38%">Descrição</th>
                            <th style="width:9%">Qtd.</th>
                            <th style="width:17%">Valor Unit.</th>
                            <th style="width:17%">Total</th>
                            <th style="width:15%">Referência</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody id="editMatBody"></tbody>
                      </table>
                    </div>
                    <button
                      className="add-row-btn"
                      onClick={addEditMatRow("", true)}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Adicionar peça / material
                    </button>
                    <div className="total-row">
                      <div className="total-item">
                        Mão de obra: <strong id="editMoValue">R$ 0,00</strong>
                      </div>
                      <div style="width:1px;height:18px;background:var(--border)"></div>
                      <div className="total-item">
                        Peças: <strong id="editPecasValue">R$ 0,00</strong>
                      </div>
                      <div style="width:1px;height:18px;background:var(--border)"></div>
                      <div className="total-item">
                        Total:{" "}
                        <span className="grand-total" id="editGrandTotal">
                          R$ 0,00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnóstico & Observações */}
                <div className="form-section">
                  <div className="fs-header">
                    <svg
                      style="width:13px;height:13px;color:var(--accent)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="fs-title">Diagnóstico & Informações</span>
                  </div>
                  <div className="fs-body">
                    <div className="form-grid g3" style="gap:12px;">
                      <div className="field">
                        <label>Técnico Responsável</label>
                        <select className="select" id="editTecnico">
                          <option>Carlos Mendes</option>
                          <option>Ana Lima</option>
                          <option>Pedro Santos</option>
                          <option>Fernanda Costa</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Prioridade</label>
                        <select className="select" id="editPrioridade">
                          <option value="normal">Normal</option>
                          <option value="baixa">Baixa</option>
                          <option value="alta">Alta</option>
                          <option value="urgente">Urgente</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Km na Saída</label>
                        <input
                          type="text"
                          className="input"
                          id="editKmSaida"
                          placeholder="—"
                        />
                      </div>
                      <div className="field col-full">
                        <label>Diagnóstico / Descrição *</label>
                        <textarea
                          className="textarea"
                          id="editDesc"
                          placeholder="Descreva o problema e diagnóstico..."
                        ></textarea>
                      </div>
                      <div className="field col-full">
                        <label>Observações Internas</label>
                        <textarea
                          className="textarea"
                          id="editObs"
                          style="min-height:56px;"
                          placeholder="Notas internas da equipe..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions" style="padding:0;">
                  <button
                    className="btn btn-ghost"
                    onClick={navigate("os", null)}
                  >
                    Voltar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmCancelOS()}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancelar OS
                  </button>
                  <button className="btn btn-primary" onClick={saveEditOS()}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Salvar Alterações
                  </button>
                </div>
              </div>

              {/* RIGHT: sidebar with status + log */}
              <div className="edit-side">
                {/* Status update */}
                <div className="status-card">
                  <div className="status-card-header">
                    <svg
                      style="width:12px;height:12px;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Atualizar Status
                  </div>
                  <div className="status-card-body">
                    <div className="status-options" id="statusOptions">
                      <div
                        className="status-opt"
                        data-status="pending"
                        onClick={selectStatus("pending")}
                      >
                        <div
                          className="status-opt-dot"
                          style="background:#f59e0b;"
                        ></div>
                        <span className="status-opt-label">Pendente</span>
                        <div className="status-opt-check"></div>
                      </div>
                      <div
                        className="status-opt"
                        data-status="progress"
                        onClick={selectStatus("progress")}
                      >
                        <div
                          className="status-opt-dot"
                          style="background:#3b82f6;"
                        ></div>
                        <span className="status-opt-label">Em andamento</span>
                        <div className="status-opt-check"></div>
                      </div>
                      <div
                        className="status-opt"
                        data-status="done"
                        onClick={selectStatus("done")}
                      >
                        <div
                          className="status-opt-dot"
                          style="background:#22c55e;"
                        ></div>
                        <span className="status-opt-label">Concluída</span>
                        <div className="status-opt-check"></div>
                      </div>
                      <div
                        className="status-opt"
                        data-status="cancelled"
                        onClick={selectStatus("cancelled")}
                      >
                        <div
                          className="status-opt-dot"
                          style="background:#ef4444;"
                        ></div>
                        <span className="status-opt-label">Cancelada</span>
                        <div className="status-opt-check"></div>
                      </div>
                    </div>

                    <div className="note-input-wrap">
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--ink3);margin-bottom:5px;">
                        Anotação sobre a mudança
                      </div>
                      <textarea
                        className="note-textarea"
                        id="statusNote"
                        placeholder="Ex: Peça chegou, iniciando instalação..."
                      ></textarea>
                    </div>
                    <button
                      className="btn btn-primary"
                      style="width:100%;justify-content:center;margin-top:10px;"
                      onClick={applyStatusChange()}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Aplicar Status
                    </button>
                  </div>
                </div>

                {/* Progress stepper */}
                <div className="status-card">
                  <div className="status-card-header">
                    <svg
                      style="width:12px;height:12px;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Progresso da OS
                  </div>
                  <div className="status-card-body">
                    <div className="stepper" id="editStepper"></div>
                  </div>
                </div>

                {/* OS Info summary */}
                <div className="status-card">
                  <div className="status-card-header">
                    <svg
                      style="width:12px;height:12px;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Resumo da OS
                  </div>
                  <div
                    className="status-card-body"
                    id="editSummary"
                    style="padding:12px 16px;"
                  ></div>
                </div>

                {/* Activity log */}
                <div className="status-card">
                  <div className="status-card-header">
                    <svg
                      style="width:12px;height:12px;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Histórico de Atividades
                  </div>
                  <div className="status-card-body" style="padding:8px 16px;">
                    <div className="activity-log" id="editActivityLog"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* /content */}
      </div>{" "}
      {/* /main */}
      {/* ══ OS DETAIL PANEL ══ */}
      <div className="overlay" id="osOverlay" onClick={closePanel()}></div>
      <div className="side-panel" id="osPanel">
        <div className="sp-header">
          <div style="flex:1;min-width:0;">
            <div id="spBackToClient" style="display:none;margin-bottom:8px;">
              <button
                className="btn btn-ghost"
                style="padding:3px 8px;font-size:11px;gap:4px;"
                onClick={goBackToClient()}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style="width:11px;height:11px;"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Voltar à ficha do cliente
              </button>
            </div>
            <div
              style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:var(--accent);"
              id="spId"
            ></div>
            <div
              style="font-size:15px;font-weight:700;margin-top:3px;"
              id="spTitle"
            ></div>
            <div style="margin-top:6px;" id="spBadges"></div>
          </div>
          <button className="sp-close" onClick={closePanel()}>
            ×
          </button>
        </div>
        <div className="sp-body">
          <div
            className="sp-grid"
            style="margin-bottom:16px;"
            id="spMeta"
          ></div>
          <div className="sp-section">
            <div className="sp-label">Serviços</div>
            <div id="spServices"></div>
          </div>
          <div className="sp-section">
            <div className="sp-label">Peças & Materiais</div>
            <div id="spMaterials"></div>
          </div>
          <div className="sp-section">
            <div className="sp-label">Diagnóstico</div>
            <div
              className="sp-value"
              style="font-size:13px;line-height:1.6;color:var(--ink2);"
              id="spDesc"
            ></div>
          </div>
          <div className="sp-section">
            <div className="sp-label" style="margin-bottom:12px;">
              Acompanhamento
            </div>
            <div className="timeline" id="spTimeline"></div>
          </div>
        </div>
        <div className="sp-footer">
          <button
            className="btn btn-primary"
            style="flex:1;justify-content:center;"
            onClick={openEditFromPanel()}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar / Atualizar OS
          </button>
          <button
            className="btn btn-danger"
            onClick={confirmCancelOSFromPanel()}
          >
            Cancelar OS
          </button>
        </div>
      </div>
      {/* ══ CLIENT DETAIL PANEL ══ */}
      <div
        className="overlay"
        id="clientOverlay"
        onClick={closeClientPanel()}
      ></div>
      <div className="side-panel" id="clientPanel" style="width:500px;">
        <div className="client-panel-header">
          <div style="display:flex;align-items:center;gap:13px;margin-bottom:14px;">
            <div className="client-panel-avatar" id="cpAvatar"></div>
            <div style="flex:1;min-width:0;">
              <div
                style="font-size:17px;font-weight:700;line-height:1.2;"
                id="cpName"
              ></div>
              <div
                style="font-size:12px;color:var(--ink3);margin-top:3px;"
                id="cpSub"
              ></div>
            </div>
            <button className="sp-close" onClick={closeClientPanel()}>
              ×
            </button>
          </div>
          <div style="display:flex;gap:8px;" id="cpStats"></div>
        </div>
        <div className="sp-body" id="cpBody"></div>
        <div className="sp-footer">
          <button
            className="btn btn-secondary"
            onClick={openModalCarroComClienteFromPanel()}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Veículo
          </button>
          <button
            className="btn btn-primary"
            style="flex:1;justify-content:center;"
            id="cpNewOSBtn"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Nova OS para este cliente
          </button>
        </div>
      </div>
      {/* ══ MODAL: NOVO GRUPO ══ */}
      <div className="modal-overlay" id="modalNovoGrupo">
        <div className="modal" style="width:420px;">
          <div className="modal-header">
            <span className="modal-title" id="novoGrupoTitle">
              Novo Grupo de Serviços
            </span>
            <button className="sp-close" onClick={closeModal("modalNovoGrupo")}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="field">
              <label>Nome do Grupo *</label>
              <input
                type="text"
                className="input"
                id="novoGrupoNome"
                placeholder="Ex: Suspensão, Motor, Freios..."
                onkeydown="if(event.key==='Enter') saveNovoGrupo()"
              />
              <div style="font-size:11px;color:var(--ink3);margin-top:5px;">
                O grupo ficará disponível para organizar itens no catálogo.
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={closeModal("modalNovoGrupo")}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={saveNovoGrupo()}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Criar Grupo
            </button>
          </div>
        </div>
      </div>
      {/* ══ MODAL: NOVO CLIENTE ══ */}
      <div className="modal-overlay" id="modalCliente">
        <div className="modal">
          <div className="modal-header">
            <span className="modal-title">Novo Cliente</span>
            <button className="sp-close" onClick={closeModal("modalCliente")}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid" style="gap:13px;">
              <div className="field col-full">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  className="input"
                  id="novoClienteNome"
                  placeholder="Nome completo ou razão social"
                />
              </div>
              <div className="field">
                <label>Telefone</label>
                <input
                  type="text"
                  className="input"
                  id="novoClienteTel"
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="field">
                <label>Celular / WhatsApp</label>
                <input
                  type="text"
                  className="input"
                  id="novoClienteCel"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="field col-full">
                <label>Observações</label>
                <textarea
                  className="textarea"
                  id="novoClienteObs"
                  style="min-height:72px;"
                  placeholder="Informações relevantes sobre o cliente..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={closeModal("modalCliente")}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={saveNovoCliente()}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Salvar e Cadastrar Veículo
            </button>
          </div>
        </div>
      </div>
      {/* ══ MODAL: NOVO CARRO ══ */}
      <div className="modal-overlay" id="modalCarro">
        <div className="modal" style="width:560px;">
          <div className="modal-header">
            <span className="modal-title">Cadastrar Veículo</span>
            <button className="sp-close" onClick={closeModal("modalCarro")}>
              ×
            </button>
          </div>
          <div className="modal-body">
            {/* Autocomplete cliente no modal carro */}
            <div className="field" style="margin-bottom:14px;">
              <label>Vincular ao Cliente (opcional)</label>
              <div className="ac-wrap" id="acCarModalWrap">
                <div className="ac-input-row">
                  <span className="ac-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    className="ac-input"
                    id="acCarModalInput"
                    type="text"
                    placeholder="Buscar cliente por nome..."
                    autocomplete="off"
                    oninput="acSearch('carModal',this.value)"
                    onfocus="acOpen('carModal')"
                    onkeydown="acKey(event,'carModal')"
                  />
                  <span
                    className="ac-clear"
                    id="acCarModalClear"
                    onClick={acClear("carModal")}
                  >
                    ×
                  </span>
                </div>
                <div className="ac-dropdown" id="acCarModalDropdown"></div>
              </div>
            </div>

            <div className="form-grid g3" style="gap:13px;">
              <div className="field">
                <label>Tipo *</label>
                <select className="select">
                  <option value="">Selecione...</option>
                  <option>Carro de Passeio</option>
                  <option>SUV / Crossover</option>
                  <option>Picape</option>
                  <option>Caminhonete</option>
                  <option>Van / Minivan</option>
                  <option>Ônibus / Micro</option>
                  <option>Caminhão</option>
                  <option>Moto</option>
                </select>
              </div>
              <div className="field">
                <label>Placa *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="ABC-1D23"
                  style="text-transform:uppercase;"
                  maxlength="8"
                />
              </div>
              <div className="field">
                <label>Ano</label>
                <input type="text" className="input" placeholder="2022/2023" />
              </div>
              <div className="field">
                <label>Marca</label>
                <input type="text" className="input" placeholder="Ex: Honda" />
              </div>
              <div className="field">
                <label>Modelo</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Civic EXL"
                />
              </div>
              <div className="field">
                <label>Cor</label>
                <input type="text" className="input" placeholder="Prata" />
              </div>
              <div className="field">
                <label>Km na Entrada</label>
                <input type="text" className="input" placeholder="52.300" />
              </div>
              <div className="field col-2">
                <label>Data / Hora de Entrada na Oficina</label>
                <input
                  type="datetime-local"
                  className="input"
                  id="carEntradaDt"
                />
              </div>
              <div className="field col-full">
                <label>Observações do Veículo</label>
                <textarea
                  className="textarea"
                  style="min-height:60px;"
                  placeholder="Histórico, modificações, particularidades..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={closeModal("modalCarro")}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={saveModal(
                "modalCarro",
                "Veículo salvo!",
                "Cadastro de veículo registrado.",
              )}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Salvar Veículo
            </button>
          </div>
        </div>
      </div>
      <div className="toast" id="toast">
        <div style="width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0;"></div>
        <div>
          <div className="toast-title" id="toastTitle">
            Sucesso
          </div>
          <div className="toast-sub" id="toastSub"></div>
        </div>
      </div>
    </>
  );
}

export default App;
