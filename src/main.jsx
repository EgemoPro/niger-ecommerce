import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/reducer.js";

import Home from "./pages/home/home.jsx";
import Products from "./pages/products/Products.jsx";
import OrderTable from "./pages/orders/order-table-component.jsx";
import "./index.css";
import PageProduitSweater from "./components/page-produit-sweater.jsx";
import ErrorProductSweater from "./pages/errors/ErrorProductSweater.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Products />,
      },
      {
        path: ":id",
        element: <PageProduitSweater />,
        errorElement: <ErrorProductSweater/>,
        // loader: async ({ params }) => {
        //   const response = await fetch(`https://fakestoreapi.com/products/${params.id}`);
        //   const data = await response.json();
        //   return data;
        // }
      },
    ],
  },
  {
    path: "/orders",
    element: <OrderTable />,
  },
]);

const App = () => <RouterProvider router={router} />;

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
