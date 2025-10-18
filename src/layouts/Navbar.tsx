import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar: React.FC = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accent, setAccent] = useState<string>("cyan");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Accent theme init and persistence
  useEffect(() => {
    const stored = localStorage.getItem("accentTheme");
    const initial = stored || "cyan";
    setAccent(initial);
    document.documentElement.setAttribute("data-accent", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("accentTheme", accent);
  }, [accent]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path: string) => {
    if (location.pathname === path) {
      return true;
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path + "/");
  };

  const getDesktopLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center px-3 py-2 font-display text-sm transition-all duration-300 rounded-lg";
    const activeClasses = isActivePath(path)
      ? "text-main-accent bg-main-accent/10"
      : "text-main-light-text hover:text-main-accent hover:bg-white/[0.05]";

    return `${baseClasses} ${activeClasses}`;
  };

  const getMobileLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center py-3 px-4 font-display text-sm transition-all duration-300 rounded-lg";
    const activeClasses = isActivePath(path)
      ? "text-main-accent bg-main-accent/10"
      : "text-main-light-text hover:text-main-accent hover:bg-white/[0.05]";

    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <>
      <nav
        className={`  top-0 left-0 w-screen   z-50 px-2 md:px-6 transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-main-bg bg-opacity-95   shadow-2xl border-b border-main-accent border-opacity-50"
            : "py-4 bg-main-bg border-b border-main-bg  bg-opacity-80  "
        }`}
      >
        <div className="max-w-7xl xl:max-w-[99rem] mx-auto px-4 sm:px-2 lg:px-3">
          <div className="flex justify-between items-center">
            {/* Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <h2 className="text-xl font-bold font-mono bg-gradient-to-r from-main-accent to-main-highlight bg-clip-text text-transparent">
                  Token Find
                </h2>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/kols" className={getDesktopLinkClasses("/kols")}>
                <Icon icon="material-symbols:group" className="w-4 h-4 mr-2" />
                <span>KOLs</span>
              </Link>
              <Link to="/devs" className={getDesktopLinkClasses("/devs")}>
                <Icon icon="material-symbols:code" className="w-4 h-4 mr-2" />
                <span>Devs</span>
              </Link>
              <Link to="/tokens" className={getDesktopLinkClasses("/tokens")}>
                <Icon icon="material-symbols:token" className="w-4 h-4 mr-2" />
                <span>Tokens</span>
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <div className="flex items-center gap-1 px-2 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1]">
                {(["cyan", "violet", "emerald", "amber"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAccent(a)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-transform duration-200 ${
                      accent === a
                        ? "scale-110 ring-2 ring-white/30"
                        : "hover:scale-110"
                    }`}
                    aria-label={`Set accent ${a}`}
                    title={`Theme: ${a}`}
                    style={{
                      backgroundColor:
                        a === "cyan"
                          ? "#00b4d8"
                          : a === "violet"
                          ? "#8b5cf6"
                          : a === "emerald"
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="outline-none p-2 rounded-lg   bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 transition-all duration-300 cursor-pointer"
                aria-label="Menu"
              >
                <svg
                  className={`w-6 h-6 text-main-text transition-all duration-300 ${
                    isMobileMenuOpen ? "transform rotate-90" : ""
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100 py-4 bg-main-bg bg-opacity-95"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* Mobile Navigation Links */}
            <Link to="/kols" className={getMobileLinkClasses("/kols")}>
              <Icon icon="material-symbols:group" className="w-4 h-4 mr-2" />
              KOLs
            </Link>
            <Link to="/devs" className={getMobileLinkClasses("/devs")}>
              <Icon icon="material-symbols:code" className="w-4 h-4 mr-2" />
              Devs
            </Link>
            <Link to="/tokens" className={getMobileLinkClasses("/tokens")}>
              <Icon icon="material-symbols:token" className="w-4 h-4 mr-2" />
              Tokens
            </Link>
          </div>
        </div>
      </nav>

      {/* Add custom styles */}
      <style>
        {`
          .nav-link::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              var(--color-main-accent),
              var(--color-main-highlight)
            );
            border-radius: 1px;
            transition: width 0.3s ease;
          }

          .nav-link:hover::after {
            width: 80%;
          }

          .active-nav-link::after {
            width: 80%;
          }

          /* Smooth transitions for mobile menu */
          .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Custom scrollbar for search input */
          input::-webkit-scrollbar {
            display: none;
          }

          /* Focus ring customization */
          .focus\\:ring-main-accent:focus {
            --tw-ring-color: var(--color-main-accent);
            --tw-ring-opacity: 0.3;
          }
        `}
      </style>
    </>
  );
});

export default Navbar;
