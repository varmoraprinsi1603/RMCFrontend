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

      <div className="absolute inset-0 bg-gradient-to-br from-[#c7d0dd] via-[#e1e6ed] to-[#f4f6f8]" />

      {/* Soft ambient lights */}
      <div
        className="
          absolute
          -top-[20%]
          -left-[10%]
          w-[55vw]
          h-[55vw]
          rounded-full
          bg-[#edf3f9]/70
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          -bottom-[25%]
          right-[-10%]
          w-[60vw]
          h-[50vw]
          rounded-full
          bg-[#cbd9e8]/60
          blur-[110px]
        "
      />

      {/* =====================================================
          FULL SCREEN SVG SCENE
      ====================================================== */}

      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>

          {/* Main blob */}
          <linearGradient
            id="blobGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
            />

            <stop
              offset="48%"
              stopColor="#f4f6f8"
            />

            <stop
              offset="100%"
              stopColor="#c9d1da"
            />
          </linearGradient>

          {/* Blob highlight */}
          <linearGradient
            id="blobHighlight"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity="0.9"
            />

            <stop
              offset="100%"
              stopColor="#ffffff"
              stopOpacity="0"
            />
          </linearGradient>

          {/* Sphere */}
          <radialGradient
            id="sphereGradient"
            cx="30%"
            cy="20%"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
            />

            <stop
              offset="48%"
              stopColor="#eef1f5"
            />

            <stop
              offset="100%"
              stopColor="#b6bec9"
            />
          </radialGradient>

          {/* Blue leaves */}
          <linearGradient
            id="blueLeaf"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#4d80dc"
            />

            <stop
              offset="100%"
              stopColor="#183f9f"
            />
          </linearGradient>

          {/* Shadow */}
          <filter
            id="sceneShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="170%"
          >
            <feDropShadow
              dx="0"
              dy="25"
              stdDeviation="25"
              floodColor="#64748b"
              floodOpacity="0.20"
            />
          </filter>

          <filter
            id="softBlur"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="22" />
          </filter>

        </defs>

        {/* =================================================
            FLOOR SHADOW
        ================================================== */}

        <ellipse
          cx="720"
          cy="820"
          rx="560"
          ry="55"
          fill="#64748b"
          opacity="0.16"
          filter="url(#softBlur)"
        />

        {/* =================================================
            MAIN ORGANIC 3D SHAPE
        ================================================== */}

        <path
          d="
            M175 700

            C115 640
            120 555
            165 485

            C205 425
            185 340
            220 270

            C255 200
            330 175
            405 215

            C465 248
            510 225
            555 190

            C625 135
            725 145
            775 205

            C820 260
            875 270
            935 300

            C1020 342
            1075 420
            1050 500

            C1030 565
            950 590
            935 655

            C920 715
            850 760
            775 750

            C690 738
            645 785
            555 790

            C470 795
            415 750
            345 770

            C275 790
            215 750
            175 700

            Z
          "
          fill="url(#blobGradient)"
          filter="url(#sceneShadow)"
        />

        {/* Blob soft highlight */}
        <path
          d="
            M190 625
            C150 550 205 475 220 410
            C240 325 230 270 300 235
            C355 208 410 260 475 270
            C550 280 575 210 650 205
            C720 200 760 255 820 285
            C885 318 975 360 985 435
            C995 495 925 520 890 570
            C850 630 900 690 820 715
            C750 738 700 680 630 690
            C550 700 500 750 425 720
            C350 690 310 730 255 690
            C225 670 205 650 190 625
            Z
          "
          fill="url(#blobHighlight)"
          opacity="0.55"
        />

        {/* =================================================
            FLOATING SPHERE
        ================================================== */}

        <circle
          cx="960"
          cy="145"
          r="70"
          fill="url(#sphereGradient)"
          filter="url(#sceneShadow)"
        />

        <ellipse
          cx="935"
          cy="120"
          rx="28"
          ry="17"
          fill="#ffffff"
          opacity="0.55"
        />

        {/* Small floating sphere */}
        <circle
          cx="1130"
          cy="550"
          r="22"
          fill="url(#blueLeaf)"
        />

        {/* Small white sphere */}
        <circle
          cx="250"
          cy="250"
          r="14"
          fill="#ffffff"
          opacity="0.9"
        />
{/* =================================================
    SOFT LIGHT BLUE GLASS BUBBLE
================================================== */}

<g transform="translate(360 380)">

  {/* Soft background glow */}
  <circle
    cx="145"
    cy="145"  
    r="95"
    fill="#dbe8f7"
    opacity="0.20"
    filter="url(#softBlur)"
  />

  {/* Main glass bubble */}
  <circle
    cx="145"
    cy="145"
    r="62"
    fill="#c9dcf5"
    opacity="0.32"
    filter="url(#sceneShadow)"
  />

  {/* Soft white reflection */}
  <ellipse
    cx="125"
    cy="120"
    rx="25"
    ry="15"
    fill="#ffffff"
    opacity="0.38"
    transform="rotate(-25 125 120)"
  />

  {/* Small light-blue bubble */}
  <circle
    cx="210"
    cy="185"
    r="34"
    fill="#d2e2f6"
    opacity="0.42"
  />

  {/* Tiny floating bubble */}
  <circle
    cx="92"
    cy="205"
    r="15"
    fill="#bcd3ef"
    opacity="0.40"
  />

  {/* Tiny soft dot */}
  <circle
    cx="225"
    cy="105"
    r="6"
    fill="#a9c6ea"
    opacity="0.42"
  />

</g>
        {/* =================================================
            LEFT ABSTRACT DECOR
        ================================================== */}

        <path
          d="M170 735 C130 680 125 620 155 570"
          fill="none"
          stroke="#64748b"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <ellipse
          cx="140"
          cy="670"
          rx="15"
          ry="38"
          fill="#6c89b5"
          transform="rotate(-38 140 670)"
        />

        <ellipse
          cx="150"
          cy="710"
          rx="14"
          ry="38"
          fill="url(#blueLeaf)"
          transform="rotate(35 150 710)"
        />

        <ellipse
          cx="137"
          cy="625"
          rx="13"
          ry="31"
          fill="#8799ad"
          transform="rotate(-45 137 625)"
        />

        <ellipse
          cx="172"
          cy="730"
          rx="13"
          ry="32"
          fill="#9db7d3"
          transform="rotate(25 172 730)"
        />

        {/* =================================================
            RIGHT ABSTRACT LEAVES
        ================================================== */}

        <path
          d="M1100 750 C1160 690 1170 620 1135 555"
          fill="none"
          stroke="#59677a"
          strokeWidth="9"
          strokeLinecap="round"
        />

        <ellipse
          cx="1150"
          cy="655"
          rx="16"
          ry="40"
          fill="#65748a"
          transform="rotate(42 1150 655)"
        />

        <ellipse
          cx="1140"
          cy="700"
          rx="17"
          ry="42"
          fill="url(#blueLeaf)"
          transform="rotate(-35 1140 700)"
        />

        <ellipse
          cx="1162"
          cy="610"
          rx="14"
          ry="34"
          fill="#718198"
          transform="rotate(38 1162 610)"
        />

        <ellipse
          cx="1115"
          cy="735"
          rx="15"
          ry="35"
          fill="#91aac5"
          transform="rotate(-25 1115 735)"
        />

      </svg>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div
        className="
          absolute
          top-1/2
          left-[40%]
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

        {/* Blue circle */}
        <div
          className="
            absolute
            top-5
            right-5
            w-8
            h-8
            rounded-full
            bg-[#3974df]
            shadow-[0_5px_15px_rgba(55,110,220,0.35)]
          "
        />

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
              bg-[#3974df]
              text-white
              text-[13px]
              font-medium
              shadow-[0_7px_18px_rgba(55,110,220,0.32)]
              hover:bg-[#3068d2]
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