import { useEffect } from "react";
import Router from "./routes/main.routes";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store.js";
import { createRoot } from "react-dom/client";
import { checkAuth } from "./redux/Slices/authSlice.js";
import { setFavorites } from "./redux/Slices/userSlice.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {fetchProducts,setPage } from "./redux/Slices/initialData.js";

import "./index.css";
// import "./App.css"
import { Toaster } from "sonner";


const router = Router();
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((st) => st.auth);
  const { data, status, error, pagination } = useSelector((state) => state.data)
  
  
  
 useEffect(()=>{
  dispatch(fetchProducts({}))
 }, [dispatch])

 

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(setFavorites(user.payload.favorites));
  }, [dispatch, user]);

  // console.log(data)

  return <RouterProvider router={router} />;
};

export default App;

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Toaster/>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
