import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar";
import SideBar from "./components/sideBar";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import MaintenanceJobs from "./pages/MaintenanceJobs";
import Materials from "./pages/Materials";
import ServiceOrderList from "./pages/serviceOrderList";
import NewServiceOrder from "./pages/NewServiceOrder";
import NestedListForm from "./pages/Teste";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <SideBar />
        <div className="main">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<ServiceOrderList />} />
              {/* <Route path="/customers" element={<Customers />} />
              <Route path="/services" element={<MaintenanceJobs />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/neworder" element={<NewServiceOrder />} />
              <Route path="/teste" element={<NestedListForm />} />
              <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
