"use client";

import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="card relative min-h-[110px] h-[20vh] md:h-[18vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white">
      <div className="flex items-center animate-pulse">
        {/* --- LOGO --- */}
        <div className="mr-4">
          <Image
            src="/web_logo.png"
            alt="Flightly logo"
            width={100}
            height={100}
            priority
            className="h-12 w-12 md:h-14 md:w-14 select-none"
          />
        </div>

        {/* --- TEXT --- */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Flightly Dashboard</h1>
          <p className="text-lg mt-2">
            Interactive analysis of customer flight experiences
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
