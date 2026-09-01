const InputPriceValue = ({ labor_cost, handleFormFieldChange }) => {
  return (
    <div className="form-grid g3 form-grid-input-price form-grid-input-price-container">
      <label className="form-grid-input-price-label">Mão de Obra</label>
      <div className="input-prefix input-prefix-price">
        <span>R$</span>
        <input
          type="text"
          id="moInput"
          className="input"
          placeholder="0,00"
          value={labor_cost || ""}
          onChange={(e) => handleFormFieldChange("labor_cost", e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputPriceValue;
