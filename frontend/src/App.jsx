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
import NewCustomer from "./pages/NewCustomer";
import NewVehicle from "./pages/NewVehicle";
import { CustomerProvider } from "./context/Customer.context";
import UpdateCustomer from "./pages/UpdateCustomer";

const App = () => {
  return (
    <>
      <CustomerProvider>
        <BrowserRouter>
          <SideBar />
          <div className="main">
            <NavBar />
            <div className="content">
              <Routes>
                <Route path="/" element={<ServiceOrderList />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/services" element={<MaintenanceJobs />} />
                <Route path="/materials" element={<Materials />} />
                <Route
                  path="/new-service-order"
                  element={<NewServiceOrder />}
                />
                <Route path="/new-customer" element={<NewCustomer />} />
                <Route path="/new-vehicle" element={<NewVehicle />} />
                <Route path="/update-customer" element={<UpdateCustomer />} />
                {/*<Route path="/teste" element={<NestedListForm />} />*/}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CustomerProvider>
    </>
  );
};

export default App;
