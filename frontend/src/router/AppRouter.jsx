import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavbarLayout from "../layouts/NavbarLayout";
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import Loging from "../pages/Loging";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../layouts/AdminProfile";
import UserProfile from './../layouts/UserProfile';

// Salesman Pages
import SalesDashboard from './../pages/salesman/SalesDashboard';
import CreateOrder from './../pages/salesman/CreateOrder';
import SalesHistory from './../pages/salesman/SalesHistory';
import CheckStock from './../pages/salesman/CheckStock';
import OpenShift from './../pages/salesman/OpenShift';
import CloseShift from './../pages/salesman/CloseShift';

// ফিচার ইম্পোর্ট
import Category from "../features/categories/Category";
import Brand from "../features/brands/Brand";
import Unit from "../features/units/Unit";
import Product from "../features/product/Product";
import Supplier from "../features/supplier/Supplier";
import Expense from "../features/expense/Expense"; // আপনার প্যাথ অনুযায়ী ঠিক আছে

// কমন পেজ ইম্পোর্ট
import Waste from "../pages/common/Waste"; 
import Purchase from "../pages/common/Purchase"; 
import ProductDetails from "../features/product/ProductDetais";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Registration /> },
      { path: "/login", element: <Loging /> },

      // --- ADMIN ROUTES ---
      {
        path: "/admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <AdminProfile />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "categories", element: <Category /> },
          { path: "brands", element: <Brand /> },
          { path: "units", element: <Unit /> },
          { path: "suppliers", element: <Supplier /> },
          { path: "products", element: <Product /> },
          { path: "purchase", element: <Purchase /> },
          { path: "waste", element: <Waste /> }, 
          { path: "expenses", element: <Expense /> },
           // Admin এর জন্য অলরেডি ছিল
           { path:"products/getProduct/:id", element:<ProductDetails /> },
        ]
      },

      // --- SALESMAN ROUTES ---
      {
        path: "/salesman",
        element: (
          <ProtectedRoute role="SALESMAN">
            <UserProfile />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <SalesDashboard /> },
          { path: "dashboard", element: <SalesDashboard /> },
          { path: "open-shift", element: <OpenShift /> },
          { path: "close-shift", element: <CloseShift /> },
          { path: "new-order", element: <CreateOrder /> },
          { path: "my-sales", element: <SalesHistory /> },
          { path: "inventory", element: <CheckStock /> },
          { path: "purchase", element: <Purchase /> }, 
          { path: "waste", element: <Waste /> }, 
          // সেলসম্যানের জন্য এক্সপেন্স রুট নিশ্চিত করা হলো
          { path: "expenses", element: <Expense /> }, 
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;