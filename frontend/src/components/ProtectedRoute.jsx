import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { isLogin, user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!isLogin) return <Navigate to="/login" replace />;

  if (role && user.role?.toUpperCase() !== role.toUpperCase()) {
    return <p>Access Denied</p>;
  }

  return children;
};

export default ProtectedRoute;