import { useEffect, useState } from "react";
import {
  Ticket,
  Clock3,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
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

  return (
    <div className="min-h-screen bg-[#eef3f9] text-[#173b68]">

    
      {/* =====================================================
          DASHBOARD CONTENT
      ====================================================== */}
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
    </div>
  );
}

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