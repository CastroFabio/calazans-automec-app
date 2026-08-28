import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../utils/paths";

const IdleRedirectManager = ({ children }) => {
  const navigate = useNavigate();

  // Tempo de inatividade em milissegundos (ex: 5 minutos = 300000ms)
  const timeoutMs = 5 * 60 * 1000;

  const handleOnIdle = () => {
    navigate(PATHS.home);
  };

  const idleTimer = useIdleTimer({
    timeout: timeoutMs,
    onIdle: handleOnIdle,
    debounce: 500, // Evita execuções excessivas durante eventos contínuos
  });

  return <>{children}</>;
};

export default IdleRedirectManager;
