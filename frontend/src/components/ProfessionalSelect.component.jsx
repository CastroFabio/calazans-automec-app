const ProfessionalSelect = ({ handleFormFieldChange, professional }) => {
  return (
    <div className="field">
      <label>Técnico Responsável</label>
      <select
        className="select"
        value={professional}
        onChange={(e) => handleFormFieldChange("professional", e.target.value)}
      >
        <option value="">Selecione...</option>
        <option value="João Calazans">João Calazans</option>
        <option value="Wagner">Wagner</option>
        <option value="Leandro">Leandro</option>
        <option value="Marcio">Marcio</option>
      </select>
    </div>
  );
};

export default ProfessionalSelect;
