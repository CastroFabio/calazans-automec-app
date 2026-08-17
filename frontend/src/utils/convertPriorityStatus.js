import { priorityReverseMap } from "./priorityMap";
import { statusReverseMap } from "./statusMap";

export const convertPriority = (priority) => {
  return priorityReverseMap[priority] || "Desconhecido";
};

export const convertStatus = (status) => {
  return statusReverseMap[status] || "Desconhecido";
};

export const getPriorityInfo = (priority) => {
  return {
    id: priority,
    label: priorityReverseMap[priority] || "Desconhecido",
  };
};

export const getStatusInfo = (status) => {
  return {
    id: status,
    label: statusReverseMap[status] || "Desconhecido",
  };
};

export const getStatusOptions = () => {
  return Object.entries(statusReverseMap).map(([id, label]) => ({
    id: Number(id),
    label,
  }));
};

export const getPriorityOptions = () => {
  return Object.entries(priorityReverseMap).map(([id, label]) => ({
    id: Number(id),
    label,
  }));
};
