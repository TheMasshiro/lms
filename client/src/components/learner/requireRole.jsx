import { useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "./Loading";

const RequireRole = ({ children }) => {
  const { isEducator, isStudent } = useContext(AppContext);
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const hasRole = user?.publicMetadata?.role || isEducator || isStudent;

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (loading || !isLoaded) {
    return <Loading />;
  }

  if (location.pathname === "/role/choice") {
    return children;
  }

  if (!user) {
    return children;
  }

  if (!hasRole) {
    return <Navigate to="/role/choice" replace />;
  }

  return children;
};

export default RequireRole;
