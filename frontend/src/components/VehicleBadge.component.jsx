const VehicleBadge = ({ vehicle }) => {
  return (
    <span className="car-tag-group">
      <span className="svc-tag car-tag-placa">{vehicle.license_plate}</span>
      <span className="svc-tag car-tag-model">
        {`${vehicle.brand} ${vehicle.model}`}
      </span>
    </span>
  );
};

export default VehicleBadge;
