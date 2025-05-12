import React from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  Cell,
  CartesianGrid,
  Label
} from 'recharts';

const CorrelationHeatmap = ({ data, labels, onHover }) => {
  // Transform matrix data into format for Recharts
  const heatmapData = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = 0; j < labels.length; j++) {
      if (data[i] && data[i][j] !== undefined) {
        heatmapData.push({
          x: j,
          y: i,
          value: data[i][j],
          xLabel: labels[j],
          yLabel: labels[i]
        });
      }
    }
  }

  // Blue (negative) → White (zero) → Red (positive)
  const getColor = (value) => {
    const r = Math.round(255 * Math.max(0, value));
    const g = Math.round(255 * (1 - Math.abs(value)));
    const b = Math.round(255 * Math.max(0, -value));
    return `rgb(${r},${g},${b})`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '12px 16px',
          border: '1px solid #888',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <strong style={{ fontSize: 16 }}>{data.xLabel} &ndash; {data.yLabel}</strong>
          <div style={{ marginTop: 4, fontSize: 14 }}>
            Correlation: <b>{data.value.toFixed(2)}</b>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      borderRadius: 18,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      padding: 32,
      margin: '32px auto',
      maxWidth: 700
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 24,
        color: '#1a237e',
        letterSpacing: 1
      }}>Correlation Heatmap</h2>
      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <ScatterChart
            margin={{
              top: 40,
              right: 40,
              bottom: 40,
              left: 40,
            }}
          >
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="xAxis"
              tick={false}
              domain={[-0.5, labels.length - 0.5]}
              axisLine={false}
            >
              <Label
                value="Stock"
                offset={20}
                position="bottom"
                style={{ fill: '#374151', fontWeight: 600, fontSize: 16 }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="yAxis"
              tick={false}
              domain={[-0.5, labels.length - 0.5]}
              axisLine={false}
            >
              <Label
                value="Stock"
                angle={-90}
                position="left"
                style={{ fill: '#374151', fontWeight: 600, fontSize: 16 }}
              />
            </YAxis>
            {/* Render axis labels */}
            {/* Render custom X/Y labels */}
            {labels.map((label, idx) => (
              <text
                key={`x-label-${label}`}
                x={60 + (idx * (300 / (labels.length - 1)))}
                y={390}
                textAnchor="middle"
                fontSize={14}
                fill="#374151"
                fontWeight={500}
              >
                {label}
              </text>
            ))}
            {labels.map((label, idx) => (
              <text
                key={`y-label-${label}`}
                x={20}
                y={70 + (idx * (300 / (labels.length - 1)))}
                textAnchor="end"
                fontSize={14}
                fill="#374151"
                fontWeight={500}
              >
                {label}
              </text>
            ))}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Scatter
              data={heatmapData}
              shape="square"
              onClick={(data) => onHover(data.xLabel, data.yLabel)}
            >
              {heatmapData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.value)}
                  width={38}
                  height={38}
                  stroke="#fff"
                  strokeWidth={entry.value === 1 ? 2 : 1}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))',
                    cursor: 'pointer',
                    transition: 'stroke 0.2s'
                  }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div style={{
        marginTop: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        <span style={{
          display: 'inline-block',
          width: 32,
          height: 16,
          background: 'linear-gradient(90deg, #1565c0 0%, #fff 50%, #d32f2f 100%)',
          borderRadius: 8,
          border: '1px solid #bdbdbd',
          marginRight: 8
        }} />
        <span style={{ color: '#1565c0', fontWeight: 500 }}>-1</span>
        <span style={{ color: '#374151', fontWeight: 500 }}>0</span>
        <span style={{ color: '#d32f2f', fontWeight: 500 }}>+1</span>
        <span style={{ marginLeft: 16, color: '#555', fontSize: 14 }}>
          Blue: Negative, White: Neutral, Red: Positive
        </span>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
