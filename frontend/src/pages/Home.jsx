import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../utils/paths";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page active" id="page-home">
      <div className="home-page">
        <div className="home-greeting">
          <div className="home-greeting-title">
            Calazans<span className="home-greeting-accent"> Auto</span>mec
          </div>
          <div className="home-greeting-sub">
            O que você precisa fazer hoje?
          </div>
        </div>
        <div className="home-grid">
          {/* Card 1: Nova OS */}
          <div
            className="home-card home-card-primary"
            onClick={() => navigate(PATHS.newServiceOrder)}
          >
            <div className="home-card-icon home-card-icon-background">
              <svg fill="none" stroke="white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="home-card-label">Nova OS</div>
            <div className="home-card-sub">Abrir OS de cliente</div>
          </div>

          {/* Card 2: Novo Cliente */}
          <div className="home-card home-card-primary">
            <div className="home-card-icon home-card-icon-background-customer">
              <svg fill="none" stroke="white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div className="home-card-label">Novo Cliente</div>
            <div className="home-card-sub">Cadastrar cliente</div>
          </div>

          {/* Card 3: Novo Veículo */}
          <div className="home-card home-card-primary">
            <div className="home-card-icon home-card-icon-background-vehicle">
              <svg fill="none" stroke="white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="home-card-label">Novo Veículo</div>
            <div className="home-card-sub">Cadastrar veículo</div>
          </div>

          {/* Outros cards da lista mantidos abaixo... */}
          <div
            className="home-card"
            onClick={() => navigate(PATHS.serviceOrder)}
          >
            {/* <div className="home-card-count" id="homeCountOS">
              —
            </div> */}
            <div className="home-card-icon home-card-icon-background-os">
              <svg fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="home-card-label">Ordens de Serviço</div>
            <div className="home-card-sub">Ver e buscar todas as OS</div>
          </div>

          <div className="home-card" onClick={() => navigate(PATHS.customer)}>
            {/* <div className="home-card-count" id="homeCountClientes">
              —
            </div> */}
            <div className="home-card-icon home-card-icon-background-customer-list">
              <svg fill="none" stroke="#10b981" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="home-card-label">Clientes</div>
            <div className="home-card-sub">Fichas e veículos</div>
          </div>

          <div
            className="home-card"
            onClick={() => navigate(PATHS.serviceOrder)}
          >
            {/* <div className="home-card-count" id="homeCountPending">
              —
            </div> */}
            <div className="home-card-icon home-card-icon-background-awaiting-payment">
              <svg fill="none" stroke="#ca8a04" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="home-card-label">A receber</div>
            <div className="home-card-sub">OS aguardando pagamento</div>
          </div>

          <div className="home-card" onClick={() => navigate(PATHS.services)}>
            <div className="home-card-icon home-card-icon-background-services">
              <svg fill="none" stroke="#8b5cf6" viewBox="0 0 24 24">
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
            <div className="home-card-label">Serviços</div>
            <div className="home-card-sub">Catálogo da oficina</div>
          </div>

          <div className="home-card" onClick={() => navigate(PATHS.materials)}>
            <div className="home-card-icon home-card-icon-background-material">
              <svg fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="home-card-label">Materiais & Peças</div>
            <div className="home-card-sub">Estoque e fornecedores</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
