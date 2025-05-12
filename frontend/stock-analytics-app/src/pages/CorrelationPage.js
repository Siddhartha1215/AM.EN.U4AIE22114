import React, { useEffect, useState } from 'react';
import { getCorrelationData } from '../services/api';
import CorrelationHeatmap from '../components/CorrelationHeatmap';

const CorrelationPage = () => {
    const tickers = ['AAPL', 'GOOG', 'MSFT', 'TSLA'];
    const [minutes, setMinutes] = useState(15);
    const [heatmapData, setHeatmapData] = useState([]);
    const [stockDetails, setStockDetails] = useState({});

    useEffect(() => {
        const fetchCorrelation = async () => {
            const dataMatrix = [];
            const details = {};

            for (let i = 0; i < tickers.length; i++) {
                dataMatrix[i] = [];
                for (let j = 0; j < tickers.length; j++) {
                    if (i === j) {
                        dataMatrix[i][j] = 1;
                    } else {
                        try {
                            const res = await getCorrelationData([tickers[i], tickers[j]], minutes);
                            dataMatrix[i][j] = res.data.correlation;
                            details[tickers[i]] = {
                                avg: res.data.stocks[tickers[i]].averagePrice.toFixed(2)
                            };
                        } catch {
                            dataMatrix[i][j] = 0;
                        }
                    }
                }
            }

            setHeatmapData(dataMatrix);
            setStockDetails(details);
        };

        fetchCorrelation();
    }, [minutes]);

    const handleHover = (tickerX, tickerY) => {
        alert(`Stock: ${tickerX}\nAverage Price: $${stockDetails[tickerX]?.avg || 'N/A'}`);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(120deg, #f0f4ff 0%, #e3e9f7 100%)',
                fontFamily: 'Inter, sans-serif',
                padding: '40px 0'
            }}
        >
            <div
                style={{
                    maxWidth: 820,
                    margin: '0 auto',
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(60,80,180,0.08)',
                    padding: '36px 32px 28px 32px',
                    animation: 'fadeIn 0.7s'
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        color: '#1a237e',
                        fontWeight: 700,
                        fontSize: 32,
                        letterSpacing: 1,
                        marginBottom: 18
                    }}
                >
                    Correlation Heatmap
                </h2>
                <CorrelationHeatmap data={heatmapData} labels={tickers} onHover={handleHover} />
            </div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default CorrelationPage;
