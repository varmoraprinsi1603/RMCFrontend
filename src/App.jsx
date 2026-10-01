import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";

import Login from "./Login";
import Dashboard from "./Dashboard";
import TicketMaster from "./TicketMaster";
import UserManagement from "./UserManagement";
import Reports from "./Reports";


function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("RoleID");
  localStorage.removeItem("RoleName");
  localStorage.removeItem("username");
  localStorage.removeItem("UserName");
  localStorage.removeItem("UserID");
}

function SessionHandler() {
  useEffect(() => {
    const originalFetch = window.fetch;

    const wrappedFetch = async (...args) => {
      const requestUrl =
        typeof args[0] === "string"
          ? args[0]
          : args[0]?.url || "";

      try {
        const response = await originalFetch(...args);

        const isApiRequest =
          requestUrl.startsWith(
            "https://localhost:44319/api/"
          );

        const isLoginRequest =
          requestUrl.includes("/UserMaster/Login");

        if (
          response.status === 401 &&
          isApiRequest &&
          !isLoginRequest
        ) {
          clearSession();

          window.location.replace("/login");

          throw new Error("SESSION_EXPIRED");
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    window.fetch = wrappedFetch;

    return () => {
      if (window.fetch === wrappedFetch) {
        window.fetch = originalFetch;
      }
    };
  }, []);

  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}



function App() {

  return (

    <BrowserRouter>
            <SessionHandler />
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= HOME / ERP SHELL ================= */}

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >

          {/* Ticket Master */}

          <Route
            path="tickets"
            element={<TicketMaster />}
          />


          {/* User Management */}

          <Route
            path="users"
            element={<UserManagement />}
          />


          {/* Reports */}

          <Route
            path="reports"
            element={<Reports />}
          />


          {/* Ticket Summary */}

          <Route
            path="reports/ticket-summary"
            element={<Reports />}
          />


          {/* Ticket Performance */}

          <Route
            path="reports/ticket-performance"
            element={<Reports />}
          />

        </Route>


        {/* App open hote hi LOGIN */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
  
}


export default App;