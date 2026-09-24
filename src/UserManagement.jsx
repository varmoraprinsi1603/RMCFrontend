import React, { useEffect, useMemo, useState } from "react";

function UserManagement() {
  const API_BASE = "https://localhost:44319/api/UserMaster";

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [editingUser, setEditingUser] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    UserID: 0,
    UserName: "",
    Password: "",
    Name: "",
    EmailID: "",
    Mobile: "",
    RoleID: "",
    IsActive: true,
  });

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("Token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("AccessToken") ||
      ""
    );
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // =========================================================
  // RESPONSE DATA HELPER
  // Backend JSON can come as Data/data
  // =========================================================

  const getResponseData = (result) => {
    return result?.Data ?? result?.data ?? null;
  };

  // =========================================================
  // GET USER LIST
  // =========================================================

  const getUserList = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/GetUserList`, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      console.log("GetUserList Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load users."
        );
      }

      const responseData = getResponseData(result);

      const data = Array.isArray(responseData)
        ? responseData
        : [];

      console.log("Users from API:", data);

      setUsers(data);

      if (data.length > 0) {
        setSelectedUser((previous) => {
          if (!previous) {
            return data[0];
          }

          return (
            data.find(
              (x) =>
                Number(x.UserID ?? x.userID) ===
                Number(previous.UserID ?? previous.userID)
            ) || data[0]
          );
        });
      } else {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("GetUserList Error:", err);

      setUsers([]);
      setSelectedUser(null);

      setError(
        err.message || "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET ROLES
  // =========================================================

  const getRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/GetRoles`, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      console.log("GetRoles Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load roles."
        );
      }

      const responseData = getResponseData(result);

      const data = Array.isArray(responseData)
        ? responseData
        : [];

      setRoles(data);

      console.log("Roles from API:", data);
    } catch (err) {
      console.error("GetRoles Error:", err);

      setRoles([]);

      setError(
        err.message || "Unable to load roles."
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getUserList();
    getRoles();
  }, []);

  // =========================================================
  // FILTERED USERS
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const userName =
        user.Name ?? user.name ?? "";

      const loginName =
        user.UserName ?? user.userName ?? "";

      const email =
        user.EmailID ?? user.emailID ?? "";

      const mobile =
        user.Mobile ?? user.mobile ?? "";

      const userRoleID =
        user.RoleID ?? user.roleID;

      const isActive =
        user.IsActive ?? user.isActive;

      const matchesSearch =
        !searchValue ||
        String(userName)
          .toLowerCase()
          .includes(searchValue) ||
        String(loginName)
          .toLowerCase()
          .includes(searchValue) ||
        String(email)
          .toLowerCase()
          .includes(searchValue) ||
        String(mobile)
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        !roleFilter ||
        String(userRoleID) === String(roleFilter);

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "Active" &&
          isActive === true) ||
        (statusFilter === "Inactive" &&
          isActive === false);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // =========================================================
  // COUNTS
  // =========================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) =>
      (user.IsActive ?? user.isActive) === true
  ).length;

  const inactiveUsers = users.filter(
    (user) =>
      (user.IsActive ?? user.isActive) === false
  ).length;

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) return "U";

    return String(name)
      .trim()
      .split(/\s+/)
      .map((x) => x.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // =========================================================
  // OPEN NEW USER
  // =========================================================

  const openNewUser = () => {
    setMessage("");
    setError("");

    setEditingUser(false);

    setFormData({
      UserID: 0,
      UserName: "",
      Password: "",
      Name: "",
      EmailID: "",
      Mobile: "",
      RoleID:
        roles.length > 0
          ? roles[0].RoleID ?? roles[0].roleID
          : "",
      IsActive: true,
    });

    setShowPanel(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditUser = async (user) => {
    try {
      setMessage("");
      setError("");

      const userID =
        user.UserID ?? user.userID;

      const response = await fetch(
        `${API_BASE}/GetUserByID?UserID=${userID}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      console.log("GetUserByID Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to load user."
        );
      }

      const data = getResponseData(result);

      if (!data) {
        throw new Error(
          "User data not found."
        );
      }

      setEditingUser(true);

      setFormData({
        UserID:
          data.UserID ?? data.userID ?? 0,

        UserName:
          data.UserName ??
          data.userName ??
          "",

        Password: "",

        Name:
          data.Name ??
          data.name ??
          "",

        EmailID:
          data.EmailID ??
          data.emailID ??
          "",

        Mobile:
          data.Mobile ??
          data.mobile ??
          "",

        RoleID:
          data.RoleID ??
          data.roleID ??
          "",

        IsActive:
          data.IsActive ??
          data.isActive ??
          true,
      });

      setShowPanel(true);
    } catch (err) {
      console.error(
        "GetUserByID Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load user."
      );
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // ADD USER
  // =========================================================

  const addUser = async () => {
    const payload = {
      UserName: formData.UserName,
      Password: formData.Password,
      Name: formData.Name,
      EmailID: formData.EmailID,
      Mobile: formData.Mobile,
      RoleID: Number(formData.RoleID),
      IsActive: formData.IsActive,
    };

    console.log(
      "AddUser Payload:",
      payload
    );

    const response = await fetch(
      `${API_BASE}/AddUser`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log(
      "AddUser Response:",
      result
    );

    if (!response.ok) {
      throw new Error(
        result?.Message ||
          result?.message ||
          "Unable to create user."
      );
    }

    return result;
  };

  // =========================================================
  // UPDATE USER
  // =========================================================

  const updateUser = async () => {
    const payload = {
      UserID: Number(formData.UserID),
      UserName: formData.UserName,
      Name: formData.Name,
      EmailID: formData.EmailID,
      Mobile: formData.Mobile,
      RoleID: Number(formData.RoleID),
      IsActive: formData.IsActive,
    };

    console.log(
      "UpdateUser Payload:",
      payload
    );

    const response = await fetch(
      `${API_BASE}/UpdateUser`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log(
      "UpdateUser Response:",
      result
    );

    if (!response.ok) {
      throw new Error(
        result?.Message ||
          result?.message ||
          "Unable to update user."
      );
    }

    return result;
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.Name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.UserName.trim()) {
      setError("Username is required.");
      return;
    }

    if (
      !editingUser &&
      !formData.Password.trim()
    ) {
      setError("Password is required.");
      return;
    }

    if (!formData.EmailID.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.RoleID) {
      setError(
        "Please select a role."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingUser) {
        await updateUser();

        setMessage(
          "User updated successfully."
        );
      } else {
        await addUser();

        setMessage(
          "User created successfully."
        );
      }

      setShowPanel(false);

      await getUserList();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DEACTIVATE
  // =========================================================

  const handleDeactivate = async (user) => {
    const userName =
      user.Name ??
      user.name ??
      "this user";

    const confirmDeactivate =
      window.confirm(
        `Are you sure you want to deactivate "${userName}"?`
      );

    if (!confirmDeactivate) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const userID =
        user.UserID ?? user.userID;

      const response = await fetch(
        `${API_BASE}/DeactivateUser?UserID=${userID}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      console.log(
        "DeactivateUser Response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.Message ||
            result?.message ||
            "Unable to deactivate user."
        );
      }

      setMessage(
        "User deactivated successfully."
      );

      await getUserList();
    } catch (err) {
      console.error(
        "Deactivate Error:",
        err
      );

      setError(
        err.message ||
          "Unable to deactivate user."
      );
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
  };

  return (
    <div className="min-h-[calc(100vh-50px)] bg-[#eef1f5] p-4 font-sans text-[#202833]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h1 className="text-[20px] font-bold tracking-wide text-[#202833]">
            USER MANAGEMENT
          </h1>

          <p className="mt-1 text-[12px] text-[#7b858f]">
            Manage users, roles and account status
          </p>
        </div>

        <button
          type="button"
          onClick={openNewUser}
          className="flex h-[38px] items-center gap-1.5 rounded bg-[#34495e] px-4 text-[12px] font-semibold text-white transition hover:bg-[#26394b]"
        >
          <span className="text-[17px]">＋</span>
          New User
        </button>

      </div>

      {/* =====================================================
          MESSAGE
      ====================================================== */}

      {message && (
        <div className="mb-3 rounded border border-[#c8ddd0] bg-[#f2f8f4] px-3 py-2 text-[12px] text-[#3f6f55]">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-3 rounded border border-[#e2caca] bg-[#fff6f6] px-3 py-2 text-[12px] text-[#a15b5b]">
          {error}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">

        <div className="flex items-center gap-3 rounded border border-[#dce1e6] bg-white p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded bg-[#edf1f4] text-[18px] text-[#34495e]">
            👥
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-wider text-[#89919a]">
              TOTAL USERS
            </div>

            <div className="text-[20px] font-bold text-[#273746]">
              {totalUsers}
            </div>
          </div>

        </div>

        <div className="flex items-center gap-3 rounded border border-[#dce1e6] bg-white p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded bg-[#edf4ef] text-[17px] text-[#3f6f55]">
            ●
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-wider text-[#89919a]">
              ACTIVE
            </div>

            <div className="text-[20px] font-bold text-[#273746]">
              {activeUsers}
            </div>
          </div>

        </div>

        <div className="flex items-center gap-3 rounded border border-[#dce1e6] bg-white p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f7eeee] text-[17px] text-[#a15b5b]">
            ●
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-wider text-[#89919a]">
              INACTIVE
            </div>

            <div className="text-[20px] font-bold text-[#273746]">
              {inactiveUsers}
            </div>
          </div>

        </div>

      </div>

      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <div className="mb-3 flex flex-col gap-2 rounded border border-[#dce1e6] bg-white p-2 md:flex-row">

        <div className="flex h-9 flex-1 items-center rounded border border-[#d4d9de] px-2.5">

          <span className="mr-2 text-[18px] text-[#8a949e]">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search user, username, email or mobile..."
            className="w-full border-0 bg-transparent text-[12px] outline-none placeholder:text-[#9aa2a9]"
          />

        </div>

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
          className="h-9 min-w-[150px] rounded border border-[#d4d9de] bg-white px-2 text-[12px] text-[#394652] outline-none focus:border-[#52718f]"
        >
          <option value="">
            All Roles
          </option>

          {roles.map((role) => (
            <option
              key={
                role.RoleID ??
                role.roleID
              }
              value={
                role.RoleID ??
                role.roleID
              }
            >
              {role.RoleName ??
                role.roleName}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="h-9 min-w-[145px] rounded border border-[#d4d9de] bg-white px-2 text-[12px] text-[#394652] outline-none focus:border-[#52718f]"
        >
          <option value="">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

        {(search ||
          roleFilter ||
          statusFilter) && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-9 rounded border border-[#d4d9de] bg-white px-3 text-[11px] font-semibold text-[#66717b] hover:bg-[#f4f5f6]"
          >
            Clear
          </button>
        )}

      </div>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <div className="grid min-h-[540px] grid-cols-1 overflow-hidden rounded border border-[#d7dde2] bg-white lg:grid-cols-[390px_1fr]">

        {/* ===================================================
            USER LIST
        ==================================================== */}

        <div className="border-b border-[#dfe4e8] bg-[#f8f9fa] lg:border-b-0 lg:border-r">

          <div className="flex h-12 items-center justify-between border-b border-[#dfe4e8] px-4">

            <span className="text-[11px] font-bold tracking-wider text-[#56616b]">
              USERS
            </span>

            <span className="rounded-full bg-[#34495e] px-2 py-0.5 text-[10px] text-white">
              {filteredUsers.length}
            </span>

          </div>

          <div className="max-h-[540px] overflow-y-auto p-2">

            {loading ? (
              <div className="py-10 text-center text-[12px] text-[#8b949d]">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-10 text-center text-[12px] text-[#8b949d]">
                No users found.
              </div>
            ) : (
              filteredUsers.map((user) => {

                const userID =
                  user.UserID ??
                  user.userID;

                const userName =
                  user.Name ??
                  user.name ??
                  "";

                const loginName =
                  user.UserName ??
                  user.userName ??
                  "";

                const roleName =
                  user.RoleName ??
                  user.roleName ??
                  "-";

                const isActive =
                  user.IsActive ??
                  user.isActive;

                const isSelected =
                  selectedUser &&
                  Number(
                    selectedUser.UserID ??
                      selectedUser.userID
                  ) === Number(userID);

                return (
                  <button
                    type="button"
                    key={userID}
                    onClick={() =>
                      setSelectedUser(user)
                    }
                    className={`mb-1 flex w-full items-center gap-2.5 rounded border p-2.5 text-left transition ${
                      isSelected
                        ? "border-[#cbd3da] bg-white shadow-sm"
                        : "border-transparent hover:bg-[#eef2f5]"
                    }`}
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#34495e] text-[12px] font-bold text-white">
                      {getInitials(userName)}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="truncate text-[13px] font-bold text-[#273746]">
                        {userName || "-"}
                      </div>

                      <div className="mt-0.5 truncate text-[11px] text-[#8a949e]">
                        @{loginName || "-"}
                      </div>

                      <div className="mt-1.5 flex items-center gap-2">

                        <span className="text-[10px] text-[#69747e]">
                          {roleName}
                        </span>

                        <span
                          className={`text-[10px] font-semibold ${
                            isActive
                              ? "text-[#3f6f55]"
                              : "text-[#a15b5b]"
                          }`}
                        >
                          ●{" "}
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </div>

                    <span className="text-[20px] text-[#a2aab1]">
                      ›
                    </span>

                  </button>
                );
              })
            )}

          </div>

        </div>

        {/* ===================================================
            USER DETAIL
        ==================================================== */}

        <div className="bg-white">

          {!selectedUser ? (
            <div className="flex min-h-[540px] flex-col items-center justify-center text-[#8d969f]">

              <div className="text-[38px]">
                👤
              </div>

              <h3 className="mt-3 text-[15px] font-semibold text-[#56616b]">
                No User Selected
              </h3>

              <p className="mt-1 text-[12px]">
                Select a user from the list.
              </p>

            </div>
          ) : (
            <>

              {/* PROFILE HEADER */}

              <div className="flex flex-col justify-between gap-4 border-b border-[#e0e4e7] p-5 md:flex-row md:items-center">

                <div className="flex items-center gap-3">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-[#34495e] text-[16px] font-bold text-white">
                    {getInitials(
                      selectedUser.Name ??
                        selectedUser.name
                    )}
                  </div>

                  <div>

                    <h2 className="text-[18px] font-bold text-[#273746]">
                      {selectedUser.Name ??
                        selectedUser.name ??
                        "-"}
                    </h2>

                    <div className="mt-0.5 text-[11px] text-[#89929b]">
                      @
                      {selectedUser.UserName ??
                        selectedUser.userName ??
                        "-"}
                    </div>

                    <div
                      className={`mt-1 text-[10px] font-semibold ${
                        (selectedUser.IsActive ??
                          selectedUser.isActive)
                          ? "text-[#3f6f55]"
                          : "text-[#a15b5b]"
                      }`}
                    >
                      ●{" "}
                      {(selectedUser.IsActive ??
                        selectedUser.isActive)
                        ? "Active Account"
                        : "Inactive Account"}
                    </div>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      openEditUser(
                        selectedUser
                      )
                    }
                    className="h-8 rounded border border-[#34495e] bg-white px-3 text-[11px] font-semibold text-[#34495e] hover:bg-[#f3f5f6]"
                  >
                    Edit
                  </button>

                  {(selectedUser.IsActive ??
                    selectedUser.isActive) && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeactivate(
                          selectedUser
                        )
                      }
                      className="h-8 rounded border border-[#d8b8b8] bg-[#fff8f8] px-3 text-[11px] font-semibold text-[#a15b5b] hover:bg-[#fff0f0]"
                    >
                      Deactivate
                    </button>
                  )}

                </div>

              </div>

              {/* INFORMATION */}

              <div className="border-b border-[#e7eaed] p-5">

                <div className="mb-3 text-[10px] font-bold tracking-wider text-[#8a949d]">
                  USER INFORMATION
                </div>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      FULL NAME
                    </div>

                    <div className="text-[12px] font-semibold text-[#35424e]">
                      {selectedUser.Name ??
                        selectedUser.name ??
                        "-"}
                    </div>
                  </div>

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      USERNAME
                    </div>

                    <div className="text-[12px] font-semibold text-[#35424e]">
                      {selectedUser.UserName ??
                        selectedUser.userName ??
                        "-"}
                    </div>
                  </div>

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      EMAIL ADDRESS
                    </div>

                    <div className="break-all text-[12px] font-semibold text-[#35424e]">
                      {selectedUser.EmailID ??
                        selectedUser.emailID ??
                        "-"}
                    </div>
                  </div>

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      MOBILE NUMBER
                    </div>

                    <div className="text-[12px] font-semibold text-[#35424e]">
                      {selectedUser.Mobile ??
                        selectedUser.mobile ??
                        "-"}
                    </div>
                  </div>

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      ROLE
                    </div>

                    <div className="text-[12px] font-semibold text-[#35424e]">
                      {selectedUser.RoleName ??
                        selectedUser.roleName ??
                        "-"}
                    </div>
                  </div>

                  <div className="rounded border border-[#e2e6e9] bg-[#f7f8f9] p-3">
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-[#8a949d]">
                      ACCOUNT STATUS
                    </div>

                    <div
                      className={`text-[12px] font-semibold ${
                        (selectedUser.IsActive ??
                          selectedUser.isActive)
                          ? "text-[#3f6f55]"
                          : "text-[#a15b5b]"
                      }`}
                    >
                      ●{" "}
                      {(selectedUser.IsActive ??
                        selectedUser.isActive)
                        ? "Active"
                        : "Inactive"}
                    </div>
                  </div>

                </div>

              </div>

              {/* ROLE */}

              <div className="p-5">

                <div className="mb-3 text-[10px] font-bold tracking-wider text-[#8a949d]">
                  ACCOUNT ROLE
                </div>

                <div className="flex items-center gap-3 rounded border border-[#dfe4e8] p-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded bg-[#34495e] text-[12px] font-bold text-white">
                    {getInitials(
                      selectedUser.RoleName ??
                        selectedUser.roleName ??
                        "R"
                    )}
                  </div>

                  <div>

                    <div className="text-[12px] font-bold text-[#35424e]">
                      {selectedUser.RoleName ??
                        selectedUser.roleName ??
                        "-"}
                    </div>

                    <div className="mt-0.5 text-[10px] text-[#8a949d]">
                      Role assigned to this system user.
                    </div>

                  </div>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

      {/* =====================================================
          NEW / EDIT SIDE PANEL
      ====================================================== */}

      {showPanel && (
        <>
          {/* Overlay */}

          <div
            onClick={() =>
              !saving &&
              setShowPanel(false)
            }
            className="fixed inset-0 z-[90] bg-black/30"
          />

          {/* Panel */}

          <div className="fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[390px] flex-col bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.15)]">

            {/* PANEL HEADER */}

            <div className="flex items-center justify-between border-b border-[#e0e4e7] p-4">

              <div>

                <div className="text-[14px] font-bold tracking-wide text-[#273746]">
                  {editingUser
                    ? "EDIT USER"
                    : "NEW USER"}
                </div>

                <div className="mt-1 text-[10px] text-[#8b949d]">
                  {editingUser
                    ? "Update user information"
                    : "Create a new system user"}
                </div>

              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setShowPanel(false)
                }
                className="flex h-7 w-7 items-center justify-center rounded bg-[#f0f2f4] text-[19px] text-[#5f6972] hover:bg-[#e5e8ea] disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="flex min-h-0 flex-1 flex-col"
            >

              <div className="flex-1 overflow-y-auto p-4">

                {/* NAME */}

                <div className="mb-3">

                  <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                    FULL NAME{" "}
                    <span className="text-[#a15b5b]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="h-9 w-full rounded border border-[#d5dbe0] px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                  />

                </div>

                {/* USERNAME */}

                <div className="mb-3">

                  <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                    USERNAME{" "}
                    <span className="text-[#a15b5b]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="h-9 w-full rounded border border-[#d5dbe0] px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                  />

                </div>

                {/* PASSWORD - ADD ONLY */}

                {!editingUser && (
                  <div className="mb-3">

                    <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                      PASSWORD{" "}
                      <span className="text-[#a15b5b]">
                        *
                      </span>
                    </label>

                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="h-9 w-full rounded border border-[#d5dbe0] px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                    />

                  </div>
                )}

                {/* EMAIL */}

                <div className="mb-3">

                  <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                    EMAIL ADDRESS{" "}
                    <span className="text-[#a15b5b]">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    name="EmailID"
                    value={formData.EmailID}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="h-9 w-full rounded border border-[#d5dbe0] px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                  />

                </div>

                {/* MOBILE */}

                <div className="mb-3">

                  <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                    MOBILE NUMBER
                  </label>

                  <input
                    type="text"
                    name="Mobile"
                    value={formData.Mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="h-9 w-full rounded border border-[#d5dbe0] px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                  />

                </div>

                {/* ROLE */}

                <div className="mb-3">

                  <label className="mb-1 block text-[10px] font-bold text-[#68737d]">
                    ROLE{" "}
                    <span className="text-[#a15b5b]">
                      *
                    </span>
                  </label>

                  <select
                    name="RoleID"
                    value={formData.RoleID}
                    onChange={handleChange}
                    className="h-9 w-full rounded border border-[#d5dbe0] bg-white px-2.5 text-[12px] text-[#34424e] outline-none focus:border-[#52718f] focus:ring-2 focus:ring-[#52718f]/10"
                  >
                    <option value="">
                      Select Role
                    </option>

                    {roles.map((role) => (
                      <option
                        key={
                          role.RoleID ??
                          role.roleID
                        }
                        value={
                          role.RoleID ??
                          role.roleID
                        }
                      >
                        {role.RoleName ??
                          role.roleName}
                      </option>
                    ))}
                  </select>

                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between rounded border border-[#dfe4e8] bg-[#f7f8f9] p-3">

                  <div>

                    <div className="text-[11px] font-semibold text-[#35424e]">
                      Account Status
                    </div>

                    <div className="mt-0.5 text-[9px] text-[#8a949d]">
                      Allow this user to login
                    </div>

                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">

                    <input
                      type="checkbox"
                      name="IsActive"
                      checked={formData.IsActive}
                      onChange={handleChange}
                      className="peer sr-only"
                    />

                    <div className="h-5 w-9 rounded-full bg-[#c9ced3] after:absolute after:left-[3px] after:top-[3px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#3f6f55] peer-checked:after:translate-x-[18px]" />

                  </label>

                </div>

              </div>

              {/* PANEL FOOTER */}

              <div className="flex justify-end gap-2 border-t border-[#e0e4e7] p-3">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    setShowPanel(false)
                  }
                  className="h-9 rounded border border-[#ccd2d7] bg-white px-4 text-[11px] font-semibold text-[#56616b] hover:bg-[#f4f5f6] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-9 rounded bg-[#3f6f55] px-4 text-[11px] font-semibold text-white hover:bg-[#345e48] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Save Changes"
                    : "Create User"}
                </button>

              </div>

            </form>

          </div>
        </>
      )}

    </div>
  );
}

export default UserManagement;