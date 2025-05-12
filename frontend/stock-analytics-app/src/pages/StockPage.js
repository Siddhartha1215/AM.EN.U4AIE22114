import React, { useEffect, useState } from 'react';
import { getStockData } from '../services/api';
import StockChart from '../components/StockChart';
import TimeSelector from '../components/TimeSelector';

const StockPage = () => {
    const [ticker, setTicker] = useState('AAPL');
    const [inputTicker, setInputTicker] = useState('AAPL');
    const [minutes, setMinutes] = useState(60);
    const [stockData, setStockData] = useState([]);
    const [avgPrice, setAvgPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        
        getStockData(ticker, minutes)
            .then(res => {
                setStockData(res.data.priceHistory);
                setAvgPrice(res.data.averageStockPrice);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch stock data:", err);
                setError(`Failed to load data for ${ticker}`);
                setLoading(false);
            });
    }, [ticker, minutes]);

    const handleTickerSubmit = (e) => {
        e.preventDefault();
        if (inputTicker.trim()) {
            setTicker(inputTicker.trim().toUpperCase());
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(120deg, #f8fafc 0%, #e3e9f7 100%)',
                fontFamily: 'Inter, sans-serif',
                padding: '40px 0',
            }}
        >
            <div
                style={{
                    maxWidth: 800,
                    margin: '0 auto',
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    padding: '32px',
                    animation: 'fadeIn 0.7s',
                }}
            >
                <form
                    onSubmit={handleTickerSubmit}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        gap: '10px',
                    }}
                >
                    <label
                        htmlFor="ticker-input"
                        style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#374151',
                        }}
                    >
                        Stock Ticker:
                    </label>
                    <input
                        id="ticker-input"
                        type="text"
                        value={inputTicker}
                        onChange={(e) => setInputTicker(e.target.value)}
                        placeholder="Enter stock ticker"
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            background: '#1a73e8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.background = '#155bb5')}
                        onMouseOut={(e) => (e.target.style.background = '#1a73e8')}
                    >
                        Load Stock
                    </button>
                </form>

                <h2
                    style={{
                        textAlign: 'center',
                        color: '#1a237e',
                        fontWeight: '700',
                        fontSize: '24px',
                        marginBottom: '20px',
                    }}
                >
                    {ticker} Stock Overview
                </h2>

                <TimeSelector minutes={minutes} setMinutes={setMinutes} />

                {loading && (
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#1a73e8',
                            fontWeight: '600',
                            marginTop: '20px',
                        }}
                    >
                        Loading...
                    </p>
                )}
                {error && (
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#d32f2f',
                            fontWeight: '600',
                            marginTop: '20px',
                        }}
                    >
                        {error}
                    </p>
                )}
                {!loading && !error && <StockChart data={stockData} avgPrice={avgPrice} />}
            </div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
};

export default StockPage;
