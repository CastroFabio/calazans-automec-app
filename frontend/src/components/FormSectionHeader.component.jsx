import React from "react";

const FormSectionHeader = ({ title, icon: Icon }) => {
  return (
    <div className="fs-header">
      {Icon && typeof Icon === "function" ? (
        <Icon className="fs-header-svg" />
      ) : (
        Icon
      )}
      <span className="fs-title">{title}</span>
    </div>
  );
};

export default FormSectionHeader;
