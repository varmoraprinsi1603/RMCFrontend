import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  Users,
  FileBarChart2,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";
  const roleName = localStorage.getItem("RoleName") || "User";

  const isHomePage = location.pathname === "/home";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("RoleID");
    localStorage.removeItem("RoleName");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberMe");

    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 h-[43px] px-3 rounded-lg text-[13px] font-medium transition ${
      isActive
        ? "bg-[#1b6bb3] text-white shadow-[0_5px_16px_rgba(15,84,145,0.20)]"
        : "text-[#c7d7e7] hover:bg-[#154d7f] hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#eef3f9]">

      {/* =====================================================
          SIDEBAR
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
        onClick={() => navigate("/home")}
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
              Main
            </div>
          )}

          {/* Dashboard */}
          <NavLink
            to="/home/dashboard"
            className={menuClass}
          >
            <LayoutDashboard size={18} />

            {!collapsed && (
              <span>Dashboard</span>
            )}
          </NavLink>

          {!collapsed && (
            <div className="px-2 mt-7 mb-3 text-[10px] uppercase tracking-[1.4px] text-[#7897b2]">
              Operations
            </div>
          )}

          {/* Ticket Master */}
          <NavLink
            to="/home/tickets"
            className={({ isActive }) =>
              `${menuClass({ isActive })} mt-1`
            }
          >
            <Ticket size={18} />

            {!collapsed && (
              <span>Ticket Master</span>
            )}
          </NavLink>

          {/* User Management */}
          {roleName === "Admin" && (
            <NavLink
              to="/home/users"
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

          {/* Reports */}
          <NavLink
            to="/home/reports"
            className={({ isActive }) =>
              `${menuClass({ isActive })} mt-2`
            }
          >
            <FileBarChart2 size={18} />

            {!collapsed && (
              <span>Reports</span>
            )}
          </NavLink>

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

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ml-[76px]" : "ml-[235px]"
        }`}
      >

        {/* ================= HEADER ================= */}
        <header className="h-[70px] bg-white border-b border-[#dce5ee] px-5 lg:px-7 flex items-center justify-between shadow-[0_2px_10px_rgba(25,55,90,0.03)]">

          {/* Left */}
          <div>

            <h1 className="text-[18px] font-semibold text-[#102f58]">
              RMC ERP
            </h1>

            <p className="text-[11px] text-[#8494a7] mt-0.5">
              Service Ticket Management
            </p>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <button
              type="button"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#60758e] hover:bg-[#f1f5f9] transition"
            >
              <Bell size={18} />

              <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-[#2877c5]" />
            </button>

            <div className="h-8 w-px bg-[#e2e8ef]" />

            {/* User */}
            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-full bg-[#e8f0fb] text-[#1859a5] flex items-center justify-center text-[13px] font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block">

                <div className="text-[13px] font-semibold text-[#243b53]">
                  {username}
                </div>

                <div className="text-[11px] text-[#8a99ab]">
                  {roleName}
                </div>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="ml-1 w-8 h-8 rounded-lg flex items-center justify-center text-[#71839a] hover:bg-[#f3f6f9] hover:text-[#c0392b] transition"
              >
                <LogOut size={16} />
              </button>

            </div>

          </div>

        </header>

         {/* =====================================================
    PAGE CONTENT
====================================================== */}
<main className="p-5 lg:p-6">

  {isHomePage ? (

    <div className="min-h-[calc(100vh-118px)] flex items-center">

      <div className="relative w-full min-h-[calc(100vh-150px)] overflow-hidden rounded-[26px] bg-white border border-[#e1e8ef] shadow-[0_16px_45px_rgba(24,58,90,0.06)]">

        {/* =================================================
            VERY LIGHT BACKGROUND DETAILS
        ================================================== */}

        <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-[#f5f9fd]" />

        <div className="absolute top-[90px] right-[120px] w-[260px] h-[260px] rounded-full border border-[#e8eff5]" />

        <div className="absolute bottom-[-180px] left-[-120px] w-[430px] h-[430px] rounded-full border border-[#edf2f6]" />

        <div className="absolute right-[18%] top-[18%] w-[5px] h-[5px] rounded-full bg-[#77a0bd]/40" />

        <div className="absolute right-[10%] bottom-[24%] w-[7px] h-[7px] rounded-full bg-[#8eafc6]/35" />

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <div className="relative z-10 min-h-[calc(100vh-150px)] flex items-center px-10 sm:px-14 lg:px-20">

          <div className="w-full max-w-[980px]">

            {/* Small label */}
            <div className="flex items-center gap-3">

              <span className="w-9 h-px bg-[#3176aa]" />

              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[#8296a9]">
                SERVICE MANAGEMENT
              </span>

            </div>

            {/* Main typography */}
            <div className="mt-7">

              <h2 className="text-[48px] sm:text-[62px] lg:text-[76px] font-semibold tracking-[-3.5px] leading-[0.98] text-[#10385d]">

                Service

                <br />

                <span className="font-normal text-[#51718c]">
                  Management
                </span>

              </h2>

            </div>

            {/* Thin line */}
            <div className="mt-9 w-[370px] max-w-full h-px bg-gradient-to-r from-[#2d72a9] via-[#b9cfdf] to-transparent" />

            {/* Description */}
            <p className="max-w-[560px] mt-7 text-[15px] leading-7 text-[#7f91a3]">
              Manage customer complaints, service requests and support
              operations through one centralized workspace.
            </p>

            {/* Bottom information */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">

              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#f1f6fa] border border-[#e1eaf1] flex items-center justify-center">

                  <span className="w-2 h-2 rounded-full bg-[#3177ad]" />

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[1.5px] text-[#9aa8b5]">
                    SUPPORT
                  </p>

                  <p className="text-[12px] font-medium text-[#536e86] mt-0.5">
                    Service Operations
                  </p>

                </div>

              </div>

              <div className="w-px h-8 bg-[#e3eaf0]" />

              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#f1f6fa] border border-[#e1eaf1] flex items-center justify-center">

                  <span className="w-2 h-2 rounded-full bg-[#6d92ad]" />

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[1.5px] text-[#9aa8b5]">
                    CONTROL
                  </p>

                  <p className="text-[12px] font-medium text-[#536e86] mt-0.5">
                    Centralized Workspace
                  </p>

                </div>

              </div>

            </div>

            {/* Bottom right micro text */}
            <div className="absolute right-[8%] bottom-[9%] hidden lg:block">

              <p className="text-[9px] tracking-[3px] uppercase text-[#b0bcc7]">
                SERVICE • SUPPORT • OPERATIONS
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            LARGE BACKGROUND LETTER
        ================================================== */}

        <div className="absolute right-[2%] bottom-[-30px] select-none pointer-events-none">

          <span className="text-[280px] lg:text-[360px] font-bold leading-none tracking-[-25px] text-[#f5f8fb]">
            S
          </span>

        </div>

      </div>

    </div>

     ) : (

    <Outlet />

  )}

</main>

      </div>

    </div>
  );
}

export default Home;