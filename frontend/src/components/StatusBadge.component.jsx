import { statusReverseMap, statusReverseMapBadge } from "../utils/statusMap";

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`badge badge-${statusReverseMapBadge[status] || "default"}`}
    >
      {statusReverseMap[status]}
    </span>
  );
};

export default StatusBadge;
