import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page" id="page-not-found">
      <div className="not-found-container">
        <div className="not-found-container-404">404</div>
        <div className="not-found-container-text">Página não encontrada</div>
        <div className="not-found-container-text-expl">
          A página que você tentou acessar não existe ou foi movida.
        </div>
        <div className="not-found-button-container">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
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
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Ir para OS
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
