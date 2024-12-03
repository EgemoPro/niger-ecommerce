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
        loader: async () => {
          try {
            const response = await fetch('https://fakestoreapi.com/products');
            
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des données');
            }

            const apiData = await response.json();
            const globalState = store.getState();
            const state = [...globalState.data];

            if (!state.length) {
              throw new Error('État initial non disponible');
            }

            return state.map((item, index) => {
              if (index < apiData.length) {
                return {
                  ...item,
                  title: apiData[index].title,
                  originalPrice: apiData[index].price,
                  images: [apiData[index].image],
                  description: apiData[index].description, 
                  category: apiData[index].category
                };
              }
              return item;
            });

          } catch (error) {
            console.error('Erreur dans le loader:', error);
            throw error;
          }
        }
      },
      {
        path: ":id",
        element: <PageProduitSweater />,
        errorElement: <ErrorProductSweater/>
      },
    ],
  },
  {
    path: "/orders",
    element: <OrderTable />,
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
