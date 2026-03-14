import React, { useState, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { Users } from "lucide-react";
import { CloudCog } from "lucide-react";
import { Loader } from "lucide-react";
import { supabase } from "./supabaseClient";
import { Link } from "lucide-react";

export default function Landing() {
  const [activeModal, setActiveModal] = useState(null); // 'signUp' or 'signIn' or null
  const [loading, setLoading] = useState({ signUp: false, signIn: false });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leetcodename, setName] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const switchModal = (targetType) => setActiveModal(targetType);
  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      if (type === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { leetcodename } },
        });

        if (error) throw error;

        alert("Please check your email to confirm your account.");
      }

      closeModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Close modal when clicking on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Inject styles - in a real app, move to separate CSS file */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

          :root {
            /* Sleek Dark Theme Palette (Zinc/Amber) */
            --bg-base: #09090b;
            --bg-surface: #18181b;
            --bg-surface-hover: #27272a;
            --border-subtle: #27272a;
            --border-focus: #3f3f46;

            --text-primary: #fafafa;
            --text-secondary: #a1a1aa;
            --text-tertiary: #71717a;

            --accent-primary: #f59e0b;
            --accent-hover: #d97706;
            --accent-glow: rgba(245, 158, 11, 0.15);

            --danger: #ef4444;
            --success: #10b981;
            --warning: #f59e0b;

            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
          }

          body {
            background-color: var(--bg-base);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
            position: relative;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
          }

          /* Subtle Developer Grid Background */
          body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
                linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
            background-size: 4rem 4rem;
            mask-image: radial-gradient(circle at center 15%, black, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at center 15%, black, transparent 80%);
            opacity: 0.15;
            z-index: -1;
          }

          /* Top Ambient Glow */
          .ambient-glow {
            position: absolute;
            top: -150px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 300px;
            background: radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%);
            filter: blur(40px);
            z-index: -1;
            pointer-events: none;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          /* Header */
          header {
            padding: 1.5rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
          }

          .logo i {
            font-size: 1.5rem;
            color: var(--accent-primary);
          }

          .logo h1 {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
          }

          /* Buttons */
          .btn {
            padding: 0.6rem 1.25rem;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .btn-primary {
            background-color: var(--text-primary);
            color: var(--bg-base);
          }

          .btn-primary:hover {
            background-color: var(--text-secondary);
          }

          .btn-accent {
            background-color: var(--accent-primary);
            color: #fff;
          }

          .btn-accent:hover {
            background-color: var(--accent-hover);
          }

          .btn-outline {
            background-color: transparent;
            border-color: var(--border-subtle);
            color: var(--text-secondary);
          }

          .btn-outline:hover {
            background-color: var(--bg-surface);
            color: var(--text-primary);
            border-color: var(--border-focus);
          }

          /* Hero Section */
          .hero {
            display: flex;
            align-items: center;
            min-height: calc(100vh - 80px);
            padding: 4rem 0;
            gap: 4rem;
          }

          .hero-content {
            flex: 1;
          }

          .tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            background-color: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 1.5rem;
          }

          .hero h2 {
            font-size: 4rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            letter-spacing: -0.03em;
          }

          .text-gradient {
            background: linear-gradient(to right, var(--text-primary), var(--text-tertiary));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero p {
            font-size: 1.15rem;
            color: var(--text-secondary);
            margin-bottom: 2.5rem;
            max-width: 540px;
          }

          .hero-buttons {
            display: flex;
            gap: 1rem;
          }

          /* IDE Style Code Card */
          .hero-image {
            flex: 1;
           
            perspective: 1000px;
          }

          .ide-card {
            background: #0d1117;
            /* GitHub Dark Dimmed Style */
            border-radius: 12px;
            width: 100%;
            max-width: 540px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            border: 1px solid #30363d;
            transform: rotateY(-8deg) rotateX(4deg);
            transition: transform 0.5s ease;
            overflow: hidden;
          }

          .ide-card:hover {
            transform: rotateY(0deg) rotateX(0deg);
          }

          .ide-header {
            background: #161b22;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #30363d;
          }

          .ide-dots {
            display: flex;
            gap: 6px;
          }

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }

          .dot-red {
            background-color: #ff5f56;
          }

          .dot-yellow {
            background-color: #ffbd2e;
          }

          .dot-green {
            background-color: #27c93f;
          }

          .ide-title {
            margin-left: 1rem;
            font-family: 'Inter', sans-serif;
            font-size: 0.8rem;
            color: #8b949e;
          }

          .ide-content {
            padding: 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1rem;
            line-height: 1.6;
            color: #c9d1d9;
            overflow-x: auto;
          }

          /* Syntax Highlighting */
          .token-keyword {
            color: #ff7b72;
          }

          .token-function {
            color: #d2a8ff;
          }

          .token-string {
            color: #a5d6ff;
          }

          .token-comment {
            color: #8b949e;
            font-style: italic;
          }

          .token-operator {
            color: #79c0ff;
          }

          /* Feature Banner */
          .feature-banner {
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 3rem;
            margin: 4rem 0 2rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 3rem;
          }

          .feature-info {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
            flex: 1;
          }

          .feature-icon {
            width: 48px;
            height: 48px;
            background: rgba(245, 158, 11, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-primary);
            font-size: 1.5rem;
            flex-shrink: 0;
            border: 1px solid rgba(245, 158, 11, 0.2);
          }

          .feature-text h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .feature-text p {
            color: var(--text-secondary);
            font-size: 0.95rem;
          }

          /* Modals */
          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            padding: 1rem;
          }

          .modal.active {
            display: flex;
          }

          .modal-content {
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            width: 100%;
            max-width: 420px;
            box-shadow: var(--shadow-lg);
            animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(10px);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
          }

          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-subtle);
          }

          .modal-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
          }

          .close-modal {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 1.25rem;
            cursor: pointer;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 6px;
          }

          .close-modal:hover {
            color: var(--text-primary);
            background: var(--bg-surface-hover);
          }

          .modal-body {
            padding: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.25rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            background: var(--bg-base);
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: all 0.2s;
          }

          .form-control:focus {
            outline: none;
            border-color: var(--border-focus);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
          }

          .form-control::placeholder {
            color: var(--text-tertiary);
          }

          .submit-btn {
            width: 100%;
            padding: 0.875rem;
            margin-top: 0.5rem;
          }

          .form-footer {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
          }

          .form-footer a {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
          }

          .form-footer a:hover {
            color: var(--accent-primary);
          }

          /* Footer */
          footer {
            border-top: 1px solid var(--border-subtle);
            padding: 3rem 0;
            margin-top: 2rem;
            background: var(--bg-surface);
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }

          .social-icons {
            display: flex;
            gap: 1.25rem;
          }

          .social-icons a {
            color: var(--text-secondary);
            font-size: 1.25rem;
            transition: color 0.2s;
          }

          .social-icons a:hover {
            color: var(--text-primary);
          }

          /* Responsive */
          @media (max-width: 992px) {
            .hero {
                flex-direction: column;
                text-align: center;
                gap: 3rem;
                padding: 2rem 0;
            }

            .hero-content {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .hero h2 {
                font-size: 3rem;
            }

            .feature-banner {
                flex-direction: column;
                text-align: center;
                gap: 2rem;
            }

            .feature-info {
                flex-direction: column;
                align-items: center;
            }
          }

          @media (max-width: 640px) {
            .hero h2 {
                font-size: 2.25rem;
            }

            .hero-buttons {
                flex-direction: column;
                width: 100%;
            }

            .btn {
                width: 100%;
            }

            .footer-content {
                flex-direction: column;
                gap: 1.5rem;
                text-align: center;
            }

            .header-nav {
                display: none;
            }
          }


          .features {
          text-align: center;
          display: flex;
          align-items: center;
          
        }

        .features-title {
          font-size: 2rem;
          margin-bottom: 3rem;
          font-weight: 700;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));          

          gap: 2rem;
        }

        .feature-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 2rem;
          text-align: left;
          transition: all 0.25s ease;
        }

        .feature-card:hover {
          background: var(--bg-surface-hover);
          transform: translateY(-4px);
        }

        .feature-card h3 {
          margin: 1rem 0 0.5rem 0;
          font-size: 1.15rem;
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        `}
      </style>

      <header>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <a href="#" className="logo">
            <CodeXml size={32} />
            <h1>LeetSquad</h1>
          </a>
          <div className="header-nav" style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-outline"
              onClick={() => openModal("signIn")}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-content">
          <h2>
            <span className="text-gradient">Solve LeetCode Together</span>
            <br />
            Compete With Your Friends.
          </h2>
          <p>
            Create groups with friends, track your LeetCode progress, and
            compete on leaderboards. Stay motivated while preparing for coding
            interviews together.
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => openModal("signUp")}
            >
              Create Account
            </button>
            <button
              className="btn btn-outline"
              onClick={() =>
                window.open(
                  "https://github.com/ZLaTaN003/leetstack",
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              <i className="fab fa-github" />
              View on GitHub
            </button>
          </div>
        </div>

        <div className="hero-image hidden md:flex justify-center items-center">
          <div className="ide-card">
            <div className="ide-header">
              <div className="ide-dots">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
              </div>
              <div className="ide-title">squad.ts — LeetSquad</div>
            </div>
            <div className="ide-content">
              <span className="token-comment">//Two Sum</span>
              <br />
              <span className="token-keyword">function</span>{" "}
              <span className="token-function">twoSum</span>(nums:{" "}
              <span className="token-keyword">number</span>[], target:{" "}
              <span className="token-keyword">number</span>):{" "}
              <span className="token-keyword">number</span>[] {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="token-keyword">const</span> map ={" "}
              <span className="token-keyword">new</span>{" "}
              <span className="token-function">Map</span>&lt;
              <span className="token-keyword">number</span>,{" "}
              <span className="token-keyword">number</span>&gt;();
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-keyword">
                for
              </span>{" "}
              (<span className="token-keyword">let</span> i ={" "}
              <span className="token-number">0</span>; i &lt; nums.length; i++){" "}
              {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="token-keyword">const</span> complement = target -
              nums[i];
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="token-keyword">
                if
              </span> (map.has(complement)) {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="token-keyword">return</span>{" "}
              [map.get(complement), i];
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;map.set(nums[i],
              i);
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="token-keyword">return</span> [];
              <br />
              {"}"}
            </div>
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Link size={28} />{" "}
            </div>
            <h3>LeetCode Profile Sync</h3>
            <p>
              Link your LeetCode username during signup and automatically sync
              your solved problems and stats. Your progress stays updated
              without manual tracking.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={28} />{" "}
            </div>
            <h3>Track Your Progress</h3>
            <p>
              View your coding activity through charts and stats. See how
              consistently you solve problems and track improvement over time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
<Users size={28} />            </div>
            <h3>Groups and Leaderboards</h3>
            <p>
              Create groups with friends, compete on leaderboards, and chat in
              real time while solving problems together.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="feature-banner">
          <div className="feature-info">
            <div className="feature-icon">
              <CloudCog size={32} />
            </div>
            <div className="feature-text">
              <h3>Sync with LeetCode</h3>
              <p>
                Connect your LeetCode account to automatically sync your solved
                problems and stats with your group leaderboard.
              </p>
            </div>
          </div>
          <button
            className="btn btn-accent"
            onClick={() =>
              window.open(
                "https://leetcode.com",
                "_blank",
                "noopener noreferrer",
              )
            }
          >
            <i className="fas fa-plug" style={{ marginRight: "6px" }} />
            Connect LeetCode
          </button>
        </div>
      </div>

      {/* Sign Up Modal */}
      <div
        className={`modal ${activeModal === "signUp" ? "active" : ""}`}
        onClick={handleOverlayClick}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Initialize Profile</h2>
            <button className="close-modal" onClick={closeModal}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => handleAuth(e, "signUp")}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Leetcode Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="@leetcodeusername"
                  value={leetcodename}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={loading.signUp}
              >
                {loading.signUp ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="form-footer">
              Already initialized?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchModal("signIn");
                }}
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <div
        className={`modal ${activeModal === "signIn" ? "active" : ""}`}
        onClick={handleOverlayClick}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Sign In</h2>
            <button className="close-modal" onClick={closeModal}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => handleAuth(e, "signIn")}>
              <div className="form-group">
                <label htmlFor="signInEmail">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="signInEmail"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signInPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="signInPassword"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={loading.signIn}
              >
                {loading.signIn ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="form-footer">
              Need access?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  switchModal("signUp");
                }}
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container footer-content">
          <div>&copy; 2026 LeetSquad Platform. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
