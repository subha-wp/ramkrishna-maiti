"use client";

import SIPCalculator from "@/components/sip-calculator";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  AdvisorSetup,
  isSetupComplete,
  saveAdvisorInfo,
  type AdvisorInfo,
} from "@/components/advisor-setup";

export default function Home() {
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if setup is complete on mount
    if (!isSetupComplete()) {
      setShowSetup(true);
    }
  }, []);

  const handleSave = (info: AdvisorInfo) => {
    saveAdvisorInfo(info);
    setShowSetup(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between md:py-10 px-2 md:px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center md:gap-2 justify-between w-full">
          <Image
            className="dark:invert"
            src="/codvix-black.svg"
            alt="Ramkrishna Maiti"
            width={100}
            height={100}
            priority
          />
          <h3 className="font-bold">+91 1169313594</h3>
        </div>
        <SIPCalculator />
        <AdvisorSetup
          open={showSetup}
          onClose={() => setShowSetup(false)}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
