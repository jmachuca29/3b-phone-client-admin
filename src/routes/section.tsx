import { lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import DashboardLayout from "src/layouts/dashboard";

export const IndexPage = lazy(() => import("src/pages/app"));
export const LoginPage = lazy(() => import('src/pages/Login/Login'));
export const SalesPage = lazy(() => import('src/pages/Sales/Sales'));
export const Page404 = lazy(() => import('src/pages/Page-Not-Found/PageNotFound'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: "sales", element: <SalesPage /> }
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
