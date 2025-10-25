import React from "react";
import { Icon } from "@iconify/react";

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface NavigationSidebarProps {
  sections: Section[];
  activeSection: string;
  isNavSticky: boolean;
  showMobileNav: boolean;
  onScrollToSection: (sectionId: string) => void;
  onBackToList: () => void;
  onToggleMobileNav: () => void;
  navRef?: React.RefObject<HTMLDivElement>;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  sections,
  activeSection,
  isNavSticky,
  showMobileNav,
  onScrollToSection,
  onBackToList,
  onToggleMobileNav,
  navRef,
}) => {
  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={onToggleMobileNav}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-subtle rounded-sm text-main-text hover:border-main-accent/40 transition-colors"
        >
          <Icon icon="material-symbols:menu" className="w-5 h-5" />
          <span className="font-display text-sm">Navigation</span>
          <Icon
            icon={
              showMobileNav
                ? "material-symbols:expand-less"
                : "material-symbols:expand-more"
            }
            className="w-5 h-5"
          />
        </button>

        {showMobileNav && (
          <div className="mt-2 bg-surface border border-subtle rounded-sm p-4">
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    onScrollToSection(section.id);
                    onToggleMobileNav();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-main-accent/20 text-main-accent"
                      : "text-main-light-text hover:bg-main-accent/5 hover:text-main-accent"
                  }`}
                >
                  <Icon icon={section.icon} className="w-4 h-4" />
                  <span className="font-display text-xs">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="mb-5 xl:mb-6">
          <button
            onClick={onBackToList}
            className="flex w-full items-center cursor-pointer gap-2 px-4 py-2 xl:px-5 xl:py-3 bg-surface hover:bg-main-accent/5 border border-subtle hover:border-main-accent/40 rounded-sm text-main-text hover:text-main-accent transition-all duration-300"
          >
            <Icon
              icon="material-symbols:arrow-back"
              className="w-5 h-5 xl:w-6 xl:h-6"
            />
            <span className="font-display text-sm xl:text-base">
              Back to Live Activity
            </span>
          </button>
        </div>
        <div
          ref={navRef}
          className={`w-64 xl:w-72 bg-surface border border-subtle rounded-sm p-4 xl:p-5 transition-all duration-200 ${
            isNavSticky
              ? "fixed top-96 z-40 max-h-[calc(100vh-1rem)] overflow-y-auto"
              : "relative"
          }`}
        >
          <nav className="space-y-2 xl:space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onScrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 xl:px-4 xl:py-3 rounded text-left transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-main-accent/20 text-main-accent border-l-2 border-main-accent"
                    : "text-main-light-text hover:bg-main-accent/5 hover:text-main-accent"
                }`}
              >
                <Icon icon={section.icon} className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="font-display text-sm xl:text-base">
                  {section.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;
