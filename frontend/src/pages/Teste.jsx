import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Teste = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: "Title",
    contentRef: componentRef,
    // A MÁGICA AQUI: Desvincula completamente os CSS externos e globais do seu app
    ignoreGlobalStyles: true,
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* 
        Elemento isolado. Como limpamos o CSS global, aplicamos 
        estilos inline explícitos para o papel (cor preta e bloco visível).
      */}
      <div
        ref={componentRef}
        style={{
          display: "block",
          color: "#000000",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
          padding: "10px",
          fontWeight: "bold",
        }}
      >
        <p style={{ margin: 0, fontSize: "16px" }}>Teste</p>
      </div>

      <button
        onClick={() => handlePrint()}
        className="btn btn-primary"
        style={{ marginTop: "15px" }}
      >
        Print
      </button>
    </div>
  );
};

export default Teste;
