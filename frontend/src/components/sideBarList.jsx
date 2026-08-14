import { useNavigate } from "react-router-dom";

const SideBarList = ({ categoryName, tabsDataCategory, isActive }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="nav-label">{categoryName}</div>
      {tabsDataCategory.map((tab, index) => (
        <div
          className={`nav-item ${isActive(tab.path) ? "active" : ""}`}
          onClick={() => {
            navigate(tab.path);
          }}
          key={index}
        >
          {tab.icon}
          {tab.title}
          {tab.count !== null && tab.count !== undefined && (
            <span className={`nav-count`} id="osCount">
              {tab.count}
            </span>
          )}
        </div>
      ))}
    </>
  );
};

export default SideBarList;
