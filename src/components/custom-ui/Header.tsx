import React from "react";

const Header = () => {
  return (
    <div className="card relative h-[30vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="flex items-center">
        <div>
          <i className="fas fa-plane-departure text-4xl mr-4"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Flight Reviews Dashboard</h1>
          <p className="text-lg mt-2">
            Interactive analysis of customer flight experiences
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
