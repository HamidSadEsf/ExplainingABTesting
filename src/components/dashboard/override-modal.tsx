"use client";

import React, { useState } from "react";
import { ShieldAlert, X } from "lucide-react";

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride: (reason: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverride,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-amber-400 mb-3">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="text-base font-bold text-white">
            Bypass Statistical Safety Gate
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Warning: Rolling out an experiment before reaching statistical
          significance increases downside risk. An audit log entry will be
          permanently associated with your deployment.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Business Rationale for Early Deployment:
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Marketing team requires immediate rollout for commercial promo launch..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs text-slate-400 hover:text-white bg-slate-800"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirmOverride(reason);
              onClose();
            }}
            className="px-4 py-2 rounded text-xs font-medium bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Forced Deployment
          </button>
        </div>
      </div>
    </div>
  );
};