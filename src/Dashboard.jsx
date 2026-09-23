import { useEffect, useState } from "react";
import {
  Ticket,
  Clock3,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Dashboard() {

  // =====================================================
  // SIDEBAR STATE
  // =====================================================

  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";
  const roleName = localStorage.getItem("RoleName") || "User";

  // =====================================================
  // CHECK CURRENT PAGE
  // =====================================================

  const isDashboardPage =
    location.pathname === "/Dashboard" ||
    location.pathname === "/Dashboard/";

  // =====================================================
  // ORIGINAL DASHBOARD CODE - SAME
  // =====================================================

  const [dashboard, setDashboard] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    highCriticalTickets: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:44319/api/Dashboard/GetDashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Dashboard API failed");
      }

      const result = await response.json();

      console.log("Dashboard Response:", result);

      if (result.data) {
        setDashboard({
          totalTickets: result.data.totalTickets ?? 0,
          openTickets: result.data.openTickets ?? 0,
          inProgressTickets: result.data.inProgressTickets ?? 0,
          resolvedTickets: result.data.resolvedTickets ?? 0,
          closedTickets: result.data.closedTickets ?? 0,
          highCriticalTickets: result.data.highCriticalTickets ?? 0,
        });
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ORIGINAL CARDS - SAME
  // =====================================================

  const cards = [
    {
      title: "Total Tickets",
      value: dashboard.totalTickets,
      icon: Ticket,
      description: "All service tickets",
    },
    {
      title: "Open",
      value: dashboard.openTickets,
      icon: Clock3,
      description: "Waiting for action",
    },
    {
      title: "In Progress",
      value: dashboard.inProgressTickets,
      icon: LoaderCircle,
      description: "Currently working",
    },
    {
      title: "Resolved",
      value: dashboard.resolvedTickets,
      icon: CheckCircle2,
      description: "Successfully resolved",
    },
    {
      title: "Closed",
      value: dashboard.closedTickets,
      icon: XCircle,
      description: "Completed tickets",
    },
    {
      title: "High / Critical",
      value: dashboard.highCriticalTickets,
      icon: AlertTriangle,
      description: "Priority attention",
    },
  ];

  // =====================================================
  // SIDEBAR MENU STYLE
  // =====================================================

  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 h-[43px] px-3 rounded-lg text-[13px] font-medium transition ${
      isActive
        ? "bg-[#1b6bb3] text-white shadow-[0_5px_16px_rgba(15,84,145,0.20)]"
        : "text-[#c7d7e7] hover:bg-[#154d7f] hover:text-white"
    }`;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("RoleID");
    localStorage.removeItem("RoleName");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberMe");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#eef3f9] text-[#173b68]">

      {/* =====================================================
          LEFT SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 bg-[#0d3559] border-r border-[#1c4d75] transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-[235px]"
        }`}
      >

        {/* ================= LOGO ================= */}

        <div className="h-[70px] flex items-center px-4 border-b border-[#1c4d75]">

          <button
            type="button"
            onClick={() => navigate("/Dashboard")}
            className="flex items-center gap-3 text-left cursor-pointer"
          >

            {collapsed ? (

              <div className="mx-auto w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold">
                R
              </div>

            ) : (

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold">
                  R
                </div>

                <div className="leading-none">

                  <div className="text-white text-[16px] font-bold tracking-wide">
                    RMC ERP
                  </div>

                  <div className="text-[#8eafc9] text-[10px] mt-1">
                    Service Management
                  </div>

                </div>

              </div>

            )}

          </button>

        </div>

        {/* ================= COLLAPSE BUTTON ================= */}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[82px] w-7 h-7 rounded-md bg-white border border-[#dce5ef] shadow-sm flex items-center justify-center text-[#55708c] hover:text-[#1859a5] transition"
        >

          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}

        </button>

        {/* ================= MENU ================= */}

        <div className="px-3 py-6">

          {!collapsed && (
            <div className="px-2 mb-3 text-[10px] uppercase tracking-[1.4px] text-[#7897b2]">
              Operations
            </div>
          )}

          {/* Ticket Master */}

          <NavLink
            to="/Dashboard/tickets"
            className={menuClass}
          >

            <Ticket size={18} />

            {!collapsed && (
              <span>Ticket Master</span>
            )}

          </NavLink>

          {/* User Management - Admin Only */}

          {roleName === "Admin" && (

            <NavLink
              to="/Dashboard/users"
              className={({ isActive }) =>
                `${menuClass({ isActive })} mt-2`
              }
            >

              <Users size={18} />

              {!collapsed && (
                <span>User Management</span>
              )}

            </NavLink>

          )}

        </div>

        {/* ================= USER AREA ================= */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1c4d75] p-3">

          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >

            <div className="w-9 h-9 shrink-0 rounded-full bg-[#4d7fe4] text-white flex items-center justify-center text-[13px] font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (

              <div className="min-w-0">

                <div className="text-white text-[13px] font-medium truncate">
                  {username}
                </div>

                <div className="text-[#8eacc5] text-[11px] truncate">
                  {roleName}
                </div>

              </div>

            )}

            {!collapsed && (

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-[#8eacc5] hover:bg-[#154d7f] hover:text-white transition"
              >

                <LogOut size={15} />

              </button>

            )}

          </div>

        </div>

      </aside>

      {/* =====================================================
          RIGHT SIDE CONTENT
      ====================================================== */}

      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-[76px]" : "ml-[235px]"
        }`}
      >

        {/* =====================================================
            DASHBOARD PAGE
        ====================================================== */}

        {isDashboardPage ? (

          <main className="p-8">

            {/* Welcome Section */}

            <div className="flex items-center justify-between mb-7">

              <div>

                <h2 className="text-[27px] font-semibold text-[#102f58]">
                  Welcome back, {localStorage.getItem("username") || "User"} 👋
                </h2>

                <p className="text-[14px] text-[#7c8da2] mt-1">
                  Here's what's happening with your service tickets today.
                </p>

              </div>

              <button
                onClick={loadDashboard}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#dce5ef] rounded-lg text-[13px] font-medium text-[#526a85] hover:border-[#b8c9dc] transition"
              >

                Refresh

                <ArrowUpRight size={15} />

              </button>

            </div>

            {/* =====================================================
                KPI CARDS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5">

              {cards.map((card) => {

                const Icon = card.icon;

                return (

                  <div
                    key={card.title}
                    className="bg-white rounded-2xl border border-[#e0e7ef] p-5 shadow-[0_8px_25px_rgba(30,65,100,0.05)] hover:shadow-[0_12px_30px_rgba(30,65,100,0.08)] transition"
                  >

                    <div className="flex items-center justify-between">

                      <div className="w-11 h-11 rounded-xl bg-[#edf4fb] flex items-center justify-center text-[#1859a5]">
                        <Icon size={21} />
                      </div>

                      <span className="text-[11px] font-medium text-[#94a2b2]">
                        TICKET
                      </span>

                    </div>

                    <div className="mt-5">

                      <p className="text-[13px] text-[#8191a4]">
                        {card.title}
                      </p>

                      <h3 className="text-[30px] font-semibold text-[#102f58] mt-1">
                        {loading ? "—" : card.value}
                      </h3>

                      <p className="text-[11px] text-[#9aa7b6] mt-1">
                        {card.description}
                      </p>

                    </div>

                  </div>

                );

              })}

            </div>

            {/* =====================================================
                MAIN DASHBOARD PANELS
            ====================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-7">

              {/* Ticket Overview */}

              <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e0e7ef] p-6 shadow-[0_8px_25px_rgba(30,65,100,0.05)]">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-[17px] font-semibold text-[#173b68]">
                      Ticket Overview
                    </h3>

                    <p className="text-[12px] text-[#8a99ab] mt-1">
                      Current ticket status distribution
                    </p>

                  </div>

                  <div className="text-[12px] text-[#7c8da2]">
                    Current
                  </div>

                </div>

                <div className="mt-8 space-y-5">

                  <StatusBar
                    label="Open"
                    value={dashboard.openTickets}
                    total={dashboard.totalTickets}
                  />

                  <StatusBar
                    label="In Progress"
                    value={dashboard.inProgressTickets}
                    total={dashboard.totalTickets}
                  />

                  <StatusBar
                    label="Resolved"
                    value={dashboard.resolvedTickets}
                    total={dashboard.totalTickets}
                  />

                  <StatusBar
                    label="Closed"
                    value={dashboard.closedTickets}
                    total={dashboard.totalTickets}
                  />

                </div>

              </div>

              {/* Priority Panel */}

              <div className="bg-white rounded-2xl border border-[#e0e7ef] p-6 shadow-[0_8px_25px_rgba(30,65,100,0.05)]">

                <h3 className="text-[17px] font-semibold text-[#173b68]">
                  Priority Attention
                </h3>

                <p className="text-[12px] text-[#8a99ab] mt-1">
                  Tickets requiring attention
                </p>

                <div className="mt-7">

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#fff7ed] border border-[#f8e5c9]">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-[#fff0d9] flex items-center justify-center text-[#c47a15]">

                        <AlertTriangle size={19} />

                      </div>

                      <div>

                        <p className="text-[13px] font-semibold text-[#6d4b1d]">
                          High / Critical
                        </p>

                        <p className="text-[11px] text-[#a17b49]">
                          Priority tickets
                        </p>

                      </div>

                    </div>

                    <span className="text-[25px] font-semibold text-[#8b5d1b]">
                      {loading ? "—" : dashboard.highCriticalTickets}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </main>

        ) : (

          /* =====================================================
              TICKET MASTER / USER MANAGEMENT
              OUTLET CONTENT
          ====================================================== */

          <main className="p-5 lg:p-6">

            <Outlet />

          </main>

        )}

      </div>

    </div>
  );
}


// =====================================================
// STATUS BAR
// ORIGINAL SAME
// =====================================================

function StatusBar({ label, value, total }) {

  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (

    <div>

      <div className="flex items-center justify-between mb-2">

        <span className="text-[13px] font-medium text-[#526a85]">
          {label}
        </span>

        <span className="text-[12px] text-[#8a99ab]">
          {value} ({percentage}%)
        </span>

      </div>

      <div className="h-2.5 bg-[#edf2f7] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#3d75ad] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>

  );
}

export default Dashboard;