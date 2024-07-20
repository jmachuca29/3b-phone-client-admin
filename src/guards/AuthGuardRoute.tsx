import { Navigate, Outlet } from "react-router-dom";
import useAppStore from "src/store/store";

export const ProtectedRoute = () => {

  const [user] = useAppStore((state) => [state.user]);

  return Object.keys(user).length !== 0 ? <Outlet /> : <Navigate to="/sales" />;
};
