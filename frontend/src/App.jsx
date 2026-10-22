import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/navBar";
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
import { AuthProvider, useAuth } from "./context/Auth.context";
import { ProtectedRoute } from "./components/ProtectedRoute.component";
import Loading from "./pages/Loading";
import Dashboard from "./pages/Dashboard";
import NewServiceOrderWizard from "./pages/NewServiceOrderWizard";

// Componente para controlar o Layout dinamicamente de acordo com a rota
const MainLayout = () => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === PATHS.HOME;
  const isLoginPage = location.pathname === PATHS.LOGIN;
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {/* Exibe a SideBar apenas se NÃO estiver na rota "/" */}
      {isAuthenticated && !isHomePage && !isLoginPage && <SideBar />}

      <div className="main">
        <NavBar />
        <div className="content">
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.NOT_FOUND} element={<NotFound />} />

            {/* --- ROTAS PROTEGIDAS (Exigem Token) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path={PATHS.HOME} element={<Home />} />
              <Route
                path={PATHS.SERVICE_ORDERS.ROOT}
                element={<ServiceOrderList />}
              />
              <Route path={PATHS.CUSTOMERS.ROOT} element={<Customers />} />
              <Route path={PATHS.SERVICES} element={<MaintenanceJobs />} />
              <Route path={PATHS.MATERIALS} element={<Materials />} />
              <Route
                path={PATHS.SERVICE_ORDERS.NEW}
                element={<NewServiceOrderWizard />}
              />
              <Route path={PATHS.CUSTOMERS.EDIT} element={<EditCustomer />} />
              <Route
                path={PATHS.SERVICE_ORDERS.EDIT}
                element={<EditServiceOrder />}
              />
              <Route
                path={PATHS.SERVICE_ORDERS.PRINT}
                element={<PrintServiceOrder />}
              />
              <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ServiceOrderProvider>
        <CustomerProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </CustomerProvider>
      </ServiceOrderProvider>
    </AuthProvider>
  );
};

export default App;
