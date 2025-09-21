//we need to protect the app from unathorized users like you can't take the url and enter it then the app open you must redirect to the begin page

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // we can't use navigate here in the top level we must use it in an effect so we will make a useEffect

  useEffect(
    function () {
      if (!isAuthenticated) {
        navigate("/");
      }
    },
    [isAuthenticated, navigate]
  );

  //here if we make return children only so when we copy the url of the app and put it on another tab there will be an error says we can;t render null avatar of user
  //because the component is rendered first then the useEffect run so we must return nothing if the user is not authenticated
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
