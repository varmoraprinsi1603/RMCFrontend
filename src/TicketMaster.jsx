import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  History,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
  Building2,
  AlertCircle,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Image as ImageIcon,
  File,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "https://localhost:44319/api/Ticket";
const ATTACHMENT_API_URL = "https://localhost:44319/api/TicketAttachment";

/* =========================================================
   HELPERS
========================================================= */

const getValue = (obj, pascalName, camelName) =>
  obj?.[pascalName] ?? obj?.[camelName] ?? "";

const emptyForm = {
  TicketID: 0,
  TicketNo: "",
  Title: "",
  Description: "",
  CategoryID: "",
  CategoryName: "",
  Priority: "",
  CreatedDate: "",
  Status: "Open",
  AssignedTo: "",
  AssignedToName: "",
  CreatedBy: "",
  CreatedByName: "",
  AssignedDate: "",
  ResolvedDate: "",
  ClosedDate: "",

  CompanyName: "",
  ContactPerson: "",
  ContactNo: "",
  EmailID: "",

  StartDate: "",
  EndDate: "",

  Problem: "",
  Remarks: "",
  OtherRemarks: "",

  AssignBy: "",
  AssignByName: "",
};

const priorityOptions = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const statusOptions = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TicketMaster() {
  const token = localStorage.getItem("token");

  const currentUsername =
    localStorage.getItem("username") ||
    localStorage.getItem("UserName") ||
    "User";

  const roleName =
    localStorage.getItem("RoleName") ||
    localStorage.getItem("roleName") ||
    "User";

  /*
    Login implementation may store the user id under any of
    these keys. We do not invent a new API here.
  */
  const currentUserId =
    localStorage.getItem("UserID") ||
    localStorage.getItem("userID") ||
    localStorage.getItem("CreatedBy") ||
    "";

  const [page, setPage] = useState("list");
  const [formMode, setFormMode] = useState("new");

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     AUTH HEADER
  ======================================================= */

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* =======================================================
     LOAD TICKETS
  ======================================================= */

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/GetTicketList`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load tickets."
        );
      }

      const data =
        result?.Data ??
        result?.data ??
        [];

      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/GetCategories`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load categories."
        );
      }

      const data =
        result?.Data ??
        result?.data ??
        [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Category API:", err);
    }
  };

  /* =======================================================
     LOAD HISTORY
  ======================================================= */

  const loadTicketHistory = async (ticketID) => {
    if (!ticketID) {
      setHistory([]);
      return;
    }

    try {
      setHistoryLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/GetTicketHistory?TicketID=${ticketID}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load ticket history."
        );
      }

      const data =
        result?.Data ??
        result?.data ??
        [];

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("History API:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* =======================================================
     LOAD TICKET BY ID
  ======================================================= */

  const loadTicketById = async (ticketID) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/GetTicketByID?TicketID=${ticketID}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load ticket."
        );
      }

      const ticket =
        result?.Data ??
        result?.data;

      if (!ticket) {
        throw new Error("Ticket data not found.");
      }

      const mapped = mapTicketToForm(ticket);

      setFormData(mapped);
      setFormMode("edit");
      setPage("form");

      await loadTicketHistory(ticketID);
      await loadAttachments(ticketID);
    } catch (err) {
      setError(err.message || "Unable to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD ATTACHMENTS
  ======================================================= */

  const clearAttachmentPreviewUrls = () => {
    previewUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore cleanup errors.
      }
    });
    previewUrlsRef.current = [];
  };

  const loadAttachments = async (ticketID) => {
    clearAttachmentPreviewUrls();
    setAttachments([]);
    setAttachmentError("");

    if (!ticketID) return;

    try {
      setAttachmentLoading(true);

      const response = await fetch(
        `${ATTACHMENT_API_URL}/GetFiles?TicketID=${encodeURIComponent(ticketID)}`,
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
            "Unable to load attachments."
        );
      }

      const files = Array.isArray(result?.Data ?? result?.data)
        ? (result?.Data ?? result?.data)
        : [];

      const prepared = await Promise.all(
        files.map(async (file) => {
          if (!file.IsImage && !file.isImage) {
            return file;
          }

          try {
            const storedFileName =
              file.StoredFileName ?? file.storedFileName;

            const previewResponse = await fetch(
              `${ATTACHMENT_API_URL}/Download?TicketID=${encodeURIComponent(ticketID)}&fileName=${encodeURIComponent(storedFileName)}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!previewResponse.ok) {
              return file;
            }

            const blob = await previewResponse.blob();
            const previewUrl = URL.createObjectURL(blob);
            previewUrlsRef.current.push(previewUrl);

            return {
              ...file,
              previewUrl,
            };
          } catch {
            return file;
          }
        })
      );

      setAttachments(prepared);
    } catch (err) {
      setAttachmentError(
        err.message || "Unable to load attachments."
      );
    } finally {
      setAttachmentLoading(false);
    }
  };

  const handleAttachmentUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (formMode === "new" || !formData.TicketID) {
      setAttachmentError("Please save the ticket first, then upload files.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingFile(true);
      setAttachmentError("");
      setMessage("");

      const formDataUpload = new FormData();
      formDataUpload.append("TicketID", String(formData.TicketID));
      formDataUpload.append("file", file);

      const response = await fetch(
        `${ATTACHMENT_API_URL}/Upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to upload file."
        );
      }

      setMessage("File uploaded successfully.");
      await loadAttachments(formData.TicketID);
    } catch (err) {
      setAttachmentError(
        err.message || "Unable to upload file."
      );
    } finally {
      setUploadingFile(false);
      event.target.value = "";
    }
  };

  const handleAttachmentDownload = async (file) => {
    try {
      const storedFileName =
        file.StoredFileName ?? file.storedFileName;
      const displayName =
        file.FileName ?? file.fileName ?? storedFileName;

      const response = await fetch(
        `${ATTACHMENT_API_URL}/Download?TicketID=${encodeURIComponent(formData.TicketID)}&fileName=${encodeURIComponent(storedFileName)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to download file.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = displayName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setAttachmentError(
        err.message || "Unable to download file."
      );
    }
  };

  const handleAttachmentPreview = async (file) => {
    try {
      const existingPreview =
        file.previewUrl ?? file.PreviewUrl;

      if (existingPreview) {
        setPreviewImage({
          url: existingPreview,
          name: file.FileName ?? file.fileName ?? "Attachment",
        });
        return;
      }

      const storedFileName =
        file.StoredFileName ?? file.storedFileName;

      const response = await fetch(
        `${ATTACHMENT_API_URL}/Download?TicketID=${encodeURIComponent(formData.TicketID)}&fileName=${encodeURIComponent(storedFileName)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to preview file.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      previewUrlsRef.current.push(url);

      setPreviewImage({
        url,
        name: file.FileName ?? file.fileName ?? "Attachment",
      });
    } catch (err) {
      setAttachmentError(
        err.message || "Unable to preview file."
      );
    }
  };

  const handleAttachmentDelete = async (file) => {
    const displayName =
      file.FileName ?? file.fileName ?? "this file";

    if (!window.confirm(`Delete attachment "${displayName}"?`)) {
      return;
    }

    try {
      setAttachmentLoading(true);
      setAttachmentError("");

      const storedFileName =
        file.StoredFileName ?? file.storedFileName;

      const response = await fetch(
        `${ATTACHMENT_API_URL}/Delete?TicketID=${encodeURIComponent(formData.TicketID)}&fileName=${encodeURIComponent(storedFileName)}`,
        {
          method: "DELETE",
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
            "Unable to delete attachment."
        );
      }

      setMessage("Attachment deleted successfully.");
      await loadAttachments(formData.TicketID);
    } catch (err) {
      setAttachmentError(
        err.message || "Unable to delete attachment."
      );
    } finally {
      setAttachmentLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      clearAttachmentPreviewUrls();
    };
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!token) return;

    loadTickets();
    loadCategories();
  }, []);

  /* =======================================================
     MAP API TICKET TO FORM
  ======================================================= */

  const mapTicketToForm = (ticket) => ({
    TicketID: getValue(ticket, "TicketID", "ticketID"),
    TicketNo: getValue(ticket, "TicketNo", "ticketNo"),

    Title: getValue(ticket, "Title", "title"),
    Description: getValue(
      ticket,
      "Description",
      "description"
    ),

    CategoryID: getValue(
      ticket,
      "CategoryID",
      "categoryID"
    ),

    CategoryName: getValue(
      ticket,
      "CategoryName",
      "categoryName"
    ),

    Priority: getValue(
      ticket,
      "Priority",
      "priority"
    ),

    CreatedDate: getValue(
      ticket,
      "CreatedDate",
      "createdDate"
    ),

    Status:
      getValue(ticket, "Status", "status") ||
      "Open",

    AssignedTo: getValue(
      ticket,
      "AssignedTo",
      "assignedTo"
    ),

    AssignedToName: getValue(
      ticket,
      "AssignedToName",
      "assignedToName"
    ),

    CreatedBy: getValue(
      ticket,
      "CreatedBy",
      "createdBy"
    ),

    CreatedByName: getValue(
      ticket,
      "CreatedByName",
      "createdByName"
    ),

    AssignedDate: getValue(
      ticket,
      "AssignedDate",
      "assignedDate"
    ),

    ResolvedDate: getValue(
      ticket,
      "ResolvedDate",
      "resolvedDate"
    ),

    ClosedDate: getValue(
      ticket,
      "ClosedDate",
      "closedDate"
    ),

    CompanyName: getValue(
      ticket,
      "CompanyName",
      "companyName"
    ),

    ContactPerson: getValue(
      ticket,
      "ContactPerson",
      "contactPerson"
    ),

    ContactNo: getValue(
      ticket,
      "ContactNo",
      "contactNo"
    ),

    EmailID: getValue(
      ticket,
      "EmailID",
      "emailID"
    ),

    StartDate: getValue(
      ticket,
      "StartDate",
      "startDate"
    ),

    EndDate: getValue(
      ticket,
      "EndDate",
      "endDate"
    ),

    Problem: getValue(
      ticket,
      "Problem",
      "problem"
    ),

    Remarks: getValue(
      ticket,
      "Remarks",
      "remarks"
    ),

    OtherRemarks: getValue(
      ticket,
      "OtherRemarks",
      "otherRemarks"
    ),

    AssignBy: getValue(
      ticket,
      "AssignBy",
      "assignBy"
    ),

    AssignByName: getValue(
      ticket,
      "AssignByName",
      "assignByName"
    ),
  });

  /* =======================================================
     NEW TICKET
  ======================================================= */

  const openNewTicket = () => {
    setMessage("");
    setError("");
    setHistory([]);
    clearAttachmentPreviewUrls();
    setAttachments([]);
    setAttachmentError("");

    setFormData({
      ...emptyForm,

      TicketID: 0,

      TicketNo: "",

      CreatedDate: new Date().toISOString(),

      Status: "Open",

      CreatedBy: currentUserId,

      CreatedByName: currentUsername,

      AssignBy: currentUserId,

      AssignByName: "",
    });

    setFormMode("new");
    setPage("form");
  };

  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =======================================================
     SAVE / UPDATE
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!formData.Title?.trim()) {
        setError("Title is required.");
        return;
      }

      if (!formData.CategoryID) {
        setError("Category is required.");
        return;
      }

      if (!formData.Priority) {
        setError("Priority is required.");
        return;
      }

      /*
        AddTicket requires CreatedBy.
        If login does not currently store UserID,
        do not send a fake numeric ID.
      */
      const createdBy = Number(
        formData.CreatedBy || currentUserId
      );

      if (formMode === "new" && createdBy <= 0) {
        setError(
          "Logged-in UserID is not available. Please make sure Login stores UserID in localStorage."
        );
        return;
      }

      let response;

      if (formMode === "new") {
        const payload = {
          TicketNo: formData.TicketNo || null,
          Title: formData.Title,
          Description:
            formData.Description || null,

          CategoryID: Number(
            formData.CategoryID
          ),

          Priority: formData.Priority,

          CreatedBy: createdBy,

          CompanyName:
            formData.CompanyName || null,

          ContactPerson:
            formData.ContactPerson || null,

          ContactNo:
            formData.ContactNo || null,

          EmailID:
            formData.EmailID || null,

          StartDate:
            formData.StartDate || null,

          EndDate:
            formData.EndDate || null,

          Problem:
            formData.Problem || null,

          Remarks:
            formData.Remarks || null,

          OtherRemarks:
            formData.OtherRemarks || null,

          AssignBy:
            formData.AssignBy
              ? Number(formData.AssignBy)
              : null,

          AssignByName:
            formData.AssignByName || null,

          AssignedToName:
            formData.AssignedToName || null,
        };

        response = await fetch(
          `${API_BASE_URL}/AddTicket`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(payload),
          }
        );
      } else {
        const payload = {
          TicketID: Number(formData.TicketID),

          TicketNo:
            formData.TicketNo || null,

          Title: formData.Title,

          Description:
            formData.Description || null,

          CategoryID: Number(
            formData.CategoryID
          ),

          Priority: formData.Priority,

          CompanyName:
            formData.CompanyName || null,

          ContactPerson:
            formData.ContactPerson || null,

          ContactNo:
            formData.ContactNo || null,

          EmailID:
            formData.EmailID || null,

          StartDate:
            formData.StartDate || null,

          EndDate:
            formData.EndDate || null,

          Problem:
            formData.Problem || null,

          Remarks:
            formData.Remarks || null,

          OtherRemarks:
            formData.OtherRemarks || null,

          AssignBy:
            formData.AssignBy
              ? Number(formData.AssignBy)
              : null,

          AssignedTo:
            formData.AssignedTo
              ? Number(formData.AssignedTo)
              : null,

          AssignByName:
            formData.AssignByName || null,

          AssignedToName:
            formData.AssignedToName || null,
        };

        response = await fetch(
          `${API_BASE_URL}/UpdateTicket`,
          {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify(payload),
          }
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to save ticket."
        );
      }

      setMessage(
        formMode === "new"
          ? "Ticket created successfully."
          : "Ticket updated successfully."
      );

      await loadTickets();

      /*
        After creating a new ticket, backend returns TicketID.
        Open the newly-created ticket in edit mode.
      */
      if (formMode === "new") {
        const newTicketID =
          result?.TicketID ??
          result?.ticketID;

        if (newTicketID) {
          await loadTicketById(newTicketID);
        } else {
          setPage("list");
        }
      } else {
        await loadTicketById(
          formData.TicketID
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to save ticket."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CHANGE STATUS
  ======================================================= */

  const handleStatusChange = async (newStatus) => {
    if (formMode === "new") {
      /*
        AddTicket automatically creates ticket as Open.
        We keep the UI value but do not call ChangeStatus
        before the ticket exists.
      */
      handleChange("Status", newStatus);
      return;
    }

    const oldStatus = formData.Status;

    if (!newStatus || newStatus === oldStatus) {
      return;
    }

    const changedBy = Number(
      currentUserId ||
        formData.CreatedBy ||
        0
    );

    if (changedBy <= 0) {
      setError(
        "Logged-in UserID is not available for status change."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const query =
        `TicketID=${encodeURIComponent(
          formData.TicketID
        )}` +
        `&Status=${encodeURIComponent(
          newStatus
        )}` +
        `&OldStatus=${encodeURIComponent(
          oldStatus || ""
        )}` +
        `&ChangedBy=${encodeURIComponent(
          changedBy
        )}`;

      const response = await fetch(
        `${API_BASE_URL}/ChangeStatus?${query}`,
        {
          method: "PUT",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to change status."
        );
      }

      setFormData((prev) => ({
        ...prev,
        Status: newStatus,
      }));

      setMessage(
        "Ticket status updated successfully."
      );

      await loadTickets();
      await loadTicketHistory(
        formData.TicketID
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to change ticket status."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     FILTERED TICKETS
  ======================================================= */

  const filteredTickets = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    return tickets.filter((ticket) => {
      const ticketNo = String(
        getValue(
          ticket,
          "TicketNo",
          "ticketNo"
        )
      ).toLowerCase();

      const title = String(
        getValue(
          ticket,
          "Title",
          "title"
        )
      ).toLowerCase();

      const company = String(
        getValue(
          ticket,
          "CompanyName",
          "companyName"
        )
      ).toLowerCase();

      const contact = String(
        getValue(
          ticket,
          "ContactPerson",
          "contactPerson"
        )
      ).toLowerCase();

      const status = String(
        getValue(
          ticket,
          "Status",
          "status"
        )
      );

      const priority = String(
        getValue(
          ticket,
          "Priority",
          "priority"
        )
      );

      const matchesSearch =
        !search ||
        ticketNo.includes(search) ||
        title.includes(search) ||
        company.includes(search) ||
        contact.includes(search);

      const matchesStatus =
        !statusFilter ||
        status === statusFilter;

      const matchesPriority =
        !priorityFilter ||
        priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tickets,
    searchText,
    statusFilter,
    priorityFilter,
  ]);

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const toInputDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date
      .toISOString()
      .split("T")[0];
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleCancel = () => {
    setMessage("");
    setError("");
    setHistory([]);
    clearAttachmentPreviewUrls();
    setAttachments([]);
    setAttachmentError("");
    setPage("list");
  };

  /* =======================================================
     DELETE PLACEHOLDER
  ======================================================= */

  const handleDelete = async () => {
  if (
    formMode === "new" ||
    !formData.TicketID
  ) {
    alert("Please save the ticket first.");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ticket ${formData.TicketNo || ""}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch(
      `${API_BASE_URL}/DeleteTicket?TicketID=${encodeURIComponent(
        formData.TicketID
      )}`,
      {
        method: "DELETE",
        headers: authHeaders,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.Message ||
          result?.message ||
          "Unable to delete ticket."
      );
    }

    setMessage(
      result?.Message ||
        result?.message ||
        "Ticket deleted successfully."
    );

    await loadTickets();

    setFormData(emptyForm);
    setHistory([]);
    clearAttachmentPreviewUrls();
    setAttachments([]);
    setAttachmentError("");

    setTimeout(() => {
      setPage("list");
      setMessage("");
    }, 500);
  } catch (err) {
    setError(
      err.message ||
        "Unable to delete ticket."
    );
  } finally {
    setSaving(false);
  }
};

  /* =======================================================
     CATEGORY NAME
  ======================================================= */

  const selectedCategoryName =
    categories.find(
      (x) =>
        String(
          getValue(
            x,
            "CategoryID",
            "categoryID"
          )
        ) ===
        String(formData.CategoryID)
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#eef3f9] text-[#173b68]">
      <div className="w-full">

        {/* =================================================
            LIST PAGE
        ================================================== */}

        {page === "list" && (
          <div className="space-y-5">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#eaf3fc] text-[#1768ad] flex items-center justify-center">
                    <FileText size={18} />
                  </div>

                  <div>
                    <h1 className="text-[22px] font-semibold text-[#14385f]">
                      Ticket Master
                    </h1>

                    <p className="text-[12px] text-[#8a9aae]">
                      Manage service tickets and support requests
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={loadTickets}
                  className="h-10 px-4 rounded-lg border border-[#d8e3ee] bg-white text-[#42627f] text-[13px] font-medium hover:bg-[#f6f9fc] flex items-center gap-2"
                >
                  <RefreshCw
                    size={15}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={openNewTicket}
                  className="h-10 px-4 rounded-lg bg-[#176bb3] text-white text-[13px] font-semibold hover:bg-[#125b98] shadow-[0_7px_18px_rgba(23,107,179,0.18)] flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Ticket
                </button>

              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

            {/* FILTER BAR */}
            <div className="bg-white border border-[#dce6ef] rounded-xl p-4 shadow-[0_5px_20px_rgba(26,65,100,0.04)]">

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

                <div className="relative xl:col-span-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8da0b3]"
                  />

                  <input
                    value={searchText}
                    onChange={(e) =>
                      setSearchText(
                        e.target.value
                      )
                    }
                    placeholder="Search ticket, company, contact or title..."
                    className="w-full h-10 rounded-lg border border-[#d9e4ee] bg-[#fbfdff] pl-9 pr-3 text-[13px] outline-none focus:border-[#5c91bf]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="h-10 rounded-lg border border-[#d9e4ee] bg-[#fbfdff] px-3 text-[13px] outline-none focus:border-[#5c91bf]"
                >
                  <option value="">
                    All Status
                  </option>

                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(
                      e.target.value
                    )
                  }
                  className="h-10 rounded-lg border border-[#d9e4ee] bg-[#fbfdff] px-3 text-[13px] outline-none focus:border-[#5c91bf]"
                >
                  <option value="">
                    All Priority
                  </option>

                  {priorityOptions.map(
                    (priority) => (
                      <option
                        key={priority}
                        value={priority}
                      >
                        {priority}
                      </option>
                    )
                  )}
                </select>

              </div>
            </div>

            {/* TICKETS */}
            {loading && tickets.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#dce6ef] p-10 text-center text-[13px] text-[#8295a9]">
                Loading tickets...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#dce6ef] p-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-[#eef5fb] flex items-center justify-center text-[#6c91b2]">
                  <FileText size={22} />
                </div>

                <div className="mt-4 text-[15px] font-semibold text-[#315574]">
                  No tickets found
                </div>

                <p className="mt-1 text-[12px] text-[#91a0af]">
                  Create a new ticket or change your filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {filteredTickets.map(
                  (ticket, index) => {

                    const ticketID =
                      getValue(
                        ticket,
                        "TicketID",
                        "ticketID"
                      );

                    const ticketNo =
                      getValue(
                        ticket,
                        "TicketNo",
                        "ticketNo"
                      );

                    const title =
                      getValue(
                        ticket,
                        "Title",
                        "title"
                      );

                    const company =
                      getValue(
                        ticket,
                        "CompanyName",
                        "companyName"
                      );

                    const contact =
                      getValue(
                        ticket,
                        "ContactPerson",
                        "contactPerson"
                      );

                    const problem =
                      getValue(
                        ticket,
                        "Problem",
                        "problem"
                      );

                    const priority =
                      getValue(
                        ticket,
                        "Priority",
                        "priority"
                      );

                    const status =
                      getValue(
                        ticket,
                        "Status",
                        "status"
                      );

                    const assignedTo =
                      getValue(
                        ticket,
                        "AssignedToName",
                        "assignedToName"
                      );

                    const createdBy =
                      getValue(
                        ticket,
                        "CreatedByName",
                        "createdByName"
                      );

                    const createdDate =
                      getValue(
                        ticket,
                        "CreatedDate",
                        "createdDate"
                      );

                    return (
                      <button
                        key={
                          ticketID ||
                          `${ticketNo}-${index}`
                        }
                        type="button"
                        onClick={() =>
                          loadTicketById(
                            ticketID
                          )
                        }
                        className="w-full text-left bg-white border border-[#dce6ef] rounded-xl p-4 hover:border-[#8bb5d6] hover:shadow-[0_8px_25px_rgba(25,75,115,0.07)] transition"
                      >

                        <div className="flex flex-col xl:flex-row xl:items-center gap-4">

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="text-[14px] font-semibold text-[#155a92]">
                                {ticketNo ||
                                  "Ticket"}
                              </span>

                              <StatusBadge
                                status={
                                  status
                                }
                              />

                              <PriorityBadge
                                priority={
                                  priority
                                }
                              />

                            </div>  

                            <div className="mt-2 text-[14px] font-semibold text-[#294e70] truncate">
                              {title ||
                                problem ||
                                "Ticket Issue"}
                            </div>

                            <div className="mt-1 text-[12px] text-[#8294a7] line-clamp-1">
                              {problem ||
                                "No problem description"}
                            </div>

                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 xl:w-[610px]">

                            <InfoSmall
                              icon={
                                <Building2
                                  size={14}
                                />
                              }
                              label="Company"
                              value={
                                company ||
                                "-"
                              }
                            />

                            <InfoSmall
                              icon={
                                <UserRound
                                  size={14}
                                />
                              }
                              label="Contact"
                              value={
                                contact ||
                                "-"
                              }
                            />

                            <InfoSmall
                              icon={
                                <Users
                                  size={14}
                                />
                              }
                              label="Assigned To"
                              value={
                                assignedTo ||
                                "-"
                              }
                            />

                            <InfoSmall
                              icon={
                                <Clock3
                                  size={14}
                                />
                              }
                              label="Created"
                              value={formatDate(
                                createdDate
                              )}
                            />

                          </div>

                        </div>

                        <div className="mt-3 pt-3 border-t border-[#edf1f5] flex items-center justify-between text-[11px] text-[#92a1b0]">

                          <span>
                            Entry By:{" "}
                            <span className="text-[#627b92]">
                              {createdBy ||
                                "-"}
                            </span>
                          </span>

                          <span className="text-[#176bb3] font-medium">
                            Open Ticket →
                          </span>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>
        )}

        {/* =================================================
            FORM PAGE
        ================================================== */}

        {page === "form" && (
          <div className="space-y-5">

            {/* FORM HEADER */}
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-10 h-10 rounded-lg border border-[#d7e2ec] bg-white text-[#52708d] flex items-center justify-center hover:bg-[#f7fafc]"
                >
                  <ArrowLeft
                    size={18}
                  />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[22px] font-semibold text-[#14385f]">
                      {formMode === "new"
                        ? "New Ticket"
                        : "Edit Ticket"}
                    </h1>

                    {formMode ===
                      "edit" &&
                      formData.TicketNo && (
                        <span className="px-2 py-1 rounded-md bg-[#eaf3fc] text-[#1768ad] text-[11px] font-semibold">
                          {
                            formData.TicketNo
                          }
                        </span>
                      )}
                  </div>

                  <p className="text-[12px] text-[#8a9aae]">
                    {formMode === "new"
                      ? "Create a new service ticket"
                      : "Edit existing ticket details"}
                  </p>
                </div>

              </div>

              {formMode ===
                "edit" && (
                <div className="flex items-center gap-2">

                  <StatusBadge
                    status={
                      formData.Status
                    }
                  />

                  <PriorityBadge
                    priority={
                      formData.Priority
                    }
                  />

                </div>
              )}

            </div>

            {/* MESSAGE */}
            {message && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

            {/* =================================================
                01 BASIC
            ================================================== */}

            <Section
              number="01"
              title="What do you need help with?"
              subtitle="Ticket identification and issue information"
              icon={<FileText size={17} />}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <Field
                  label="Ticket No"
                >
                  <input
                    value={
                      formData.TicketNo
                    }
                    onChange={(e) =>
                      handleChange(
                        "TicketNo",
                        e.target.value
                      )
                    }
                    placeholder="Enter Ticket No"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Title"
                  required
                >
                  <input
                    value={
                      formData.Title
                    }
                    onChange={(e) =>
                      handleChange(
                        "Title",
                        e.target.value
                      )
                    }
                    placeholder="Enter ticket title"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Category"
                  required
                >
                  <SelectBox
                    value={
                      formData.CategoryID
                    }
                    onChange={(e) =>
                      handleChange(
                        "CategoryID",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={getValue(
                            category,
                            "CategoryID",
                            "categoryID"
                          )}
                          value={getValue(
                            category,
                            "CategoryID",
                            "categoryID"
                          )}
                        >
                          {getValue(
                            category,
                            "CategoryName",
                            "categoryName"
                          )}
                        </option>
                      )
                    )}
                  </SelectBox>
                </Field>

                <Field
                  label="Ticket Date"
                >
                  <div className="relative">
                    <input
                      type="date"
                      
                      value={toInputDate(
                        formData.CreatedDate
                      )}
                      readOnly
                      className={`${inputClass} pr-10 bg-[#f7f9fb]`}
                    />

                    <CalendarDays
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#91a2b3]"
                    />
                  </div>
                </Field>

              </div>

              <div className="mt-5">
                <Field
                  label="Description"
                >
                  <textarea
                    value={
                      formData.Description
                    }
                    onChange={(e) =>
                      handleChange(
                        "Description",
                        e.target.value
                      )
                    }
                    placeholder="Enter ticket description"
                    rows={3}
                    className={textareaClass}
                  />
                </Field>
              </div>

            </Section>

            {/* =================================================
                02 CUSTOMER
            ================================================== */}

            <Section
              number="02"
              title="Customer"
              subtitle="Customer and contact information"
              icon={<Building2 size={17} />}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Field label="Company Name">
                  <input
                    value={
                      formData.CompanyName
                    }
                    onChange={(e) =>
                      handleChange(
                        "CompanyName",
                        e.target.value
                      )
                    }
                    placeholder="Enter company name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Contact Person">
                  <input
                    value={
                      formData.ContactPerson
                    }
                    onChange={(e) =>
                      handleChange(
                        "ContactPerson",
                        e.target.value
                      )
                    }
                    placeholder="Enter contact person"
                    className={inputClass}
                  />
                </Field>

                <Field label="Contact No">
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea2b5]"
                    />

                    <input
                      value={
                        formData.ContactNo
                      }
                      onChange={(e) =>
                        handleChange(
                          "ContactNo",
                          e.target.value
                        )
                      }
                      placeholder="Enter contact number"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Email ID">
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea2b5]"
                    />

                    <input
                      type="email"
                      value={
                        formData.EmailID
                      }
                      onChange={(e) =>
                        handleChange(
                          "EmailID",
                          e.target.value
                        )
                      }
                      placeholder="Enter email ID"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

              </div>

            </Section>

            {/* =================================================
                03 SERVICE CONTEXT
            ================================================== */}

            <Section
              number="03"
              title="Service Context"
              subtitle="Dates and ticket priority"
              icon={
                <CalendarDays
                  size={17}
                />
              }
            >

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                  
                <Field label="Start Date">
                  <input
                    type="date"
                    value={toInputDate(
                      formData.StartDate
                    )}
                    onChange={(e) =>
                      handleChange(
                        "StartDate",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="date"
                    value={toInputDate(
                      formData.EndDate
                    )}
                    onChange={(e) =>
                      handleChange(
                        "EndDate",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Priority"
                  required
                >
                  <SelectBox
                    value={
                      formData.Priority
                    }
                    onChange={(e) =>
                      handleChange(
                        "Priority",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Priority
                    </option>

                    {priorityOptions.map(
                      (priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority}
                        </option>
                      )
                    )}
                  </SelectBox>
                </Field>

              </div>

            </Section>

            {/* =================================================
                04 ASSIGNMENT
            ================================================== */}

            <Section
              number="04"
              title="Assignment"
              subtitle="Ticket assignment information"
              icon={<Users size={17} />}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <Field label="Assign By">
                  <input
                    type="text"
                    value={formData.AssignByName || ""}
                    onChange={(e) =>
                      handleChange(
                        "AssignByName",
                        e.target.value
                      )
                    }
                    placeholder="Assign By"
                    className={inputClass}
                  />
                </Field>

                <Field label="Assign To">
                  <input
                    type="text"
                    value={formData.AssignedToName || ""}
                    onChange={(e) =>
                      handleChange(
                        "AssignedToName",
                        e.target.value
                      )
                    }
                    placeholder="Assign To"
                    className={inputClass}
                  />
                </Field>

                <Field label="Status">
                  <SelectBox
                    value={
                      formData.Status ||
                      "Open"
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value
                      )
                    }
                  >
                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </SelectBox>
                </Field>

                <Field label="Entry By">
                  <input
                    value={
                      formData.CreatedByName ||
                      currentUsername
                    }
                    readOnly
                    className={`${inputClass} bg-[#f7f9fb]`}
                  />
                </Field>

              </div>

            </Section>

            {/* =================================================
                05 ISSUE / ADDITIONAL
            ================================================== */}

            <Section
              number="05"
              title="Additional Information"
              subtitle="Problem and other ticket information"
              icon={<FileText size={17} />}
            >

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                <Field label="Problem">
                  <textarea
                    value={
                      formData.Problem
                    }
                    onChange={(e) =>
                      handleChange(
                        "Problem",
                        e.target.value
                      )
                    }
                    placeholder="Enter problem"
                    rows={4}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Remarks">
                  <textarea
                    value={
                      formData.Remarks
                    }
                    onChange={(e) =>
                      handleChange(
                        "Remarks",
                        e.target.value
                      )
                    }
                    placeholder="Enter remarks"
                    rows={4}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Other Remarks">
                  <textarea
                    value={
                      formData.OtherRemarks
                    }
                    onChange={(e) =>
                      handleChange(
                        "OtherRemarks",
                        e.target.value
                      )
                    }
                    placeholder="Enter other remarks"
                    rows={4}
                    className={textareaClass}
                  />
                </Field>

               
              </div>

            </Section>

            {/* =================================================
                06 ATTACHMENTS
            ================================================== */}

            <Section
              number="06"
              title="Attachments"
              subtitle="Upload photos and supporting documents for this ticket"
              icon={<FileText size={17} />}
            >

              <div className="space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-dashed border-[#bfd2e2] bg-[#f8fbfe]">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eaf3fc] text-[#1768ad] flex items-center justify-center">
                      <Upload size={18} />
                    </div>

                    <div>
                      <div className="text-[13px] font-semibold text-[#294e70]">
                        Upload Attachment
                      </div>
                      <div className="text-[11px] text-[#8a9bad] mt-0.5">
                        Images, PDF, Word, Excel or text files · Maximum 10 MB
                      </div>
                    </div>
                  </div>

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleAttachmentUpload}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (formMode === "new" || !formData.TicketID) {
                          setAttachmentError("Please save the ticket first, then upload files.");
                          return;
                        }
                        fileInputRef.current?.click();
                      }}
                      disabled={uploadingFile}
                      className="h-10 px-4 rounded-lg bg-[#176bb3] text-white text-[12px] font-semibold hover:bg-[#125b98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {uploadingFile ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Upload size={15} />
                      )}
                      {uploadingFile ? "Uploading..." : "Choose File"}
                    </button>
                  </div>

                </div>

                {attachmentError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-700">
                    {attachmentError}
                  </div>
                )}

                {formMode === "new" && (
                  <div className="text-[11px] text-[#8a9bad]">
                    Save the ticket first to enable attachments.
                  </div>
                )}

                {attachmentLoading ? (
                  <div className="py-7 text-center text-[12px] text-[#8a9bad]">
                    Loading attachments...
                  </div>
                ) : attachments.length === 0 ? (
                  <div className="py-7 text-center border border-[#edf1f5] rounded-xl bg-white text-[12px] text-[#8a9bad]">
                    No attachments uploaded for this ticket.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {attachments.map((file, index) => {
                      const fileName = file.FileName ?? file.fileName ?? "Attachment";
                      const storedFileName = file.StoredFileName ?? file.storedFileName ?? "";
                      const isImage = file.IsImage ?? file.isImage ?? false;
                      const previewUrl = file.previewUrl ?? file.PreviewUrl;
                      const size = Number(file.Size ?? file.size ?? 0);
                      const sizeText = size > 1024 * 1024
                        ? `${(size / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.max(1, Math.round(size / 1024))} KB`;

                      return (
                        <div
                          key={`${storedFileName}-${index}`}
                          className="border border-[#dce6ef] rounded-xl overflow-hidden bg-white"
                        >
                          {isImage && previewUrl ? (
                            <button
                              type="button"
                              onClick={() => handleAttachmentPreview(file)}
                              className="w-full h-36 bg-[#f6f9fc] flex items-center justify-center overflow-hidden"
                            >
                              <img
                                src={previewUrl}
                                alt={fileName}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ) : (
                            <div className="h-36 bg-[#f6f9fc] flex items-center justify-center text-[#6d91b0]">
                              {isImage ? (
                                <ImageIcon size={34} />
                              ) : (
                                <FileText size={34} />
                              )}
                            </div>
                          )}

                          <div className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="text-[12px] font-semibold text-[#315574] truncate" title={fileName}>
                                  {fileName}
                                </div>
                                <div className="text-[10px] text-[#93a2b0] mt-1">
                                  {sizeText}
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  isImage
                                    ? handleAttachmentPreview(file)
                                    : handleAttachmentDownload(file)
                                }
                                className="h-8 px-3 rounded-md border border-[#d7e2ec] bg-white text-[#4d6b86] text-[11px] font-semibold hover:bg-[#f6f9fc] flex items-center gap-1.5"
                              >
                                {isImage ? <Eye size={13} /> : <Download size={13} />}
                                {isImage ? "Preview" : "Download"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAttachmentDownload(file)}
                                className="h-8 px-3 rounded-md border border-[#d7e2ec] bg-white text-[#4d6b86] text-[11px] font-semibold hover:bg-[#f6f9fc] flex items-center gap-1.5"
                              >
                                <Download size={13} />
                                Download
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAttachmentDelete(file)}
                                className="ml-auto h-8 w-8 rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 flex items-center justify-center"
                                title="Delete attachment"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </Section>

            {/* =================================================
                ACTIVITY / HISTORY
            ================================================== */}

            {formMode === "edit" && (
  <Section
    number="07"
    title="Activity"
    subtitle="Ticket history"
    icon={<History size={17} />}
  >

                {historyLoading ? (
                  <div className="py-8 text-center text-[13px] text-[#8a9bad]">
                    Loading activity...
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-[#8a9bad]">
                    No activity available for this ticket.
                  </div>
                ) : (
                  <div className="relative ml-2">

                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#dce7f0]" />

                    <div className="space-y-5">

                      {history.map(
                        (item, index) => {

                          const oldStatus =
                            getValue(
                              item,
                              "OldStatus",
                              "oldStatus"
                            );

                          const newStatus =
                            getValue(
                              item,
                              "NewStatus",
                              "newStatus"
                            );

                          const changedBy =
                            getValue(
                              item,
                              "ChangedByName",
                              "changedByName"
                            );

                          const changedDate =
                            getValue(
                              item,
                              "ChangedDate",
                              "changedDate"
                            );

                          return (
                            <div
                              key={
                                getValue(
                                  item,
                                  "TicketStatusHistoryID",
                                  "ticketStatusHistoryID"
                                ) ||
                                index
                              }
                              className="relative pl-7"
                            >

                              <div className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-[#176bb3] border-[3px] border-white shadow-[0_0_0_1px_#c8d9e7]" />

                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">

                                <div>
                                  <div className="text-[13px] font-semibold text-[#294e70]">
                                    {changedBy ||
                                      "System"}
                                  </div>

                                  <div className="mt-1 text-[12px] text-[#687f95]">
                                    {oldStatus
                                      ? `${oldStatus} → ${newStatus}`
                                      : newStatus ||
                                        "Ticket created"}
                                  </div>
                                </div>

                                <div className="text-[11px] text-[#93a2b0]">
                                  {formatDateTime(
                                    changedDate
                                  )}
                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  </div>
                )}

              </Section>
            )}

            {/* =================================================
                IMAGE PREVIEW
            ================================================== */}

            {previewImage && (
              <div
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5"
                onClick={() => setPreviewImage(null)}
              >
                <div
                  className="relative max-w-5xl max-h-[90vh] bg-white rounded-xl p-3 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border border-[#dce6ef] text-[#526a85] flex items-center justify-center shadow"
                  >
                    <X size={15} />
                  </button>

                  <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="max-w-[85vw] max-h-[82vh] object-contain rounded-lg"
                  />

                  <div className="px-1 pt-2 text-[11px] text-[#647d95] truncate">
                    {previewImage.name}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                ACTION BAR
            ================================================== */

            <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur border border-[#dce6ef] rounded-xl p-3 shadow-[0_8px_30px_rgba(20,55,90,0.10)]">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                <div className="text-[11px] text-[#8c9aaa]">
                  {formMode === "new"
                    ? "New ticket"
                    : `Editing ${
                        formData.TicketNo ||
                        "ticket"
                      }`}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-10 px-4 rounded-lg border border-red-200 bg-white text-red-600 text-[13px] font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <Trash2
                      size={15}
                    />
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="h-10 px-5 rounded-lg border border-[#d7e2ec] bg-white text-[#536e88] text-[13px] font-semibold hover:bg-[#f6f9fc] flex items-center justify-center gap-2"
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-10 px-6 rounded-lg bg-[#176bb3] text-white text-[13px] font-semibold hover:bg-[#125b98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_7px_18px_rgba(23,107,179,0.18)]"
                  >
                    <Save
                      size={15}
                    />

                    {saving
                      ? "Saving..."
                      : "Save"}
                  </button>

                </div>

              </div>
            </div>

           }
                    </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  number,
  title,
  subtitle,
  icon,
  children,
}) {
  return (
    <section className="bg-white border border-[#dce6ef] rounded-2xl shadow-[0_5px_20px_rgba(26,65,100,0.035)] overflow-hidden">

      <div className="px-5 py-4 border-b border-[#edf1f5] flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-[#edf5fc] text-[#176bb3] flex items-center justify-center">
          {icon}
        </div>

        <div className="flex-1">

          <div className="flex items-center gap-2">

            <span className="text-[11px] font-bold text-[#6e94b3] tracking-wide">
              {number}
            </span>

            <h2 className="text-[16px] font-semibold text-[#193f65]">
              {title}
            </h2>

          </div>

          <p className="text-[11px] text-[#91a0af] mt-0.5">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required,
  children,
}) {
  return (
    <div>

      <label className="block mb-2 text-[12px] font-semibold text-[#526d86]">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      {children}

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectBox({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">

      <select
        value={value ?? ""}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8da0b3] pointer-events-none"
      />

    </div>
  );
}

/* =========================================================
   SMALL INFO
========================================================= */

function InfoSmall({
  icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-1.5 text-[10px] text-[#9aa8b6]">
        {icon}
        {label}
      </div>

      <div className="mt-0.5 text-[12px] text-[#526d86] truncate">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const value =
    status || "Open";

  const classes =
    value === "Closed"
      ? "bg-[#f1f4f7] text-[#5e7081] border-[#dce3e9]"
      : value === "Resolved"
      ? "bg-[#eef9f3] text-[#2f7d56] border-[#d6efdf]"
      : value === "In Progress"
      ? "bg-[#fff8e9] text-[#9b711e] border-[#f2e4bd]"
      : "bg-[#edf6ff] text-[#236ca5] border-[#d6e8f8]";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}

/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({ priority }) {
  const value =
    priority || "—";

  const classes =
    value === "Critical"
      ? "bg-red-50 text-red-600 border-red-100"
      : value === "High"
      ? "bg-orange-50 text-orange-600 border-orange-100"
      : value === "Medium"
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : value === "Low"
      ? "bg-slate-50 text-slate-600 border-slate-200"
      : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}

/* =========================================================
   COMMON STYLES
========================================================= */

const inputClass =
  "w-full h-11 rounded-lg border border-[#d9e4ee] bg-white px-3 text-[13px] text-[#294e70] outline-none transition focus:border-[#5b91bd] focus:ring-2 focus:ring-[#eaf3fa] placeholder:text-[#a4b1be]";

const textareaClass =
  "w-full rounded-lg border border-[#d9e4ee] bg-white px-3 py-3 text-[13px] text-[#294e70] outline-none transition focus:border-[#5b91bd] focus:ring-2 focus:ring-[#eaf3fa] placeholder:text-[#a4b1be] resize-y";