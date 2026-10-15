const WizardStepper = () => {
  const wzGoto = (step) => {
    return step
  }

  return (
    <div className="wz-bar">
      <button className="wz-step active" id="wzBtn0" onClick={() => wzGoto(0)}>
        <div className="wz-step-num">1</div>
        <div className="wz-step-label">Cliente</div>
      </button>
      <div className="wz-connector"></div>
      <button className="wz-step" id="wzBtn1" onClick={() => wzGoto(1)}>
        <div className="wz-step-num">2</div>
        <div className="wz-step-label">Serviços</div>
      </button>
      <div className="wz-connector"></div>
      <button className="wz-step" id="wzBtn2" onClick={() => wzGoto(2)}>
        <div className="wz-step-num">3</div>
        <div className="wz-step-label">Detalhes</div>
      </button>
      <div className="wz-connector"></div>
      <button className="wz-step" id="wzBtn3" onClick={() => wzGoto(3)}>
        <div className="wz-step-num">4</div>
        <div className="wz-step-label">Pagamento</div>
      </button>
      <div className="wz-connector"></div>
      <button className="wz-step" id="wzBtn4" onClick={() => wzGoto(4)}>
        <div className="wz-step-num">5</div>
        <div className="wz-step-label">Resumo</div>
      </button>
    </div>
  )
}

export default WizardStepper
