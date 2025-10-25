"use client";

import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableBounds } from "react-draggable";
import { X, Wallet, ChevronDown } from "lucide-react";

interface QuickSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DraggableModal({
  isOpen,
  onClose,
}: QuickSwapModalProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<DraggableBounds>({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  const updateBounds = () => {
    if (nodeRef.current) {
      const modal = nodeRef.current;
      const { innerWidth, innerHeight } = window;
      const rect = modal.getBoundingClientRect();

      setBounds({
        left: -rect.left,
        top: -rect.top,
        right: innerWidth - rect.right,
        bottom: innerHeight - rect.bottom,
      });
    }
  };

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Draggable nodeRef={nodeRef} bounds={bounds}>
        <div
          ref={nodeRef}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0e0f13] border border-border text-white shadow-lg w-[400px] rounded-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 cursor-move drag-handle border-b border-border">
            <h2 className="text-sm font-medium text-white">Quick Swap</h2>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Wallet Selector */}
          <div className="px-4 py-3">
            <button className="flex items-center justify-between w-full px-3 py-2 border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
              <span className="flex items-center gap-2">
                <Wallet size={16} className="text-white/50" />
                <span className="text-sm">Wallet 1</span>
              </span>
              <ChevronDown size={14} className="text-white/50" />
            </button>
          </div>

          <div className="h-px bg-border mx-4" />

          {/* Quick Buy */}
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white">Quick Buy</span>
              <div className="flex gap-1">
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S1
                </button>
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S2
                </button>
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S3
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["0.25", "0.5", "1", "2", "5", "10"].map((val) => (
                <button
                  key={val}
                  className="flex cursor-pointer items-center text-sm justify-center py-2 px-1 border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors"
                >
                  <span>{val}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border mx-4" />

          {/* Quick Sell */}
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white">Quick Sell</span>
              <div className="flex gap-1">
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S1
                </button>
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S2
                </button>
                <button className="w-6 h-6 flex cursor-pointer items-center text-xs justify-center border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors">
                  S3
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["25%", "50%", "100%"].map((val) => (
                <button
                  key={val}
                  className="flex cursor-pointer items-center text-sm justify-center py-2 px-1 border border-border text-white/50 hover:bg-white/5 hover:text-white rounded-sm transition-colors"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}
