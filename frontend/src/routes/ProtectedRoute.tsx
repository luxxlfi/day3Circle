import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};
