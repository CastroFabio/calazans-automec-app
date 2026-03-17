import NavBar from "./components/navBar";
import ServiceOrderList from "./components/serviceOrderList";
import SideBar from "./components/sideBar";

const App = () => {
  return (
    <>
      <SideBar />
      <div className="main">
        <NavBar />
        <div className="content">
          <ServiceOrderList />
        </div>
      </div>
    </>
  );
};

export default App;
