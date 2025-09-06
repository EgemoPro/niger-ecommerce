import { useEffect } from "react";
import Router from "./routes/main.routes";
import { Provider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store.js";
import { createRoot } from "react-dom/client";
import { checkAuth } from "./redux/Slices/authSlice.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import "./index.css";


const router = Router();
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    if (!!localStorage.getItem("jwt")) {
      dispatch(checkAuth());
    }

  }, [dispatch]);



  return <RouterProvider router={router} />;
};

export default App;

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
