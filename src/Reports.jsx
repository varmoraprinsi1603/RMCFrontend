import { useLocation, useNavigate } from "react-router-dom";
import {
  FileBarChart2,
  BarChart3,
  CalendarDays,
  Filter,
  ArrowRight,
} from "lucide-react";

function Reports() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSummary =
    location.pathname.includes("ticket-summary");

  const isPerformance =
    location.pathname.includes("ticket-performance");

  // =====================================================
  // REPORTS HOME
  // =====================================================

  if (!isSummary && !isPerformance) {
    return (
      <div className="min-h-[calc(100vh-40px)]">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e5eff9] flex items-center justify-center">
              <FileBarChart2
                size={21}
                className="text-[#1b6bb3]"
              />
            </div>

            <div>
              <h1 className="text-[22px] font-bold text-[#173b68]">
                Reports
              </h1>

              <p className="text-[12px] text-[#71869d] mt-1">
                Ticket reports and performance analysis
              </p>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Ticket Summary */}
          <button
            type="button"
            onClick={() =>
              navigate("/Dashboard/reports/ticket-summary")
            }
            className="text-left bg-white border border-[#dce6ef] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#9dbbd5] transition"
          >
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-[#e8f2fb] flex items-center justify-center">
                <FileBarChart2
                  size={21}
                  className="text-[#1b6bb3]"
                />
              </div>

              <ArrowRight
                size={18}
                className="text-[#8ba0b5]"
              />

            </div>

            <h2 className="mt-5 text-[16px] font-semibold text-[#173b68]">
              Ticket Summary
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-[#71869d]">
              View ticket details based on date, status, priority
              and assigned employee.
            </p>

          </button>

          {/* Ticket Performance */}
          <button
            type="button"
            onClick={() =>
              navigate("/Dashboard/reports/ticket-performance")
            }
            className="text-left bg-white border border-[#dce6ef] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#9dbbd5] transition"
          >
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-[#eef5f0] flex items-center justify-center">
                <BarChart3
                  size={21}
                  className="text-[#3f6f55]"
                />
              </div>

              <ArrowRight
                size={18}
                className="text-[#8ba0b5]"
              />

            </div>

            <h2 className="mt-5 text-[16px] font-semibold text-[#173b68]">
              Ticket Performance
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-[#71869d]">
              Analyze support executive workload, resolved tickets,
              pending tickets and resolution time.
            </p>

          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // TICKET SUMMARY
  // =====================================================

  if (isSummary) {
    return (
      <div>

        <div className="mb-6">
          <h1 className="text-[21px] font-bold text-[#173b68]">
            Ticket Summary
          </h1>

          <p className="text-[12px] text-[#71869d] mt-1">
            Generate a filtered ticket summary report
          </p>
        </div>

        <div className="bg-white border border-[#dce6ef] rounded-2xl shadow-sm">

          {/* Filter Header */}
          <div className="px-5 py-4 border-b border-[#e7edf3] flex items-center gap-3">
            <Filter
              size={18}
              className="text-[#1b6bb3]"
            />

            <div>
              <div className="text-[14px] font-semibold text-[#173b68]">
                Report Filters
              </div>

              <div className="text-[11px] text-[#8093a7]">
                Select criteria to generate the report
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* From Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
                From Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa0b5]"
                />

                <input
                  type="date"
                  className="w-full h-10 pl-9 pr-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
                />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
                To Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa0b5]"
                />

                <input
                  type="date"
                  className="w-full h-10 pl-9 pr-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
                Status
              </label>

              <select className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
                Priority
              </label>

              <select className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

         
            {/* Assigned Employee */}
<div>
  <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
    Assigned Employee
  </label>

  <input
    type="text"
    placeholder="Enter employee name"
    className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
  />
</div>

          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[#e7edf3] flex justify-end">
            <button
              type="button"
              className="h-10 px-5 rounded-lg bg-[#40566b] text-white text-[12px] font-semibold hover:bg-[#344b60] transition"
            >
              Generate Report
            </button>
          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // TICKET PERFORMANCE
  // =====================================================

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-[21px] font-bold text-[#173b68]">
          Ticket Performance
        </h1>

        <p className="text-[12px] text-[#71869d] mt-1">
          Analyze support executive ticket performance
        </p>
      </div>

      <div className="bg-white border border-[#dce6ef] rounded-2xl shadow-sm">

        <div className="px-5 py-4 border-b border-[#e7edf3] flex items-center gap-3">
          <Filter
            size={18}
            className="text-[#1b6bb3]"
          />

          <div>
            <div className="text-[14px] font-semibold text-[#173b68]">
              Report Filters
            </div>

            <div className="text-[11px] text-[#8093a7]">
              Select criteria to generate the performance report
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
              From Date
            </label>

            <input
              type="date"
              className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
              To Date
            </label>

            <input
              type="date"
              className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
              Status
            </label>

            <select className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
              Priority
            </label>

            <select className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

         <div>
  <label className="block text-[11px] font-semibold text-[#526b83] mb-1.5">
    Assigned Employee
  </label>

  <input
    type="text"
    placeholder="Enter employee name"
    className="w-full h-10 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
  />
</div>

        </div>

        <div className="px-5 py-4 border-t border-[#e7edf3] flex justify-end">
          <button
            type="button"
            className="h-10 px-5 rounded-lg bg-[#40566b] text-white text-[12px] font-semibold hover:bg-[#344b60] transition"
          >
            Generate Report
          </button>
        </div>

      </div>

    </div>
  );
}

export default Reports;