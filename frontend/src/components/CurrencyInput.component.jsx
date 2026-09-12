const CurrencyInput = ({ value, handleFormFieldChange, label = null }) => {
  return (
    <div className="form-grid g3 form-grid-input-price form-grid-input-price-container">
      {label ? (
        <label className="form-grid-input-price-label">{label}</label>
      ) : (
        ""
      )}
      <div className="input-prefix input-prefix-price">
        <span>R$</span>
        <input
          type="text"
          id="moInput"
          className="input"
          placeholder="0,00"
          value={value || ""}
          onChange={handleFormFieldChange}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
