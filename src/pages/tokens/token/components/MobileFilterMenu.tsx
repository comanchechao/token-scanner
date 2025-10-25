"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

interface MobileFilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
  amountRange: { min: string; max: string };
  onAmountChange: (min: string, max: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const MobileFilterMenu: React.FC<MobileFilterMenuProps> = ({
  isOpen,
  onClose,
  selectedTypes,
  onTypeSelect,
  amountRange,
  onAmountChange,
  onReset,
  onApply,
}) => {
  const [totalSolRange, setTotalSolRange] = useState({ min: "", max: "" });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-color-main-dark w-full rounded-t-2xl p-4 space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Filters</h3>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <Icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Type</p>
            <div className="grid grid-cols-2 gap-2">
              {["Buy", "Sell", "Add", "Remove"].map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => onTypeSelect(type)}
                    className="appearance-none w-4 h-4 rounded border border-gray-600 checked:bg-primary checked:border-primary bg-transparent cursor-pointer relative
                    after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center 
                    checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDNMNC41IDguNUwyIDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')])"
                  />
                  <span className="text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Amount Range</p>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min amount"
                value={amountRange.min}
                onChange={(e) =>
                  onAmountChange(e.target.value, amountRange.max)
                }
                className="w-full bg-hover-primary text-white   px-4 py-3 rounded-full border border-border focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <input
                type="number"
                placeholder="Max amount"
                value={amountRange.max}
                onChange={(e) =>
                  onAmountChange(amountRange.min, e.target.value)
                }
                className="w-full bg-hover-primary text-white   px-4 py-3 rounded-full border border-border focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Icon
                    icon="token-branded:solana"
                    className="w-5 h-5 text-primary"
                  />
                </div>
                <input
                  type="number"
                  placeholder="min"
                  value={totalSolRange.min}
                  onChange={(e) =>
                    setTotalSolRange((prev) => ({
                      ...prev,
                      min: e.target.value,
                    }))
                  }
                  className="w-full bg-hover-primary text-white pl-12 pr-4 py-3 rounded-full border border-border focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Icon
                    icon="token-branded:solana"
                    className="w-5 h-5 text-primary"
                  />
                </div>
                <input
                  type="number"
                  placeholder="max"
                  value={totalSolRange.max}
                  onChange={(e) =>
                    setTotalSolRange((prev) => ({
                      ...prev,
                      max: e.target.value,
                    }))
                  }
                  className="w-full bg-hover-primary text-white pl-12 pr-4 py-3 rounded-full border border-border focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-between border-t border-gray-800">
            <button
              onClick={onReset}
              className="px-6 py-2 text-gray-400 hover:text-white rounded-full"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-hover-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterMenu;
