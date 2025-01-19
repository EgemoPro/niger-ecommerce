import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/reducer.js";

import HomePage from "./pages/home/home-page.jsx";
import ProductsPage from "./pages/products/products-page.jsx";
import OrderPage from "./pages/orders/order-page.jsx";
import ProductSweaterPage from "./pages/productSweater/producr-sweater-page.jsx";
import ErrorProductSweater from "./pages/productSweater/errors/ErrorProductSweater.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/product",
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: "",
        element: <ProductsPage />,
        // loader: async () => {

        // }
      },
      {
        path: ":id",
        element: <ProductSweaterPage />,
        errorElement: <ErrorProductSweater />,
      },
    ],
  },
  {
    path: "/orders",
    element: <OrderPage />,
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
