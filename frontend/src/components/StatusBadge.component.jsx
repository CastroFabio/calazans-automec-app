const StatusBadge = ({ reverseMapBadge, reverseMap }) => {
  return <span className={`badge badge-${reverseMapBadge}`}>{reverseMap}</span>;
};

export default StatusBadge;
