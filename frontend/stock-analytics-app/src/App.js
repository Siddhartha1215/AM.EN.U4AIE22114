import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

const App = () => {
    return (
        <Router>
            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(120deg, #f8fafc 0%, #e3e9f7 100%)',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <nav
                    style={{
                        background: '#1a237e',
                        padding: '16px 32px',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <NavLink
                        to="/"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#c5cae9',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 16px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            transition: 'background 0.3s',
                            background: isActive ? '#3949ab' : 'transparent',
                        })}
                        onMouseOver={(e) => (e.target.style.background = '#3949ab')}
                        onMouseOut={(e) => {
                            if (!e.target.classList.contains('active')) {
                                e.target.style.background = 'transparent';
                            }
                        }}
                    >
                        Stock Page
                    </NavLink>
                    <NavLink
                        to="/correlation"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#c5cae9',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 16px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            transition: 'background 0.3s',
                            background: isActive ? '#3949ab' : 'transparent',
                        })}
                        onMouseOver={(e) => (e.target.style.background = '#3949ab')}
                        onMouseOut={(e) => {
                            if (!e.target.classList.contains('active')) {
                                e.target.style.background = 'transparent';
                            }
                        }}
                    >
                        Correlation Heatmap
                    </NavLink>
                </nav>
                <div style={{ padding: '32px' }}>
                    <Routes>
                        <Route path="/" element={<StockPage />} />
                        <Route path="/correlation" element={<CorrelationPage />} />
                    </Routes>
                </div>
            </div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                `}
            </style>
        </Router>
    );
};

export default App;
