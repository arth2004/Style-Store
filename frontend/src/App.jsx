import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer/>
      <div className="flex min-h-screen ">
        <Navigation />
        <main className="flex-1 p-4 pl-30">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
