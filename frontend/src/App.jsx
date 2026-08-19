import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from "./components/navBar";
import SideBar from "./components/sideBar";

import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import MaintenanceJobs from "./pages/MaintenanceJobs";
import Materials from "./pages/Materials";
import ServiceOrderList from "./pages/serviceOrderList";
import NewServiceOrder from "./pages/NewServiceOrder";
import EditCustomer from "./pages/EditCustomer";
import EditServiceOrder from "./pages/EditServiceOrder";

import { CustomerProvider } from "./context/Customer.context";
import { ServiceOrderProvider } from "./context/ServiceOrder.context";
import PrintServiceOrder from "./pages/PrintServiceOrder";

const App = () => {
  return (
    <>
      <ServiceOrderProvider>
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
                  <Route
                    path="/customers/edit/:id"
                    element={<EditCustomer />}
                  />
                  <Route
                    path="/service-order/edit/:id"
                    element={<EditServiceOrder />}
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route
                    path="/service-order/:id/print"
                    element={<PrintServiceOrder />}
                  />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </CustomerProvider>
      </ServiceOrderProvider>
    </>
  );
};

export default App;
