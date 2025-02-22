import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import Router from "./routes/main.routes";
import "./index.css";

const router = Router()

const App = () => <RouterProvider router={router} />;
export default App;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
