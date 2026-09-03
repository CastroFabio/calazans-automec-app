const ItemGroupHeader = ({ category }) => {
  return (
    <div className="page-header">
      <div>
        <div className="ph-sub">
          {`Catálogo de ${category === "material" ? "materiais" : "serviços de manutenção "} disponíveis na oficina`}
        </div>
      </div>
    </div>
  );
};

export default ItemGroupHeader;
