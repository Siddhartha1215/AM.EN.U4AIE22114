import React from 'react';

const StockInfoTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'white', padding: 10, border: '1px solid #ccc' }}>
                <p>{`Time: ${label}`}</p>
                <p>{`Price: $${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default StockInfoTooltip;
