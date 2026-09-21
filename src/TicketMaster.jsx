import { useState } from "react";
import {
  Search,
  FileText,
  FileSpreadsheet,
  Plus,
  CalendarDays,
  ChevronDown,
  Upload,
  ArrowLeft,
} from "lucide-react";

function TicketMaster() {
  const [activePage, setActivePage] = useState("list");
  const [activeTab, setActiveTab] = useState("detail");

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [groupBy, setGroupBy] = useState("CompanyName");
  const [showEntries, setShowEntries] = useState("50");

  const [selectedTicket, setSelectedTicket] = useState(null);

  /*
   * ==========================================================
   * EMPTY FORM
   * ==========================================================
   * Actual values will come from API / Database.
   */
  const emptyForm = {
    TicketNo: "",
    Date: "",
    CompanyName: "",
    ContactPerson: "",
    ContactNo: "",
    EmailID: "",
    StartDate: "",
    EndDate: "",
    Problem: "",
    Remarks: "",
    OtherRemarks: "",
    Priority: "",
    AssignBy: "",
    AssignTo: "",
    Status: "",
    EntryBy: "",
    FileName: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  /*
   * ==========================================================
   * TICKET LIST
   * ==========================================================
   * Data will be loaded from API / Database.
   *
   * For now it is empty intentionally.
   */
  const [tickets, setTickets] = useState([]);

  /*
   * ==========================================================
   * HISTORY LIST
   * ==========================================================
   * Data will be loaded from API / Database.
   *
   * For now it is empty intentionally.
   */
  const [history, setHistory] = useState([]);

  /*
   * ==========================================================
   * FILTERED TICKETS
   * ==========================================================
   */
  const filteredTickets = tickets.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return Object.values(item).some((x) =>
      String(x ?? "").toLowerCase().includes(value)
    );
  });

  /*
   * ==========================================================
   * FORM CHANGE
   * ==========================================================
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ==========================================================
   * FILE CHANGE
   * ==========================================================
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setFormData((prev) => ({
      ...prev,
      FileName: file ? file.name : "",
    }));
  };

  /*
   * ==========================================================
   * NEW TICKET
   * ==========================================================
   */
  const openNewTicket = () => {
    setFormData(emptyForm);
    setSelectedTicket(null);

    setActiveTab("detail");
    setActivePage("form");
  };

  /*
   * ==========================================================
   * OPEN EXISTING TICKET
   * ==========================================================
   *
   * API GetByID will be connected here later.
   */
  const openTicket = (ticket) => {
    setSelectedTicket(ticket);

    setFormData({
      TicketNo: ticket.TicketNo ?? "",
      Date: ticket.Date ?? "",
      CompanyName: ticket.CompanyName ?? "",
      ContactPerson: ticket.ContactPerson ?? "",
      ContactNo: ticket.ContactNo ?? "",
      EmailID: ticket.EmailID ?? "",
      StartDate: ticket.StartDate ?? "",
      EndDate: ticket.EndDate ?? "",
      Problem: ticket.Problem ?? "",
      Remarks: ticket.Remarks ?? "",
      OtherRemarks: ticket.OtherRemarks ?? "",
      Priority: ticket.Priority ?? "",
      AssignBy: ticket.AssignBy ?? "",
      AssignTo: ticket.AssignTo ?? "",
      Status: ticket.Status ?? "",
      EntryBy: ticket.EntryBy ?? "",
      FileName: ticket.FileName ?? "",
    });

    setActiveTab("detail");
    setActivePage("form");
  };

  /*
   * ==========================================================
   * CSS CLASSES
   * ==========================================================
   */
  const inputClass =
    "w-full h-[38px] border-b border-[#d9dfe7] bg-transparent px-2 text-[12px] text-[#46596d] outline-none focus:border-[#3f7fe8] transition";

  const selectClass =
    "w-full h-[38px] border-b border-[#d9dfe7] bg-transparent px-2 text-[12px] text-[#46596d] outline-none focus:border-[#3f7fe8] transition appearance-none";

  const labelClass =
    "text-[12px] text-[#63758a] whitespace-nowrap";

  const textAreaClass =
    "w-full min-h-[92px] border-b border-[#d9dfe7] bg-transparent px-2 py-2 text-[12px] text-[#46596d] outline-none resize-y focus:border-[#3f7fe8]";

  return (
    <div className="min-h-full bg-[#eaf2fb] p-3">

      {/* =====================================================
          MAIN ERP CARD
      ====================================================== */}
      <div className="relative bg-white min-h-[calc(100vh-95px)] border border-[#dce4ec]">

        {/* =====================================================
            TITLE RIBBON
        ====================================================== */}
        <div className="absolute -top-[5px] left-[-1px] z-10">

          <div className="relative bg-[#0867f2] text-white px-3 py-[7px] text-[12px] font-semibold shadow-[0_5px_14px_rgba(0,92,220,0.28)]">

            Ticket Master

            <div className="absolute left-0 bottom-[-5px] border-t-[5px] border-t-[#074db6] border-l-[5px] border-l-transparent" />

          </div>

        </div>


        {/* =====================================================
            LIST PAGE
        ====================================================== */}
        {activePage === "list" && (

          <div className="pt-[40px]">

            {/* =================================================
                TOOLBAR
            ================================================= */}
            <div className="mx-3 h-[38px] bg-[#304986] flex items-center px-3 gap-2">

              {/* NEW */}
              <button
                type="button"
                onClick={openNewTicket}
                className="h-[28px] px-2 text-[11px] text-white hover:bg-[#41609e] flex items-center gap-1"
              >
                <Plus size={13} />
                New
              </button>


              {/* PRINT */}
              <button
                type="button"
                className="h-[28px] px-2 text-[11px] text-white hover:bg-[#41609e] flex items-center gap-1"
              >
                <FileText size={13} />
                Print
              </button>


              {/* EXCEL */}
              <button
                type="button"
                className="h-[28px] px-2 text-[11px] text-white hover:bg-[#41609e] flex items-center gap-1"
              >
                <FileSpreadsheet size={13} />
                Excel
              </button>


              {/* DATE FILTER */}
              <div className="ml-8 flex items-center gap-2 text-[12px] text-white">

                <span>From</span>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-[25px] bg-white text-[#37475a] px-1 text-[11px] border border-[#cbd4df]"
                />

                <span>To</span>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-[25px] bg-white text-[#37475a] px-1 text-[11px] border border-[#cbd4df]"
                />

                <button
                  type="button"
                  className="w-[28px] h-[28px] flex items-center justify-center hover:bg-[#41609e]"
                >
                  <Search size={15} />
                </button>

              </div>


              {/* GROUP BY / SHOW */}
              <div className="ml-auto flex items-center gap-2 text-[12px] text-white">

                <span>Group By</span>

                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="h-[25px] bg-white text-[#37475a] px-1 pr-6 text-[11px] border border-[#cbd4df]"
                >
                  <option>CompanyName</option>
                  <option>ContactPerson</option>
                  <option>Status</option>
                  <option>Priority</option>
                </select>


                <span className="ml-3">
                  Show
                </span>

                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="h-[25px] bg-white text-[#37475a] px-1 text-[11px] border border-[#cbd4df]"
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>

                <span>
                  entries
                </span>

              </div>

            </div>


            {/* =================================================
                TABLE INFO
            ================================================== */}
            <div className="px-3 py-2 text-[12px] text-[#555]">

              Showing{" "}
              {filteredTickets.length > 0 ? 1 : 0}{" "}
              to{" "}
              {filteredTickets.length}{" "}
              of{" "}
              {filteredTickets.length}{" "}
              entries

            </div>


            {/* =================================================
                TABLE
            ================================================== */}
            <div className="px-3 overflow-x-auto">

              <table className="w-full min-w-[1250px] border-collapse text-[12px]">

                {/* TABLE HEADER */}
                <thead>

                  <tr className="bg-[#f3f5fa]">

                    {[
                      "TicketNo",
                      "Month",
                      "Date",
                      "CompanyName",
                      "ContactPerson",
                      "ContactNo",
                      "Problem",
                      "_Priority",
                      "AssignTo",
                      "Status",
                      "EntryBy",
                    ].map((head) => (

                      <th
                        key={head}
                        className="border border-[#d8dee8] px-2 py-2 text-center font-semibold text-[#35445b] whitespace-nowrap"
                      >
                        {head}
                      </th>

                    ))}

                  </tr>


                  {/* FILTER ROW */}
                  <tr className="bg-[#fafbfd]">

                    {[
                      "TicketNo",
                      "Month",
                      "Date",
                      "CompanyName",
                      "ContactPerson",
                      "ContactNo",
                      "Problem",
                      "_Priority",
                      "AssignTo",
                      "Status",
                      "EntryBy",
                    ].map((head) => (

                      <th
                        key={head}
                        className="border border-[#d8dee8] p-1"
                      >

                        <input
                          placeholder={head}
                          className="w-full h-[27px] border border-[#cbd3de] px-2 text-[11px] font-normal text-[#555] outline-none focus:border-[#4a82d8]"
                        />

                      </th>

                    ))}

                  </tr>

                </thead>


                {/* TABLE BODY */}
                <tbody>

                  {filteredTickets.length === 0 ? (

                    <tr>

                      <td
                        colSpan="11"
                        className="border border-[#d8dee8] text-center py-3 text-[#777]"
                      >
                        No data available in table
                      </td>

                    </tr>

                  ) : (

                    filteredTickets.map((ticket, index) => (

                      <tr
                        key={ticket.TicketID ?? ticket.id ?? index}
                        onDoubleClick={() => openTicket(ticket)}
                        className="cursor-pointer hover:bg-[#f1f5fb]"
                      >

                        <td className="border border-[#dce1e9] px-2 py-[7px] whitespace-nowrap">
                          {ticket.TicketNo}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px] whitespace-nowrap">
                          {ticket.Month}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px] whitespace-nowrap">
                          {ticket.Date}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.CompanyName}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.ContactPerson}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.ContactNo}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.Problem}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.Priority}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.AssignTo}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.Status}
                        </td>

                        <td className="border border-[#dce1e9] px-2 py-[7px]">
                          {ticket.EntryBy}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* =====================================================
            FORM PAGE
        ====================================================== */}
        {activePage === "form" && (

          <div className="pt-[48px] px-3">

            {/* BACK */}
            <button
              type="button"
              onClick={() => setActivePage("list")}
              className="absolute top-[57px] right-4 text-[11px] text-[#52667d] hover:text-[#0867f2] flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              Back to List
            </button>


            {/* =================================================
                TABS
            ================================================== */}
            <div className="flex items-center gap-2 mb-4">

              {/* TICKET DETAIL */}
              <button
                type="button"
                onClick={() => setActiveTab("detail")}
                className={`px-4 py-[8px] text-[12px] rounded-[4px] ${
                  activeTab === "detail"
                    ? "bg-[#2875ed] text-white shadow-[0_5px_12px_rgba(40,117,237,0.25)]"
                    : "text-[#555] bg-transparent"
                }`}
              >
                Ticket Detail
              </button>


              {/* HISTORY DETAIL */}
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-4 py-[8px] text-[12px] rounded-[4px] ${
                  activeTab === "history"
                    ? "bg-[#2875ed] text-white shadow-[0_5px_12px_rgba(40,117,237,0.25)]"
                    : "text-[#555] bg-transparent"
                }`}
              >
                History Detail
              </button>

            </div>


            {/* =================================================
                TICKET DETAIL
            ================================================== */}
            {activeTab === "detail" && (

              <div className="space-y-2">

                {/* ROW 1 */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      TicketNo
                    </label>

                    <input
                      name="TicketNo"
                      value={formData.TicketNo}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      Date
                    </label>

                    <input
                      name="Date"
                      value={formData.Date}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>

                </div>


                {/* ROW 2 */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      CompanyName
                    </label>

                    <div className="relative">

                      <input
                        name="CompanyName"
                        value={formData.CompanyName}
                        onChange={handleChange}
                        className={inputClass}
                      />

                      <button
                        type="button"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[25px] h-[32px] bg-[#2875ed] text-white flex items-center justify-center shadow-[0_5px_12px_rgba(40,117,237,0.25)]"
                      >
                        <Search size={14} />
                      </button>

                    </div>

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      ContactPerson
                    </label>

                    <input
                      name="ContactPerson"
                      value={formData.ContactPerson}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>

                </div>


                {/* ROW 3 */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      ContactNo
                    </label>

                    <input
                      name="ContactNo"
                      value={formData.ContactNo}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      EmailID
                    </label>

                    <input
                      name="EmailID"
                      value={formData.EmailID}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>

                </div>


                {/* ROW 4 */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      StartDate
                    </label>

                    <div className="relative">

                      <input
                        name="StartDate"
                        value={formData.StartDate}
                        onChange={handleChange}
                        className={`${inputClass} pr-8`}
                      />

                      <CalendarDays
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c9ab0]"
                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      EndDate
                    </label>

                    <div className="relative">

                      <input
                        name="EndDate"
                        value={formData.EndDate}
                        onChange={handleChange}
                        className={`${inputClass} pr-8`}
                      />

                      <CalendarDays
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c9ab0]"
                      />

                    </div>

                  </div>

                </div>


                {/* PROBLEM */}
                <div className="grid grid-cols-[180px_1fr] items-start">

                  <label className={`${labelClass} pt-3`}>
                    Problem
                  </label>

                  <textarea
                    name="Problem"
                    value={formData.Problem}
                    onChange={handleChange}
                    className={textAreaClass}
                  />

                </div>


                {/* REMARKS */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-start">

                    <label className={`${labelClass} pt-3`}>
                      Remarks
                    </label>

                    <textarea
                      name="Remarks"
                      value={formData.Remarks}
                      onChange={handleChange}
                      className="w-full min-h-[75px] border-b border-[#d9dfe7] bg-transparent px-2 py-2 text-[12px] outline-none resize-y focus:border-[#3f7fe8]"
                    />

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-start">

                    <label className={`${labelClass} pt-3`}>
                      OtherRemarks
                    </label>

                    <textarea
                      name="OtherRemarks"
                      value={formData.OtherRemarks}
                      onChange={handleChange}
                      className="w-full min-h-[75px] border-b border-[#d9dfe7] bg-transparent px-2 py-2 text-[12px] outline-none resize-y focus:border-[#3f7fe8]"
                    />

                  </div>

                </div>


                {/* PRIORITY / ASSIGN TO */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      Priority
                    </label>

                    <div className="relative">

                      <select
                        name="Priority"
                        value={formData.Priority}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">
                          Select
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#526a81] pointer-events-none"
                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      AssignTo
                    </label>

                    <div className="relative">

                      <select
                        name="AssignTo"
                        value={formData.AssignTo}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">
                          Select
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#526a81] pointer-events-none"
                      />

                    </div>

                  </div>

                </div>


                {/* ASSIGN BY / ENTRY BY */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      AssignBy
                    </label>

                    <div className="relative">

                      <select
                        name="AssignBy"
                        value={formData.AssignBy}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">
                          Select
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#526a81] pointer-events-none"
                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      EntryBy
                    </label>

                    <div className="relative">

                      <select
                        name="EntryBy"
                        value={formData.EntryBy}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">
                          Select
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#526a81] pointer-events-none"
                      />

                    </div>

                  </div>

                </div>


                {/* STATUS */}
                <div className="grid grid-cols-2 gap-x-5">

                  <div className="grid grid-cols-[180px_1fr] items-center">

                    <label className={labelClass}>
                      Status
                    </label>

                    <div className="relative">

                      <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">
                          Select
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#526a81] pointer-events-none"
                      />

                    </div>

                  </div>

                </div>


                {/* FILE */}
                <div className="pt-2">

                  <label className="inline-flex items-center gap-2 cursor-pointer border border-[#b9b9b9] bg-[#f5f5f5] px-2 py-[3px] text-[11px] text-[#333]">

                    <Upload size={13} />

                    Choose Files

                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                  </label>

                  <span className="ml-2 text-[11px] text-[#777]">
                    {formData.FileName || "No file chosen"}
                  </span>

                </div>


                {/* FILE NAME HEADER */}
                <div className="mt-2 w-[188px] bg-black text-white px-2 py-[9px] text-[11px] font-semibold">
                  FileName
                </div>

              </div>

            )}


            {/* =================================================
                HISTORY DETAIL
            ================================================== */}
            {activeTab === "history" && (

              <div className="border-t border-[#dce3eb] pt-1">

                <table className="w-full border-collapse text-[12px]">

                  <thead>

                    <tr className="bg-[#eef1f6]">

                      <th className="border border-[#d2d9e2] px-3 py-[5px] text-left text-[#35445b]">
                        Seq
                      </th>

                      <th className="border border-[#d2d9e2] px-3 py-[5px] text-left text-[#35445b]">
                        Date
                      </th>

                      <th className="border border-[#d2d9e2] px-3 py-[5px] text-left text-[#35445b]">
                        UserName
                      </th>

                      <th className="border border-[#d2d9e2] px-3 py-[5px] text-left text-[#35445b]">
                        Remarks
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {history.length === 0 ? (

                      <tr>

                        <td
                          colSpan="4"
                          className="border border-[#d2d9e2] text-center py-2 text-[#777]"
                        >
                          No data available in table
                        </td>

                      </tr>

                    ) : (

                      history.map((item, index) => (

                        <tr key={item.Seq ?? index}>

                          <td className="border border-[#d2d9e2] px-3 py-[5px]">
                            {item.Seq}
                          </td>

                          <td className="border border-[#d2d9e2] px-3 py-[5px]">
                            {item.Date}
                          </td>

                          <td className="border border-[#d2d9e2] px-3 py-[5px]">
                            {item.UserName}
                          </td>

                          <td className="border border-[#d2d9e2] px-3 py-[5px]">
                            {item.Remarks}
                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default TicketMaster;