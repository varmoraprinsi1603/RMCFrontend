import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const LOGIN_API = "https://localhost:44319/api/UserMaster/Login";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUserName =
      localStorage.getItem("rememberedUserName");

    if (savedUserName) {
      setFormData((prev) => ({
        ...prev,
        UserName: savedUserName,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.UserName.trim()) {
      setMessage("Please enter username.");
      return;
    }

    if (!formData.Password.trim()) {
      setMessage("Please enter password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: formData.UserName,
          Password: formData.Password,
        }),
      });

      const data = await response.json();

      console.log("Login Response:", data);

      if (!response.ok || !data?.token) {
        setMessage(
          data?.message ||
            data?.Message ||
            "Invalid username or password."
        );

        return;
      }

      const userData =
        data?.data ||
        data?.Data ||
        {};

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "UserID",
        userData?.userID ??
          userData?.UserID ??
          ""
      );

      localStorage.setItem(
        "UserName",
        userData?.userName ??
          userData?.UserName ??
          formData.UserName
      );

      localStorage.setItem(
        "RoleName",
        userData?.roleName ??
          userData?.RoleName ??
          ""
      );

      localStorage.setItem(
        "RoleID",
        userData?.roleID ??
          userData?.RoleID ??
          ""
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUserName",
          formData.UserName
        );
      } else {
        localStorage.removeItem(
          "rememberedUserName"
        );
      }

      navigate("/Dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#dce3ec]">

{/* =====================================================
    FULL SCREEN BACKGROUND
====================================================== */}

<div className="absolute inset-0 bg-[#f4f1ed] overflow-hidden">

  {/* Soft background shapes */}
  <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#dbe7f3] opacity-70 blur-[2px]" />

  <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-[#e7dff0] opacity-60" />

  <div className="absolute top-[35%] left-[42%] w-[180px] h-[180px] rounded-full bg-[#f1d8c9] opacity-35 blur-[25px]" />


  {/* =================================================
      PINTEREST STYLE CREATIVE COLLAGE
  ================================================== */}

  {/* Top-left editorial card */}
  <div
    className="
      absolute
      top-[8%]
      left-[7%]
      w-[210px]
      h-[260px]
      rotate-[-7deg]
      rounded-[24px]
      bg-white
      shadow-[0_20px_45px_rgba(60,70,90,0.12)]
      p-5
    "
  >
    <div className="h-full rounded-[18px] bg-[#edf3f8] relative overflow-hidden">

      <div className="absolute top-7 left-6 w-16 h-16 rounded-full bg-[#315b82]" />

      <div className="absolute top-[72px] left-12 w-[100px] h-[7px] rounded-full bg-[#8299ae]" />
      <div className="absolute top-[90px] left-12 w-[70px] h-[6px] rounded-full bg-[#b8c5d1]" />

      <div className="absolute bottom-8 left-6 right-6">
        <div className="text-[11px] uppercase tracking-[3px] text-[#315b82]">
          Workflow
        </div>

        <div className="mt-2 h-[2px] bg-[#315b82] w-full" />

        <div className="mt-3 flex gap-2">
          <span className="w-7 h-2 rounded-full bg-[#315b82]" />
          <span className="w-10 h-2 rounded-full bg-[#b7c4d0]" />
          <span className="w-5 h-2 rounded-full bg-[#d1dbe4]" />
        </div>
      </div>

    </div>
  </div>


  {/* Right tall creative poster */}
  <div
    className="
      absolute
      top-[7%]
      right-[7%]
      w-[190px]
      h-[330px]
      rotate-[6deg]
      rounded-[28px]
      bg-[#253c53]
      shadow-[0_25px_55px_rgba(40,55,75,0.18)]
      overflow-hidden
    "
  >

    <div className="absolute top-7 left-7 text-[10px] uppercase tracking-[4px] text-[#b8c9d8]">
      Support
    </div>

    <div className="absolute top-[75px] left-7">
      <div className="w-[105px] h-[105px] rounded-full border border-[#7891a8] flex items-center justify-center">
        <div className="w-[65px] h-[65px] rounded-full border-[8px] border-[#dce7ef]" />
      </div>
    </div>

    <div className="absolute bottom-8 left-7 right-7">
      <div className="text-[23px] leading-6 font-semibold text-white">
        Solve.
        <br />
        Track.
        <br />
        Close.
      </div>

      <div className="mt-4 h-[1px] bg-[#6f879d]" />
    </div>

  </div>


  {/* Small tilted paper */}
  <div
    className="
      absolute
      top-[46%]
      left-[7%]
      w-[145px]
      h-[170px]
      rotate-[8deg]
      rounded-[20px]
      bg-[#fffaf4]
      shadow-[0_18px_35px_rgba(70,70,70,0.12)]
      p-5
    "
  >

    <div className="text-[9px] uppercase tracking-[3px] text-[#8b8178]">
      Service
    </div>

    <div className="mt-5 space-y-3">

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full border-2 border-[#315b82]" />
        <span className="h-2 w-16 rounded-full bg-[#d8d1ca]" />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#315b82]" />
        <span className="h-2 w-20 rounded-full bg-[#d8d1ca]" />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full border-2 border-[#315b82]" />
        <span className="h-2 w-12 rounded-full bg-[#d8d1ca]" />
      </div>

    </div>

    <div className="absolute bottom-5 left-5 right-5 h-[3px] bg-[#315b82]" />

  </div>


  {/* Bottom-left abstract card */}
  <div
    className="
      absolute
      bottom-[9%]
      left-[16%]
      w-[190px]
      h-[130px]
      rotate-[-4deg]
      rounded-[25px]
      bg-[#d9e5ef]
      shadow-[0_18px_40px_rgba(50,70,90,0.12)]
      overflow-hidden
    "
  >

    <div className="absolute -right-8 -top-8 w-[120px] h-[120px] rounded-full border-[18px] border-[#6e8aa3]" />

    <div className="absolute bottom-6 left-6">
      <div className="text-[10px] uppercase tracking-[3px] text-[#315b82]">
        Performance
      </div>

      <div className="mt-2 flex items-end gap-2">
        <div className="w-3 h-8 rounded-t bg-[#315b82]" />
        <div className="w-3 h-12 rounded-t bg-[#7895ae]" />
        <div className="w-3 h-16 rounded-t bg-[#a9bdce]" />
        <div className="w-3 h-10 rounded-t bg-[#c4d2dd]" />
      </div>
    </div>

  </div>


  {/* Bottom-right small card */}
  <div
    className="
      absolute
      bottom-[10%]
      right-[13%]
      w-[175px]
      h-[135px]
      rotate-[5deg]
      rounded-[25px]
      bg-white
      shadow-[0_18px_40px_rgba(60,70,90,0.12)]
      p-5
    "
  >

    <div className="text-[9px] uppercase tracking-[3px] text-[#8996a3]">
      Management
    </div>

    <div className="mt-5 flex items-center gap-3">

      <div className="w-10 h-10 rounded-full bg-[#dce7f0] flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-[#315b82]" />
      </div>

      <div>
        <div className="h-2 w-20 rounded-full bg-[#9eabb7]" />
        <div className="mt-2 h-2 w-12 rounded-full bg-[#d5dce2]" />
      </div>

    </div>

    <div className="mt-5 flex gap-1">
      <span className="w-8 h-1.5 rounded-full bg-[#315b82]" />
      <span className="w-5 h-1.5 rounded-full bg-[#b8c6d1]" />
      <span className="w-10 h-1.5 rounded-full bg-[#dce3e8]" />
    </div>

  </div>


  {/* Tiny floating design elements */}

  <div className="absolute top-[30%] left-[27%] w-3 h-3 rounded-full bg-[#315b82]" />

  <div className="absolute top-[20%] left-[48%] w-2 h-2 rounded-full bg-[#d39b82]" />

  <div className="absolute bottom-[25%] right-[31%] w-4 h-4 rounded-full border-2 border-[#7895ae]" />

  <div className="absolute top-[65%] right-[28%] w-10 h-[2px] rotate-[-25deg] bg-[#9db0c1]" />

</div>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div
        className="
          absolute
          top-1/2
          left-[35%]
          -translate-y-1/2
          w-[360px]
          sm:w-[390px]
          rounded-[28px]
          bg-white/92
          backdrop-blur-xl
          border
          border-white
          shadow-[0_25px_70px_rgba(50,70,95,0.22)]
          px-9
          py-9
        "
      >

        
        {/* Heading */}
        <h1
          className="
            text-[30px]
            font-bold
            tracking-[-1px]
            text-[#111827]
          "
        >
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="mt-9"
        >

          {/* Username */}
          <div className="mb-7">

            <label
              className="
                block
                text-[11px]
                font-semibold
                text-[#202938]
                mb-2
              "
            >
              UserName
            </label>

            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              autoComplete="username"
              className="
                w-full
                h-9
                bg-transparent
                border-0
                border-b
                border-[#aeb7c3]
                outline-none
                text-[13px]
                text-[#1f2937]
                px-1
                transition
                focus:border-[#3974df]
              "
            />

          </div>

          {/* Password */}
          <div className="mb-6">

            <label
              className="
                block
                text-[11px]
                font-semibold
                text-[#202938]
                mb-2
              "
            >
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                autoComplete="current-password"
                className="
                  w-full
                  h-9
                  bg-transparent
                  border-0
                  border-b
                  border-[#aeb7c3]
                  outline-none
                  text-[13px]
                  text-[#1f2937]
                  px-1
                  pr-8
                  transition
                  focus:border-[#3974df]
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="
                  absolute
                  right-1
                  bottom-2
                  text-[#7b8796]
                  hover:text-[#3974df]
                "
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>

            </div>

          </div>

          {/* Remember */}
          <label
            className="
              flex
              items-center
              gap-2
              cursor-pointer
              mb-6
            "
          >

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(
                  e.target.checked
                )
              }
              className="
                w-3.5
                h-3.5
                accent-[#3974df]
              "
            />

            <span
              className="
                text-[11px]
                text-[#697586]
              "
            >
              Remember me
            </span>

          </label>

          {/* Error */}
          {message && (
            <div
              className="
                mb-4
                rounded-lg
                bg-red-50
                border
                border-red-100
                px-3
                py-2
                text-[10px]
                text-red-600
              "
            >
              {message}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-11
              rounded-full
              bg-[#0d3559]
              text-white
              text-[13px]
              font-medium
              shadow-[0_7px_18px_rgba(55,110,220,0.32)]
              hover:bg-[#0d3559]
              hover:-translate-y-[1px]
              active:translate-y-0
              transition-all
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

          {/* Forgot Password */}
          <button
            type="button"
            className="
              block
              mx-auto
              mt-5
              text-[11px]
              font-medium
              text-[#111827]
              hover:text-[#3974df]
              transition
            "
          >
            Forgot Password?
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;