import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RouteWatcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    if (prevPath === "/editor" && currentPath !== "/editor" && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      
      sessionStorage.setItem("targetPath", currentPath);
      
      navigate("/loading", { replace: true });
      return;
    }

    if (currentPath === "/loading") {
      setTimeout(() => {
        const targetPath = sessionStorage.getItem("targetPath");
        if (targetPath) {
          window.location.href = targetPath;
        }
      }, 100);
      return;
    }

    const targetPath = sessionStorage.getItem("targetPath");
    if (targetPath && targetPath === currentPath) {
      sessionStorage.removeItem("targetPath");
    }

    prevPathRef.current = currentPath;
    isNavigatingRef.current = false;
  }, [location.pathname, navigate]);

  return null;
}

export default RouteWatcher;