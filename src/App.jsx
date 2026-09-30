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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const request = args[1] || {};

        const headers = request.headers || {};

        const authorization =
          headers instanceof Headers
            ? headers.get("Authorization")
            : headers.Authorization ||
              headers.authorization;

        const response = await originalFetch(...args);

        // Only handle 401 for authenticated API requests
        if (response.status === 401 && authorization) {
          clearSession();

          window.location.replace("/login");

           throw new Error("SESSION_EXPIRED");
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

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