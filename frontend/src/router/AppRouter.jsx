import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// ... আপনার বাকি ইমপোর্টগুলো আগের মতোই থাকবে

// Auth হুকটি ইমপোর্ট করুন
import { useAuth } from "../context/AuthContext"; 

const router = createBrowserRouter([
  // ... আপনার রাউটার কনফিগারেশন হুবহু একই থাকবে
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
      { path: "inventory", element: <CheckStock /> },
      { path: "drawer-report", element: <DrawerReport /> },
    ],
  },
]);

const AppRouter = () => {
  const { isLoading } = useAuth();

  // অ্যাপ লোড হওয়ার সময় রিফ্রেশ লুপ বা এরর রোধ করতে এটি নিশ্চিত করুন
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return <RouterProvider router={router} />;
};

export default AppRouter;