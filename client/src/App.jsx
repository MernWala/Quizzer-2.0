import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./route.config.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiState from "./context/api/ApiState";
import CommonState from "./context/common/CommonState";
import { Toaster } from "react-hot-toast";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
    });
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ApiState>
        <CommonState>
          <RouterProvider router={router} />
        </CommonState>
      </ApiState>
    </>
  );
};

export default App;
