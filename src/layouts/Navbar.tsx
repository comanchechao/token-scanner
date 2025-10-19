import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar: React.FC = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accent, setAccent] = useState<string>("cyan");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize theme from localStorage or default to dark for first-time visitors
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }
      // First-time visitor: default to dark mode
      return "dark";
    }
    return "dark"; // SSR fallback
  });
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

  // Apply theme to DOM and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleColorSelect = (color: string) => {
    setAccent(color);
    setIsColorPickerOpen(false);
  };

  const getColorValue = (color: string) => {
    switch (color) {
      case "cyan":
        return "#00b4d8";
      case "violet":
        return "#8b5cf6";
      case "emerald":
        return "#099E65";
      case "amber":
        return "#f59e0b";
      default:
        return "#00b4d8";
    }
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
            <div
              className="relative  "
              style={{ backgroundColor: getColorValue(accent) }}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-surface border border-subtle hover:border-main-accent/30 transition-all duration-300 cursor-pointer">
                <Link to="/" className="flex items-center group">
                  <h2 className="text-xl font-bold font-mono  text-main-text">
                    Token Find
                  </h2>
                </Link>
              </div>
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

            {/* Theme & Accent Controls */}
            <div className="flex items-center gap-4   relative">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-3 rounded-sm bg-surface border border-subtle hover:border-main-accent/30 transition-all duration-300 cursor-pointer"
                aria-label="Toggle theme"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                <Icon
                  icon={
                    theme === "dark"
                      ? "material-symbols:light-mode-outline"
                      : "material-symbols:dark-mode-outline"
                  }
                  className="w-5 h-5 text-main-text"
                />
                <span className="hidden md:inline text-sm text-main-light-text capitalize">
                  {theme}
                </span>
              </button>
              <div
                className="relative  "
                style={{ backgroundColor: getColorValue(accent) }}
              >
                <button
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  className="flex items-center gap-2 px-3 py-3 rounded-sm bg-surface border border-subtle hover:border-main-accent/30 transition-all duration-300 cursor-pointer"
                  aria-label="Color picker"
                >
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white/30"
                    style={{ backgroundColor: getColorValue(accent) }}
                  />
                  <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className={`w-4 h-4 text-main-text transition-transform duration-200 ${
                      isColorPickerOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isColorPickerOpen && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-surface border border-subtle rounded-lg shadow-2xl z-50 min-w-[120px]">
                    <div className="space-y-1">
                      {(["cyan", "violet", "emerald", "amber"] as const).map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                              accent === color
                                ? "bg-main-accent/20 text-main-accent"
                                : "text-main-light-text hover:text-main-accent hover:bg-white/[0.05]"
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getColorValue(color) }}
                            />
                            <span className="capitalize">{color}</span>
                            {accent === color && (
                              <Icon
                                icon="material-symbols:check"
                                className="w-4 h-4 ml-auto"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="outline-none p-2 rounded-sm bg-surface hover:bg-white/[0.06] border border-subtle hover:border-main-accent/30 transition-all duration-300 cursor-pointer"
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
