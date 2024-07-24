import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, LineChart, YAxis, Tooltip, Legend, Line } from 'recharts';
import { baseUrl } from '../../../../utils/config';

export const theme = {
  tickText: '#7c7c7c',
  gridStroke: '#000',
  lineStroke: '#ff8b00',
  dotFill: '#1c0d00',
  dotStroke: '#b1b1b1',
  legendColor: '#7c7c7c'
};

const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fontSize={12} fill={theme.tickText}>
        {payload.value}
      </text>
    </g>
  );
};

// Dummy data
const dummyData = [
  { name: 'Page A', value: 20 },
  { name: 'Page B', value: 300 },
  { name: 'Page C', value: 200 },
  { name: 'Page D', value: 278 },
  { name: 'Page E', value: 189 },
  { name: 'Page F', value: 239 },
  { name: 'Page G', value: 349 },
];

const SalaryDetailsInLineChart = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
    const res = await axios.get(baseUrl + "get_salary_by_month_wise");
    // setData(res.data.data);
    console.log(res.data , 'ok one')
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Simulating an API call with dummy data
    setData(dummyData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 10, right: 40, left: 10, bottom: 50 }}>
        <CartesianGrid stroke={theme.gridStroke} />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} tick={<CustomizedAxisTick />} />
        <YAxis domain={['dataMin-5', 'dataMax+10']} tick={<CustomizedAxisTick />} />
        <Tooltip wrapperStyle={{ backgroundColor: '#000', fontSize: 12 }} />
        <Legend
          wrapperStyle={{ color: theme.legendColor, fontSize: 12 }}
          layout="vertical"
          verticalAlign="top"
          height={36}
        />
        <Line
          type="linear"
          dataKey="value"
          stroke={theme.lineStroke}
          dot={{ stroke: theme.dotStroke, strokeWidth: 1, fill: theme.dotFill }}
          activeDot
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalaryDetailsInLineChart;
