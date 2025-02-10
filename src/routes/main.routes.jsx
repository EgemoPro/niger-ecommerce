
import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from '../pages/home/home-page';
import ProductsPage from '../pages/products/products-page';
import ProductSweaterPage from '../pages/productSweater/producr-sweater-page';
import ErrorProductSweater from '../pages/productSweater/errors/ErrorProductSweater';
import OrderPage from '../pages/orders/order-page';


const Router = () => {

  return createBrowserRouter([
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
  
}

export default Router