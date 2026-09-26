import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileBarChart2,
  BarChart3,
  CalendarDays,
  Filter,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react";

const API_BASE = "https://localhost:44319/api/Ticket";

function Reports() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSummary =
    location.pathname.includes("ticket-summary");

  const isPerformance =
    location.pathname.includes("ticket-performance");

  // =====================================================
  // SUMMARY STATE
  // =====================================================

  const [filters, setFilters] = useState({
    FromDate: "",
    ToDate: "",
    Status: "",
    Priority: "",
    AssignedToName: "",
  });

  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("Token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("AccessToken");

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // GET FILTERED TICKET SUMMARY
  // =====================================================

  const getTicketSummary = async () => {
    try {
      setLoading(true);
      setMessage("");

      const params = new URLSearchParams();

      if (filters.FromDate) {
        params.append("FromDate", filters.FromDate);
      }

      if (filters.ToDate) {
        params.append("ToDate", filters.ToDate);
      }

      if (filters.Status) {
        params.append("Status", filters.Status);
      }

      if (filters.Priority) {
        params.append("Priority", filters.Priority);
      }

      if (filters.AssignedToName.trim()) {
        params.append(
          "AssignedToName",
          filters.AssignedToName.trim()
        );
      }

      const response = await fetch(
        `${API_BASE}/GetTicketSummaryReport?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load ticket summary."
        );
      }

      const data =
        result?.Data ||
        result?.data ||
        [];

      setSummaryData(
        Array.isArray(data)
          ? data
          : data?.Items || []
      );
    } catch (error) {
      console.error(error);
      setSummaryData([]);
      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerateReport = () => {
    getTicketSummary();
  };

  // =====================================================
  // EXCEL DOWNLOAD
  // =====================================================

  const handleExcelDownload = async () => {
    try {
      setExcelLoading(true);
      setMessage("");

      const params = new URLSearchParams();

      if (filters.FromDate) {
        params.append("FromDate", filters.FromDate);
      }

      if (filters.ToDate) {
        params.append("ToDate", filters.ToDate);
      }

      if (filters.Status) {
        params.append("Status", filters.Status);
      }

      if (filters.Priority) {
        params.append("Priority", filters.Priority);
      }

      if (filters.AssignedToName.trim()) {
        params.append(
          "AssignedToName",
          filters.AssignedToName.trim()
        );
      }

      const response = await fetch(
        `${API_BASE}/ExportTicketSummaryExcel?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null);

        throw new Error(
          result?.Message ||
            result?.message ||
            "Excel download failed."
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "TicketSummary.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Excel download failed."
      );
    } finally {
      setExcelLoading(false);
    }
  };

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
              navigate(
                "/Dashboard/reports/ticket-summary"
              )
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
              View ticket details based on date, status,
              priority and assigned employee.
            </p>

          </button>

          {/* Ticket Performance */}
          <button
            type="button"
            onClick={() =>
              navigate(
                "/Dashboard/reports/ticket-performance"
              )
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
              Analyze support executive workload,
              resolved tickets, pending tickets and
              resolution time.
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

        <div className="mb-5">
          <h1 className="text-[21px] font-bold text-[#173b68]">
            Ticket Summary
          </h1>

          <p className="text-[12px] text-[#71869d] mt-1">
            Generate a filtered ticket summary report
          </p>
        </div>

        {/* FILTER BOX */}
        <div className="bg-white border border-[#dce6ef] rounded-2xl shadow-sm">

          {/* Header */}
          <div className="px-5 py-3 border-b border-[#e7edf3] flex items-center gap-3">

            <Filter
              size={17}
              className="text-[#1b6bb3]"
            />

            <div>
              <div className="text-[13px] font-semibold text-[#173b68]">
                Report Filters
              </div>

              <div className="text-[10px] text-[#8093a7]">
                Select criteria to generate the report
              </div>
            </div>

          </div>

          {/* Filters */}
          <div className="px-5 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* From Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
                From Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa0b5]"
                />

                <input
                  type="date"
                  value={filters.FromDate}
                  onChange={(e) =>
                    handleFilterChange(
                      "FromDate",
                      e.target.value
                    )
                  }
                  className="w-full h-9 pl-9 pr-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
                />

              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
                To Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa0b5]"
                />

                <input
                  type="date"
                  value={filters.ToDate}
                  onChange={(e) =>
                    handleFilterChange(
                      "ToDate",
                      e.target.value
                    )
                  }
                  className="w-full h-9 pl-9 pr-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
                />

              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
                Status
              </label>

              <select
                value={filters.Status}
                onChange={(e) =>
                  handleFilterChange(
                    "Status",
                    e.target.value
                  )
                }
                className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
              >
                <option value="">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
                Priority
              </label>

              <select
                value={filters.Priority}
                onChange={(e) =>
                  handleFilterChange(
                    "Priority",
                    e.target.value
                  )
                }
                className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
              >
                <option value="">
                  All Priority
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>

            {/* Assigned Employee */}
            <div>
              <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
                Assigned Employee
              </label>

              <input
                type="text"
                value={filters.AssignedToName}
                onChange={(e) =>
                  handleFilterChange(
                    "AssignedToName",
                    e.target.value
                  )
                }
                placeholder="Enter employee name"
                className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
              />
            </div>

          </div>

          {/* Search  */}
          <div className="px-5 py-2.5 border-t border-[#e7edf3] flex justify-end">
  <button
    type="button"
    onClick={handleGenerateReport}
    disabled={loading}
    className="h-8 px-4 rounded-lg bg-[#40566b] text-white text-[11px] font-semibold hover:bg-[#344b60] transition disabled:opacity-60 flex items-center gap-2"
  >
    {loading ? (
      <>
        <Loader2
          size={13}
          className="animate-spin"
        />
        Searching...
      </>
    ) : (
      <>
        <Filter size={13} />
        Search
      </>
    )}
  </button>
