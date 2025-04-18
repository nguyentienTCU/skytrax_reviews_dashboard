import React from "react";

const DataSummary = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Data Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <h3 className="text-2xl font-bold text-blue-600">3,250</h3>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <i className="fas fa-comment text-blue-600"></i>
            </div>
          </div>
        </div>
        <div className="stat-card bg-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified Reviews</p>
              <h3 className="text-2xl font-bold text-green-600">78%</h3>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
          </div>
        </div>
        <div className="stat-card bg-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Airlines</p>
              <h3 className="text-2xl font-bold text-purple-600">42</h3>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <i className="fas fa-plane text-purple-600"></i>
            </div>
          </div>
        </div>
        <div className="stat-card bg-yellow-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Countries</p>
              <h3 className="text-2xl font-bold text-yellow-600">89</h3>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <i className="fas fa-globe text-yellow-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
