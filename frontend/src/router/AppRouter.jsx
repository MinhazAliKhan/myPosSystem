import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NavbarLayout from "../layouts/NavbarLayout";
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import Loging from "../pages/Loging";
import ProtectedRoute from "../components/ProtectedRoute";

// ADMIN & LAYOUT
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../layouts/AdminProfile";
import UserProfile from "../layouts/UserProfile";

// SALESMAN
import SalesDashboard from "../pages/salesman/SalesDashboard";
import CreateOrder from "../pages/salesman/CreateOrder";
import SalesHistory from "../pages/salesman/SalesHistory";
import CheckStock from "../pages/salesman/CheckStock";
import Management from "../pages/salesman/Management";
import OpenShift from "../pages/salesman/shift/OpenShift";
import CloseShift from "../pages/salesman/shift/CloseShift";
import OpenDrawer from "../pages/salesman/drawer/OpenDrawer";
import CloseDrawer from "../pages/salesman/drawer/CloseDrawer";
import DrawerReport from '../pages/salesman/drawer/DrawerReport';

// KITCHEN
import KitchenOrderList from "../pages/kitchen/KitchenOrderList";

// FEATURES
import Category from "../features/categories/Category";
import Brand from "../features/brands/Brand";
import Unit from "../features/units/Unit";
import Product from "../features/product/Product";
import Supplier from "../features/supplier/Supplier";
import Expense from "../features/expense/Expense";
import Waste from "../pages/common/Waste";
import Purchase from "../pages/common/Purchase";
import ProductDetails from "../features/product/ProductDetais";

// রিপোর্ট ফিচার ফাইলসমূহ
import DrawerReportAdmin from "../features/report/DrawerReport";
import ShiftReport from "../features/report/ShiftReport";
import DailySummery from "../features/report/DailySummery";
import SaleDetails from './../pages/salesman/SaleDetails';
import Refund from "../pages/common/refund/Refund";


const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Registration /> },
      { path: "login", element: <Loging /> },
      {
        path: "admin",
        element: <ProtectedRoute role="ADMIN"><AdminProfile /></ProtectedRoute>,
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
          { path: "drawer-report", element: <DrawerReportAdmin /> },
          { path: "shift-report", element: <ShiftReport /> },
          { path: "daily-summary-report", element: <DailySummery /> },
          { path: "products/getProduct/:id", element: <ProductDetails /> },
        ],
      },
    ],
  },
  {
    path: "kitchen",
    element: <ProtectedRoute role="KITCHEN"><UserProfile /></ProtectedRoute>,
    children: [
      { index: true, element: <KitchenOrderList /> },
      { path: "dashboard", element: <KitchenOrderList /> },
    ],
  },
  {
    path: "salesman",
    element: <ProtectedRoute role="SALESMAN"><UserProfile /></ProtectedRoute>,
    children: [
      { index: true, element: <CreateOrder /> },
      { path: "manage", element: <Management /> },
      { path: "dashboard", element: <SalesDashboard /> },
      { path: "open-shift", element: <OpenShift /> },
      { path: "close-shift", element: <CloseShift /> },
      { path: "open-drawer", element: <OpenDrawer /> },
      { path: "drawer/:id/close", element: <CloseDrawer /> },
      { path: "my-sales", element: <SalesHistory /> },
      { path: "sales/:id", element: <SaleDetails /> },
      { path: "inventory", element: <CheckStock /> },
      { path: "drawer-report", element: <DrawerReport /> },
      { path: "refunds", element: <Refund /> },
      { path: "expenses", element: <Expense /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;