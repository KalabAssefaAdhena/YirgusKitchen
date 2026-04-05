import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const WeeklyUserChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/weekly_user_registration/')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return (
    <div className="card p-3 shadow">
      <h5 className="text-primary">Weekly New Users </h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line dataKey="new_users" fill="#00bfff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyUserChart;
