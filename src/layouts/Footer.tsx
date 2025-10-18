import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-white/[0.08] bg-main-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div className="flex items-center">
            <h2 className="font-mono text-lg font-bold bg-gradient-to-r from-main-accent to-main-highlight bg-clip-text text-transparent">
              Token Find
            </h2>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            <Link
              to="/kols"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              KOLs
            </Link>
            <Link
              to="/devs"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Devs
            </Link>
            <Link
              to="/tokens"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Tokens
            </Link>
            <a
              href="/docs"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Docs
            </a>
            <a
              href="/api"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              API
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-display text-xs text-main-light-text/70">
            © 2025 Token Find. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="font-display text-xs text-main-light-text/70 hover:text-main-accent transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="font-display text-xs text-main-light-text/70 hover:text-main-accent transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
