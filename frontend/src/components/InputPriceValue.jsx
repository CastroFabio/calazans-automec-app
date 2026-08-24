const InputPriceValue = ({ labor_job, handleFormFieldChange }) => {
  return (
    <div className="form-grid g3 form-grid-input-price">
      <div className="field col-full">
        <label>Mão de Obra Total</label>
        <div className="input-prefix input-prefix-price">
          <span>R$</span>
          <input
            type="text"
            id="moInput"
            className="input"
            placeholder="0,00"
            value={labor_job || ""}
            onChange={(e) => handleFormFieldChange("labor_job", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InputPriceValue;
