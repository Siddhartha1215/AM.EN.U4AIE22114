import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import StockInfoTooltip from './StockInfoTooltip';

const StockChart = ({ data, avgPrice }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <XAxis dataKey="lastUpdatedAt" />
                <YAxis />
                <Tooltip content={<StockInfoTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" name="Stock Price" />
                <ReferenceLine y={avgPrice} label="Average" stroke="red" strokeDasharray="3 3" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockChart;
