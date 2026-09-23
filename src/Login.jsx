import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
    
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter Username and Password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://localhost:44319/api/UserMaster/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: username,
            Password: password,
          }),
        }
      );

      const data = await response.json();

    if (response.ok && data.token) {

    localStorage.setItem("token", data.token);

    localStorage.setItem(
        "UserID",
        data?.data?.userID ?? data?.data?.UserID ?? ""
    );

    localStorage.setItem(
        "RoleID",
        data?.data?.roleID ?? data?.data?.RoleID ?? ""
    );

    localStorage.setItem(
        "RoleName",
        data?.data?.roleName ?? data?.data?.RoleName ?? ""
    );

    localStorage.setItem(
        "username",
        data?.data?.userName ?? data?.data?.UserName ?? ""
    );

    if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
    }

    console.log("Login Response:", data);
    console.log("Logged-in UserID:", data?.data?.userID ?? data?.data?.UserID);

    setMessage("Login successful!");

    navigate("/Dashboard");
} else {
    setMessage(data.message || "Invalid Username or Password.");
}
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect with server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center p-4 overflow-hidden">

      {/* Main Login Container */}
      <div className="relative w-full max-w-[1450px] min-h-[760px] bg-white rounded-[28px] shadow-[0_25px_80px_rgba(15,45,85,0.16)] overflow-hidden flex flex-col lg:flex-row">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <div className="relative lg:w-[53%] min-h-[500px] overflow-hidden bg-[#dceafa]">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-left"
            style={{
              backgroundImage: "url('/rmc-erp-hero.png')",
            }}
          />

          {/* Blue Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e7f2ff]/20 via-[#d7e9fa]/10 to-[#0d4278]/5" />

          {/* Decorative Shapes */}
          <div className="absolute -top-32 -right-28 w-[420px] h-[420px] rounded-full bg-[#1d63aa]/20 blur-2xl" />

          <div className="absolute bottom-[-130px] left-[-100px] w-[420px] h-[420px] rounded-full bg-[#1663ad]/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 h-full min-h-[500px] lg:min-h-[760px] p-8 sm:p-12 lg:p-16 flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="text-[48px] sm:text-[56px] font-black tracking-[-5px] text-[#102f58] leading-none">
                  RM
                </span>

                <span className="text-[48px] sm:text-[56px] font-black tracking-[-5px] text-[#1594e8] leading-none">
                  C
                </span>
              </div>

              <span className="text-[27px] sm:text-[32px] font-medium text-[#173b68]">
                ERP
              </span>
            </div>

            {/* Heading */}
            <div className="mt-16 lg:mt-20 max-w-[500px]">

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold leading-[1.08] text-[#102f58] tracking-[-1.5px]">
                Smarter Operations.
                <br />
                <span className="font-normal">
                  Stronger Tomorrow.
                </span>
              </h1>

              <p className="mt-7 text-[16px] sm:text-[17px] leading-7 text-[#29496d] max-w-[460px]">
                Streamline your business processes with RMC ERP —
                a complete solution for better control, higher efficiency
                and sustainable growth.
              </p>

            </div>

            {/* Feature List */}
            <div className="mt-10 space-y-5">

              <Feature
                icon="▣"
                text="Manage Operations"
              />

              <Feature
                icon="↗"
                text="Track Progress"
              />

              <Feature
                icon="◉"
                text="Improve Productivity"
              />

              <Feature
                icon="⌁"
                text="Drive Growth"
              />

            </div>

          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE LOGIN
        ====================================================== */}
        <div className="lg:w-[47%] flex items-center justify-center bg-[#fbfcfe] p-6 sm:p-10 lg:p-16">

          <div className="w-full max-w-[510px]">

            {/* Login Card */}
            <div className="bg-white rounded-[24px] border border-[#e4eaf1] shadow-[0_15px_45px_rgba(25,55,90,0.08)] p-8 sm:p-10 lg:p-12">
                        
              {/* Heading */}
              <h2 className="text-[34px] sm:text-[38px] font-semibold text-[#102f58] tracking-[-1px]">
                Welcome 
              </h2>

              <p className="mt-2 text-[15px] text-[#71839a]">
                Sign in to your account to continue
              </p>

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-9">

                {/* Username */}
                <div className="relative">

                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55708f]">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full h-[58px] rounded-xl border border-[#dce5ef] bg-white pl-14 pr-5 text-[#173b68] outline-none transition focus:border-[#2470c5] focus:ring-4 focus:ring-[#2470c5]/10 placeholder:text-[#9aabbd]"
                  />

                </div>

                {/* Password */}
                <div className="relative mt-4">

                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55708f]">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-[58px] rounded-xl border border-[#dce5ef] bg-white pl-14 pr-14 text-[#173b68] outline-none transition focus:border-[#2470c5] focus:ring-4 focus:ring-[#2470c5]/10 placeholder:text-[#9aabbd]"
                  />

                  {/* Show Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#55708f] hover:text-[#1765b0] transition"
                  >
                    {showPassword ? (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.5 10.5a2 2 0 0 0 3 3" />
                        <path d="M9.8 5.2A10.5 10.5 0 0 1 12 5c5 0 9 4 10 7-0.4 1.2-1.4 2.8-2.8 4" />
                        <path d="M6.2 6.2C4.5 7.2 3.2 8.7 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.7" />
                      </svg>
                    ) : (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>

                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between mt-5">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-[19px] h-[19px] accent-[#1765b0] cursor-pointer"
                    />

                    <span className="text-[14px] text-[#526a85]">
                      Remember me
                    </span>

                  </label>

                  <button
                    type="button"
                    className="text-[14px] font-medium text-[#145bb0] hover:text-[#0b4386]"
                  >
                    Forgot Password?
                  </button>

                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                      message.includes("successful")
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 w-full h-[58px] rounded-xl bg-gradient-to-r from-[#1859a5] to-[#176fbe] text-white font-semibold text-[16px] shadow-[0_10px_24px_rgba(23,95,170,0.25)] transition hover:shadow-[0_13px_30px_rgba(23,95,170,0.32)] hover:translate-y-[-1px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In  →"}
                </button>

              </form>

              {/* Footer */}
              <div className="flex items-center gap-4 mt-10">

                <div className="flex-1 h-px bg-[#e5ebf2]" />

                <span className="text-[12px] text-[#9aabbd] whitespace-nowrap">
                  Built for Efficiency
                </span>

                

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-4">

      <div className="w-[38px] h-[38px] rounded-full bg-[#174d88] text-white flex items-center justify-center text-[17px] shadow-[0_5px_15px_rgba(23,77,136,0.18)]">
        {icon}
      </div>

      <span className="text-[15px] font-medium text-[#173b68]">
        {text}
      </span>

    </div>
  );
}

export default Login;