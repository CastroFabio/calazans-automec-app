import logo from "../assets/LogoCalazansAutomec.png";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const toggleLoginSenha = () => {
    setShowPassword((prev) => !prev);
  };

  const doLogin = () => {
    if (!email || !password) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // Adicione aqui a chamada HTTP para autenticação backend (NestJS /auth/login)
  };

  return (
    <div id="login-page">
      <div className="login-card">
        {/* <div className="login-logo">
          Mecânica<span>OS</span>
        </div> */}
        <img
          src={logo}
          alt="Logo Oficina"
          className="login-header-logo-image"
        />
        <div className="login-tagline">
          Gestão de oficina — faça login para continuar
        </div>

        <div
          id="loginError"
          className={`login-error ${showError ? "show" : ""}`}
        >
          E-mail ou senha incorretos.
        </div>

        <div className="form-group-email">
          <label className="login-label" htmlFor="loginEmail">
            E-mail
          </label>
          <input
            type="email"
            className="input input-full"
            id="loginEmail"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                document.getElementById("loginSenha")?.focus();
              }
            }}
          />
        </div>

        <div className="form-group-password">
          <label className="login-label" htmlFor="loginSenha">
            Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="input input-full input-password"
            id="loginSenha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doLogin();
            }}
          />
          <button
            type="button"
            className="btn-toggle-eye"
            onClick={toggleLoginSenha}
            tabIndex={-1}
          >
            <svg
              id="loginEyeIcon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        <button
          className="btn btn-primary btn-submit"
          onClick={doLogin}
          id="loginBtn"
        >
          Entrar
        </button>

        <div className="login-footer">
          Para testar: <strong>admin@mecanicaos.com.br</strong> /{" "}
          <strong>1234</strong>
        </div>
      </div>
    </div>
  );
}
