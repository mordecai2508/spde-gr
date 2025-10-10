import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const RiskChart = ({ predictions }) => {  // Assume data from /dropout_predictions
  const data = predictions.map(p => ({ name: p.student_code, risk: p.probability, level: p.risk_level }));

  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="risk" fill="#8884d8" label="Risk Probability" />
    </BarChart>
  );
};

export default RiskChart;