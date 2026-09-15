import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/navBar";
import IdleRedirectManager from "./components/IdleRedirectManager.component";
import SideBar from "./components/sideBar";

import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import MaintenanceJobs from "./pages/MaintenanceJobs";
import Materials from "./pages/Materials";
import ServiceOrderList from "./pages/ServiceOrderList";
import NewServiceOrder from "./pages/NewServiceOrder";
import EditCustomer from "./pages/EditCustomer";
import EditServiceOrder from "./pages/EditServiceOrder";
import PrintServiceOrder from "./pages/PrintServiceOrder";
import Home from "./pages/Home";
import Login from "./pages/Login";

import { CustomerProvider } from "./context/Customer.context";
import { ServiceOrderProvider } from "./context/ServiceOrder.context";

import { PATHS } from "./utils/paths";

// Componente para controlar o Layout dinamicamente de acordo com a rota
const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === PATHS.home;
  const isLoginPage = location.pathname === PATHS.login;

  return (
    <>
      {/* Exibe a SideBar apenas se NÃO estiver na rota "/" */}
      {!isHomePage && !isLoginPage && <SideBar />}

      <div className="main">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path={PATHS.home} element={<Home />} />
            <Route path={PATHS.serviceOrder} element={<ServiceOrderList />} />
            <Route path={PATHS.customer} element={<Customers />} />
            <Route path={PATHS.services} element={<MaintenanceJobs />} />
            <Route path={PATHS.materials} element={<Materials />} />
            <Route path={PATHS.newServiceOrder} element={<NewServiceOrder />} />
            <Route path={PATHS.editCustomer} element={<EditCustomer />} />
            <Route
              path={PATHS.editServiceOrder}
              element={<EditServiceOrder />}
            />
            <Route path={PATHS.notFound} element={<NotFound />} />
            <Route path={PATHS.login} element={<Login />} />
            <Route
              path={PATHS.printServiceOrder}
              element={<PrintServiceOrder />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <ServiceOrderProvider>
      <CustomerProvider>
        <BrowserRouter>
          <IdleRedirectManager>
            <MainLayout />
          </IdleRedirectManager>
        </BrowserRouter>
      </CustomerProvider>
    </ServiceOrderProvider>
  );
};

export default App;
