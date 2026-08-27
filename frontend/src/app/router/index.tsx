import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AdminRoute } from "@/app/router/AdminRoute";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { RouteError } from "@/app/router/RouteError";
import { AnalyticsPage } from "@/features/analytics/AnalyticsPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { ActivityLogsPage } from "@/features/activity-logs/ActivityLogsPage";
import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { CustomersPage } from "@/features/customers/CustomersPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { DashboardsPage } from "@/features/dashboards/DashboardsPage";
import { DashboardDetailPage } from "@/features/dashboards/DashboardDetailPage";
import { EmployeesPage } from "@/features/employees/EmployeesPage";
import { InventoryPage } from "@/features/inventory/InventoryPage";
import { KpisPage } from "@/features/kpis/KpisPage";
import { NotificationsPage } from "@/features/notifications/NotificationsPage";
import { OrdersPage } from "@/features/orders/OrdersPage";
import { PaymentsPage } from "@/features/payments/PaymentsPage";
import { ProductsPage } from "@/features/products/ProductsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { ReportsIndex } from "@/features/reports/ReportsIndex";
import { RolesPage } from "@/features/roles/RolesPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { SuppliersPage } from "@/features/suppliers/SuppliersPage";
import { UsersPage } from "@/features/users/UsersPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "dashboards", element: <DashboardsPage /> },
      { path: "dashboards/:id", element: <DashboardDetailPage /> },
      { path: "reports", element: <ReportsIndex /> },
      { path: "kpis", element: <KpisPage /> },
      {
        path: "users",
        element: (
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        ),
      },
      { path: "customers", element: <CustomersPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "suppliers", element: <SuppliersPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "employees", element: <EmployeesPage /> },
      {
        path: "roles",
        element: (
          <AdminRoute>
            <RolesPage />
          </AdminRoute>
        ),
      },
      {
        path: "activity-logs",
        element: (
          <AdminRoute>
            <ActivityLogsPage />
          </AdminRoute>
        ),
      },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
