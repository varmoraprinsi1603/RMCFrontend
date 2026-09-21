import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import TicketMaster from "./TicketMaster";
import UserManagement from "./UserManagement";
import Reports from "./Reports";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
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
        </Route>

        {/* App open hote hi LOGIN */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;