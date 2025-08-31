import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 xl:ml-[7%] overflow-x-hidden">
          <div className="w-full max-w-none ">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
