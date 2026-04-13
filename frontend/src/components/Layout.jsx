import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredUser } from "../utils/storage";

const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  List: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Wallet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: Icons.Dashboard },
  { to: "/transactions/new", label: "New Transaction", Icon: Icons.Plus },
  { to: "/transactions", label: "Transactions", Icon: Icons.List },
  { to: "/expenses", label: "Expenses", Icon: Icons.Wallet },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const logout = () => {
    clearStoredSession();
    navigate("/");
  };

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "branch_manager"
      ? "Branch Manager"
      : "Operator";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">CF</div>
            <h1>CashFlow</h1>
          </div>
          <div className="sidebar-role-badge">{roleLabel}</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link${location.pathname === to ? " active" : ""}`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="profile-name">{user?.name}</div>
            <div className="profile-info">
              {user?.branch_name || "All Branches"} · {roleLabel}
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center", color: "#94a3b8", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Icons.Logout />
            Logout
          </button>
        </div>
      </aside>

      <main className="page-content">{children}</main>
    </div>
  );
}
