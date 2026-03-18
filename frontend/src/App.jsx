import NavBar from "./components/navBar";
import ServiceOrderList from "./components/serviceOrderList";
import SideBar from "./components/sideBar";
import Customers from "./pages/Customers";

const App = () => {
  return (
    <>
      <SideBar />
      <div className="main">
        <NavBar />
        <div className="content">
          {/* <ServiceOrderList /> */}
          <Customers />
        </div>
      </div>
    </>
  );
};

export default App;
