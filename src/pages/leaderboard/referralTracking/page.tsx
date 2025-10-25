"use client";
import { useState } from "react";

const ReferralTracking = () => {
  const initialLink = "https://cherrybot.net/@";
  const referrals = 0;
  const traders = 0;
  const volume = 0;
  const [referralLink, setReferralLink] = useState(initialLink);
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="w-full bg-main-dark md:px-8 md:py-6">
      {/* Page title */}
      <h1 className="text-2xl font-medium text-mono-100 mb-6 p-4 md:p-0">
        Referral Tracking
      </h1>

      <div className="flex flex-col gap-4">
        {/* Referral Link Card */}
        <div className="bg-foreground-default md:rounded-md flex-1 p-4 md:px-6">
          <h2 className="text-[20px] font-medium text-mono-100">
            Your referral link
          </h2>
          <hr className="w-full my-4" />

          <div className="flex flex-col items-start gap-6 pt-2">
            <p className="text-base md:text-xl text-mono-200">
              You have 1 chance to update your referral URL handle.
            </p>
            <div className="flex items-start md:items-center flex-col md:flex-row gap-4 w-full">
              <span className="text-mono-100 text-base md:text-2xl">
                {initialLink}
              </span>
              <input
                type="text"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                className="bg-transparent w-full md:w-[unset] border border-border rounded-full py-3 px-4 text-mono-100 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <button className="bg-primary hover:bg-hover-primary text-mono-100 rounded-lg text-lg px-6 py-2.5 font-medium flex-shrink-0 transition-all cursor-pointer w-full md:w-[unset]">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-foreground-default md:rounded-md p-4 md:px-6 flex-1">
          <h2 className="text-xl font-medium text-mono-100">Your Stats</h2>
          <hr className="w-full my-4" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-mono-200 text-lg">Referrals</span>
              <span className="text-xl text-mono-100">{referrals}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-mono-200 text-lg">Traders</span>
              <span className="text-xl text-mono-100">{traders}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-mono-200 text-lg">
                Volume done by traders
              </span>
              <span className="text-xl text-mono-100">{volume}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralTracking;
