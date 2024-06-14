import { lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import DashboardLayout from "src/layouts/dashboard";

export const IndexPage = lazy(() => import("src/pages/app"));
export const LoginPage = lazy(() => import('src/pages/Login/Login'));
export const SalesPage = lazy(() => import('src/pages/Sales/Sales'));
export const SalesCreatePage = lazy(() => import('src/pages/Sales/Create/SalesCreate'));
export const SalesDetailPage = lazy(() => import('src/pages/Sales/Detail/SalesDetail'));
export const SalesEditPage = lazy(() => import('src/pages/Sales/Edit/SalesEdit'));
export const ProductPage = lazy(() => import('src/pages/Product/Product'));
export const ProductCreatePage = lazy(() => import('src/pages/Product/Create/ProductCreate'));
export const ProductEditPage = lazy(() => import('src/pages/Product/Edit/ProductEdit'));
export const ProductDetailPage = lazy(() => import('src/pages/Product/Detail/ProductDetail'));
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
        {
          path: "sales",
          element: (<Outlet />),
          children: [
            { element: <SalesPage />, index: true },
            { path: "create", element: <SalesCreatePage /> },
            { path: "detail/:uuid", element: <SalesDetailPage /> },
            { path: "edit/:uuid", element: <SalesEditPage /> }
          ]
        },
        {
          path: "product",
          element: (<Outlet />),
          children: [
            { element: <ProductPage />, index: true },
            { path: "create", element: <ProductCreatePage /> },
            { path: "detail", element: <ProductDetailPage /> },
            { path: "edit/:id", element: <ProductEditPage /> }
          ]
        },
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
