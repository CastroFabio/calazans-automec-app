import { useNavigate } from "react-router-dom";

const SideBarList = ({ categoryName, tabsDataCategory, isActive }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="nav-label">{categoryName}</div>
      {tabsDataCategory.map((tab, index) => (
        <div
          className={`nav-item ${isActive(tab.navigateURL)}`}
          onClick={() => {
            navigate(tab.navigateURL);
          }}
          key={index}
        >
          {tab.svgIcon}
          {tab.title}
          <span className="nav-count" id="osCount">
            {tab.numberOf}
          </span>
        </div>
      ))}
    </>
  );
};

export default SideBarList;
