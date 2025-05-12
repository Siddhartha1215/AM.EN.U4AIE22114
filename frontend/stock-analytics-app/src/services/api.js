import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const getStockData = (ticker, minutes) => {
    return axios.get(`${BASE_URL}/stocks/${ticker}`, {
        params: { minutes }
    });
};

export const getCorrelationData = (tickers, minutes) => {
    return axios.get(`${BASE_URL}/stockcorrelation`, {
        params: { minutes, ticker: tickers }
    });
};
