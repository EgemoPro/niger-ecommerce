import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store.js";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import Router from "./routes/main.routes";
import { fetchInitialData } from "./redux/Slices/initialData.js";
import { checkAuth } from "./redux/Slices/authSlice.js";
import { setFavorites } from "./redux/Slices/userSlice.js";
import "./index.css";

const router = Router();
const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((st) => st.auth);

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(setFavorites(user.payload.favorites));
  }, [dispatch, user]);
  return <RouterProvider router={router} />;
};
export default App;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
