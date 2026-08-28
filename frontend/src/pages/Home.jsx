import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../utils/paths";
import NewCustomerModal from "../components/NewCustomerModal.component";
import { useCustomers } from "../context/Customer.context";
import NewVehicleModal from "../components/NewVehicleModal.component";

const Home = () => {
  const navigate = useNavigate();

  const { customers } = useCustomers();

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const openCustomerModal = () => setIsCustomerModalOpen(true);
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const openVehicleModal = () => setIsVehicleModalOpen(true);
  const closeVehicleModal = () => setIsVehicleModalOpen(false);

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

          {/* Card 2: Novo Cliente */}
          <div
            className="home-card home-card-primary"
            onClick={openCustomerModal}
          >
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
          <div
            className="home-card home-card-primary"
            onClick={openVehicleModal}
          >
            <div className="home-card-icon home-card-icon-background-vehicle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />

                <path d="M18 2v6" />
                <path d="M15 5h6" />
              </svg>
            </div>
            <div className="home-card-label">Novo Veículo</div>
            <div className="home-card-sub">Cadastrar veículo</div>
          </div>

          <div
            className="home-card home-card-primary"
            onClick={() => navigate(PATHS.newServiceOrder)}
          >
            <div className="home-card-icon home-card-icon-background">
              <svg
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                {/* Prancheta (com a quina inferior direita aberta) */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h5M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M19 12V7a2 2 0 00-2-2h-2"
                />
                {/* Sinal de + (afastado no canto inferior) */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 19h5m-2.5-2.5v5"
                />
              </svg>
            </div>
            <div className="home-card-label">Nova Ordem de Serviço</div>
            <div className="home-card-sub">
              Abrir Ordem de Serviço de cliente
            </div>
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
      {isCustomerModalOpen && (
        <NewCustomerModal
          isOpen={isCustomerModalOpen}
          onClose={closeCustomerModal}
        />
      )}
      {isVehicleModalOpen && (
        <NewVehicleModal
          isModalOpen={isVehicleModalOpen}
          onClose={closeVehicleModal}
        />
      )}
    </div>
  );
};

export default Home;
