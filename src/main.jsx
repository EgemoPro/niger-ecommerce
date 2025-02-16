import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {Toaster} from "./components/ui/toaster.jsx"
import { Provider } from "react-redux";
import { store } from "./redux/reducer.js";
import Router from "./routes/main.routes";
import "./index.css";

const router = Router()

const App = () => <RouterProvider router={router} />;
export default App;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
);
