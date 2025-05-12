import React from 'react';

const TimeSelector = ({ minutes, setMinutes }) => {
    return (
        <div>
            <label>Select Time (minutes): </label>
            <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                {[5, 15, 30, 60, 120].map((val) => (
                    <option key={val} value={val}>{val} minutes</option>
                ))}
            </select>
        </div>
    );
};

export default TimeSelector;