</div>

        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600">
            {message}
          </div>
        )}

        {/* RESULT LIST */}
        {summaryData.length > 0 && (
          <div className="mt-5 bg-white border border-[#dce6ef] rounded-2xl shadow-sm overflow-hidden">

            {/* Result Header */}
            <div className="px-5 py-3 border-b border-[#e7edf3] flex items-center justify-between">

              <div>
                <div className="text-[14px] font-semibold text-[#173b68]">
                  Ticket Summary
                </div>

                <div className="text-[10px] text-[#8093a7] mt-0.5">
                  Filtered ticket records
                </div>
              </div>

              {/* Excel */}
              <button
                type="button"
                onClick={handleExcelDownload}
                disabled={excelLoading}
                className="h-9 px-4 rounded-lg bg-[#3f6f55] text-white text-[11px] font-semibold flex items-center gap-2 hover:bg-[#345d47] transition disabled:opacity-60"
              >

                {excelLoading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={14} />
                )}

                {excelLoading
                  ? "Downloading..."
                  : "Excel"}

              </button>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="bg-[#40566b] text-white">

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Ticket No
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Title
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Category
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Assigned To
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap">
                      Created Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {summaryData.map(
                    (item, index) => (
                      <tr
                        key={
                          item.TicketNo ||
                          item.ticketNo ||
                          index
                        }
                        className="border-b border-[#edf1f5] hover:bg-[#f8fafc]"
                      >

                        <td className="px-4 py-3 text-[11px] font-semibold text-[#173b68] whitespace-nowrap">
                          {item.TicketNo ??
                            item.ticketNo ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83]">
                          {item.Title ??
                            item.title ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83] whitespace-nowrap">
                          {item.Category ??
                            item.category ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83] whitespace-nowrap">
                          {item.Priority ??
                            item.priority ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83] whitespace-nowrap">
                          {item.Status ??
                            item.status ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83] whitespace-nowrap">
                          {item.AssignedToName ??
                            item["Assigned To"] ??
                            item.assignedToName ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-[#526b83] whitespace-nowrap">
                          {item.CreatedDate
                            ? new Date(
                                item.CreatedDate
                              ).toLocaleString()
                            : "-"}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // TICKET PERFORMANCE
  // =====================================================

  return (
    <div>

      <div className="mb-5">
        <h1 className="text-[21px] font-bold text-[#173b68]">
          Ticket Performance
        </h1>

        <p className="text-[12px] text-[#71869d] mt-1">
          Analyze support executive ticket performance
        </p>
      </div>

      <div className="bg-white border border-[#dce6ef] rounded-2xl shadow-sm">

        <div className="px-5 py-2.5 border-b border-[#e7edf3] flex items-center gap-3">

          <Filter
            size={17}
            className="text-[#1b6bb3]"
          />

          <div>
            <div className="text-[13px] font-semibold text-[#173b68]">
              Report Filters
            </div>

            <div className="text-[10px] text-[#8093a7]">
              Select criteria to generate the performance report
            </div>
          </div>

        </div>

        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* From Date */}
          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
              From Date
            </label>

            <input
              type="date"
              className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
              To Date
            </label>

            <input
              type="date"
              className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
              Status
            </label>

            <select className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
              Priority
            </label>

            <select className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]">
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Assigned Employee */}
          <div>
            <label className="block text-[11px] font-semibold text-[#526b83] mb-1">
              Assigned Employee
            </label>  

            <input
              type="text"
              placeholder="Enter employee name"
              className="w-full h-9 px-3 border border-[#d6e0e9] rounded-lg text-[12px] text-[#173b68] outline-none focus:border-[#52718f]"
            />
          </div>

        </div>

        <div className="px-5 py-3 border-t border-[#e7edf3] flex justify-end">

          <button
            type="button"
            className="h-9 px-5 rounded-lg bg-[#40566b] text-white text-[12px] font-semibold hover:bg-[#344b60] transition"
          >
            Search
          </button>

        </div>

      </div>

    </div>
  );
}

export default Reports;