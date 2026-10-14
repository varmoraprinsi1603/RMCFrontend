import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  RefreshCw,
  Ticket,
  UserRound,
  ShieldAlert,
  Search,
  CircleCheck,
} from "lucide-react";

const API_BASE_URL = "https://localhost:44319/api/Ticket";

function getValue(obj, ...keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return "";
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EscalatedTickets() {
  const roleName = localStorage.getItem("RoleName") || "User";

  const normalizedRole = roleName
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const canViewEscalatedTickets = [
    "admin",
    "seniorsupport",
  ].includes(normalizedRole);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  const loadEscalatedTickets = useCallback(async () => {
    if (!canViewEscalatedTickets) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/GetEscalatedTickets`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result?.Status === 0) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load escalated tickets."
        );
      }

      const data = result?.Data ?? result?.data ?? [];
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Escalated Tickets Error:", err);
      setError(err.message || "Unable to load tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [canViewEscalatedTickets]);

  useEffect(() => {
    loadEscalatedTickets();
  }, [loadEscalatedTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchText.toLowerCase();

    return [
      getValue(ticket, "TicketNo", "ticketNo"),
      getValue(ticket, "Title", "title"),
      getValue(ticket, "Priority", "priority"),
      getValue(ticket, "Status", "status"),
      getValue(ticket, "AssignedToName", "assignedToName"),
    ].some((value) => String(value).toLowerCase().includes(search));
  });

  if (!canViewEscalatedTickets) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-3 text-red-500" size={42} />
        <h2 className="text-xl font-bold text-slate-800">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          You are not authorized to view escalated tickets.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50/70 p-4 sm:p-6 lg:p-7">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertTriangle size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Escalated Tickets
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor overdue tickets and SLA breaches.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Admin &amp; Senior Support
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadEscalatedTickets}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Escalated
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "—" : tickets.length}
              </h2>
              <p className="mt-2 text-xs text-red-600">
                Tickets exceeding SLA
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Ticket size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                High / Critical
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {loading
                  ? "—"
                  : tickets.filter((ticket) =>
                      ["high", "critical"].includes(
                        String(
                          getValue(ticket, "Priority", "priority")
                        ).toLowerCase()
                      )
                    ).length}
              </h2>
              <p className="mt-2 text-xs text-orange-600">
                Requires attention
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <ShieldAlert size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Status
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {loading ? "Loading..." : tickets.length ? "Action Required" : "All Clear"}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                {tickets.length
                  ? "Review and resolve overdue tickets"
                  : "No overdue tickets found"}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                tickets.length
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {tickets.length ? (
                <Clock3 size={23} />
              ) : (
                <CircleCheck size={23} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TICKET TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Overdue Ticket List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tickets with an exceeded SLA deadline
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search tickets..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-red-50/70 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            SLA Breached
          </div>
          <span className="text-xs font-medium text-slate-500">
            {loading ? "Loading..." : `${filteredTickets.length} tickets`}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="mb-3 animate-spin text-slate-500" size={27} />
            <p className="text-sm font-medium text-slate-600">
              Loading escalated tickets...
            </p>
          </div>
        ) : error ? (
          <div className="p-5">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Unable to load tickets</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={loadEscalatedTickets}
                className="mt-3 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Ticket size={27} />
            </div>
            <h3 className="font-semibold text-slate-700">
              {tickets.length
                ? "No matching tickets"
                : "No escalated tickets"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {tickets.length
                ? "Try another ticket number, title, priority or assignee."
                : "There are currently no overdue unresolved tickets."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Assigned To</th>
                  <th className="px-5 py-4">SLA Due Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket, index) => {
                  const ticketID = getValue(
                    ticket,
                    "TicketID",
                    "ticketID"
                  );
                  const ticketNo = getValue(
                    ticket,
                    "TicketNo",
                    "ticketNo"
                  );
                  const title = getValue(ticket, "Title", "title");
                  const priority = getValue(
                    ticket,
                    "Priority",
                    "priority"
                  );
                  const status = getValue(
                    ticket,
                    "Status",
                    "status"
                  );
                  const assignedTo = getValue(
                    ticket,
                    "AssignedToName",
                    "assignedToName"
                  );
                  const dueDate = getValue(
                    ticket,
                    "SLADueDate",
                    "slaDueDate"
                  );

                  const priorityText = String(priority || "");
                  const normalizedPriority = priorityText.toLowerCase();

                  const priorityClass =
                    normalizedPriority === "critical"
                      ? "bg-red-100 text-red-700 ring-red-200"
                      : normalizedPriority === "high"
                      ? "bg-orange-100 text-orange-700 ring-orange-200"
                      : normalizedPriority === "medium"
                      ? "bg-amber-100 text-amber-700 ring-amber-200"
                      : "bg-slate-100 text-slate-600 ring-slate-200";

                  const normalizedStatus = String(status || "").toLowerCase();

                  const statusClass =
                    normalizedStatus === "open"
                      ? "bg-blue-50 text-blue-700"
                      : normalizedStatus === "in progress"
                      ? "bg-amber-50 text-amber-700"
                      : normalizedStatus === "pending"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-slate-100 text-slate-600";

                  return (
                    <tr
                      key={ticketID || `${ticketNo}-${index}`}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Ticket size={17} />
                          </div>
                          <span className="text-sm font-bold text-blue-700">
                            {ticketNo || ticketID || "Ticket"}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-[250px] px-5 py-4">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {title || "Ticket Issue"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {priority ? (
                          <span
                            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClass}`}
                          >
                            {priorityText}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {status || "-"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <UserRound size={17} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {assignedTo || "Unassigned"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Support
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                          <Clock3 size={16} />
                          {formatDateTime(dueDate)}
                        </div>
                        <span className="mt-1 block text-xs text-red-400">
                          Deadline exceeded
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing {loading ? 0 : filteredTickets.length} of {loading ? 0 : tickets.length} tickets
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <AlertTriangle size={13} className="text-red-500" />
            Overdue tickets require follow-up
          </p>
        </div>
      </div>
    </div>
  );
}

export default EscalatedTickets;