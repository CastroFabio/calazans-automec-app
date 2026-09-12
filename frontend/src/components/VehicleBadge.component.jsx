const VehicleBadge = ({ vehicle }) => {
  return (
    <span className="car-tag-group">
      <span className="svc-tag car-tag-placa">{vehicle.license_plate}</span>
      <span
        className={` ${vehicle.brand === null && vehicle.model === null ? "" : "svc-tag car-tag-model"}`}
      >
        {`${vehicle.brand ? vehicle.brand : ""} ${vehicle.model ? vehicle.model : ""}`}
      </span>
    </span>
  );
};

export default VehicleBadge;
