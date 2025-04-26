import { createBrowserRouter, Outlet } from "react-router-dom";
import HomePage from "../pages/home/home-page";
import ProductsPage from "../pages/products/products-page";
import ProductSweaterPage from "../pages/productSweater/producr-sweater-page";
import ErrorProductSweater from "../pages/productSweater/errors/ErrorProductSweater";
import OrderPage from "../pages/orders/order-page";
import UserPage from "../pages/user/user-page";
import Shop from "../pages/shop/shop-page";
import EditProfile from "../pages/user/sub-pages/edit-profile";
import General from "../pages/user/sub-pages/general";
import Password from "../pages/user/sub-pages/password";
import Payouts from "../pages/user/sub-pages/payouts";
import Notifications from "../pages/user/sub-pages/notifications";
import DataPrivacy from "../pages/user/sub-pages/data-privacy";
import DeleteAccount from "../pages/user/sub-pages/delete-account";
// import ShopDetails from "../pages/shop/ShopDetails";
// import {ShopAbout} from "@/components/shop/ShopAbout";
// import ShopProducts from "../pages/shop/shop/Products";
// import ShopPhotos from "../pages/shop/shop/Photos";
// import ShopReviews from "../pages/shop/shop/Reviews";
// import ShopFAQ from "../pages/shop/shop/FAQ";
// import ShopChat from "../pages/shop/shop/Chat";
// import ProductDetail from "../pages/shop/shop/ProductDetail";


const Router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/profile",
      element: <UserPage />,
      children: [
        {
          path: "general",
          element: <General />,
        },
        {
          path: "edit",
          element: <EditProfile />,
        },
        {
          path: "password",
          element: <Password />,
        },
        {
          path: "payouts",
          element: <Payouts />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "data",
          element: <DataPrivacy />,
        },
        {
          path: "delete",
          element: <DeleteAccount />,
        },
      ],
    },
    {
      path: "/shop",
      element: <Shop />,
      // children:[
      //   {
      //     path:":id",
      //     element:<Outlet/>,
      //     children:[
      //       {
      //         path:"about",
      //         element: <ShopAbout />
      //       },
      //       { 
      //         path: "products", 
      //         element: <ShopProducts /> 
      //       },
      //       { 
      //         path: "photos", 
      //         element: <ShopPhotos /> 
      //       },
      //       { 
      //         path: "reviews", 
      //         element: <ShopReviews /> 
      //       },
      //       { 
      //         path: "faq", 
      //         element: <ShopFAQ /> 
      //       },
      //       { 
      //         path: "chat", 
      //         element: <ShopChat /> 
      //       },
      //       { 
      //         path: "product/:productId", 
      //         element: <ProductDetail /> 
      //       }
      //     ],
      //   }
      // ]
    },
    {
      path: "/products",
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        {
          path: "",
          element: <ProductsPage />,
        },
        {
          path: ":id",
          element: <ProductSweaterPage />,
          errorElement: <ErrorProductSweater />,
        },
        {
          path: "orders",
          element: <OrderPage />,
        },
      ],
    },
  ]);
};

export default Router;
