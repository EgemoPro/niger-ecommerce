import { createBrowserRouter, Outlet } from "react-router-dom";
import HomePage from "../pages/home/home-page";
import ProductsPage from "../pages/products/products-page";
import ProductSweaterPage from "../pages/productSweater/producr-sweater-page";
import ErrorProductSweater from "../pages/productSweater/errors/ErrorProductSweater";
import OrderPage from "../pages/orders/order-page";
import UserPage from "../pages/user/user-page";
// import Shop from "../pages/shop/shop-page";
import EditProfile from "../pages/user/sub-pages/edit-profile";
import General from "../pages/user/sub-pages/general";
import Password from "../pages/user/sub-pages/password";
import Payouts from "../pages/user/sub-pages/payouts";
import Notifications from "../pages/user/sub-pages/notifications";
import DataPrivacy from "../pages/user/sub-pages/data-privacy";
import DeleteAccount from "../pages/user/sub-pages/delete-account";
import Index from "../pages/shop/Index";
import NotFound from "../pages/shop/NotFound";
import ShopLayout from "../layouts/ShopLayout";
import ShopAboutPage from "../pages/shop/shop-components/AboutPage";
import ShopProductsPage from "../pages/shop/shop-components/ProductsPage";
import ShopPhotosPage from "../pages/shop/shop-components/PhotosPage";
import ShopReviewsPage from "../pages/shop/shop-components/ReviewsPage";
import ShopFAQPage from "../pages/shop/shop-components/FAQPage";
import ShopChatPage from "../pages/shop/shop-components/ChatPage";
import ProductDetailPage from "../pages/shop/shop-components/ProductDetailPage";



const Router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
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
      errorElement: <NotFound />,
      children:[
        {
          path: "",
          element: <Index />
        },
        {
          path: ":id/*",
          element: <ShopLayout />,
          children: [
            {
              path: "about",
              element: <ShopAboutPage />,
            },
            {
              path: "products",
              element: <ShopProductsPage />,
            },
            {
              path: "photos",
              element: <ShopPhotosPage />,
            },
            {
              path: "reviews",
              element: <ShopReviewsPage />,
            },
            {
              path: "faq",
              element: <ShopFAQPage />,
            },
            {
              path: "chat",
              element: <ShopChatPage />,
            },
            {
              path: "product/:productId",
              element: <ProductDetailPage />,
            },
          ],
        },
      ]
    },
    
  ]);
};

export default Router;
