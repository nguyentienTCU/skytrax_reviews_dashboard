import React from "react";
import LineGraph from "@/components/custom-ui/LineGraph";
import BarGraph from "@/components/custom-ui/BarGraph";

const TimeAnalysis = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Time-based Analysis
      </h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Reviews Over Time
        </h3>
        <div className="chart-container">
          <LineGraph 
            valueLabels={["Jan 2021", "Feb 2021", "Mar 2021", "Apr 2021", "May 2021", "Jun 2021", "Jul 2021", "Aug 2021", "Sep 2021", "Oct 2021", "Nov 2021", "Dec 2021"]}
            values={[120, 145, 180, 210, 250, 290, 310, 330, 300, 270, 230, 200]}
            xTitle="Month"
            yTitle="Number of Reviews"
            title="Reviews Over Time"
            backgroundColor="rgba(59, 130, 246, 0.1)"
            borderColor="rgb(59, 130, 246)"
            borderWidth={2}
          />
        </div>
      </div>

      {/* Reviews Over Time Line Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Day of Week
          </h3>
          <div className="chart-container h-64">
            <BarGraph
              valueLabels={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
              values={[350, 420, 390, 480, 560, 620, 430]}
              xTitle="Day of Week"
              yTitle="Number of Reviews"
              title="Reviews by Day of Week"
              backgroundColor={[                            'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(201, 203, 207, 0.7)']}
              borderColor={[                            'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 206, 86)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)']}
              borderWidth={1}
            />
          </div>
        </div>

        {/* Reviews by Month Bar Graph */}

        <div className="chart-container h-64">
          <BarGraph
            valueLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            values={[280, 250, 310, 340, 380, 430, 470, 450, 400, 360, 320, 290]}
            title="Reviews by Month"
            backgroundColor={['rgba(75, 192, 192, 0.7)']}
            borderColor={['rgb(75, 192, 192)']}
            borderWidth={1}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
