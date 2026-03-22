import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar";
import ServiceOrderList from "./components/serviceOrderList";
import SideBar from "./components/sideBar";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";

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
              <Route path="/customers" element={<Customers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
