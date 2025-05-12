from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)

CORS(app)


@app.route('/')
def index():
    return "Welcome to the Stock Price API!"

BASE_URL = "http://20.244.56.144/evaluation-service"
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDYzNjYwLCJpYXQiOjE3NDcwNjMzNjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijk3ZDQyNTk2LTNjYWMtNDBhNy04ZTkzLWM2YjJmM2ViM2Q0NSIsInN1YiI6InNpZGRoYXJ0aGExMjAxMDVAZ21haWwuY29tIn0sImVtYWlsIjoic2lkZGhhcnRoYTEyMDEwNUBnbWFpbC5jb20iLCJuYW1lIjoiY2hha2thIGJoYXJnYXZhIHNpZGRoYXJ0aGEiLCJyb2xsTm8iOiJhbS5lbi51NGFpZTIyMTE0IiwiYWNjZXNzQ29kZSI6IlN3dXVLRSIsImNsaWVudElEIjoiOTdkNDI1OTYtM2NhYy00MGE3LThlOTMtYzZiMmYzZWIzZDQ1IiwiY2xpZW50U2VjcmV0IjoidUZGV2FFbU1zVGNYWHRoUiJ9.iR3Gl3lwbc3_sWIkC6oadfyIHbdANik3OZhnpu21I4k"
}

def get_stock_history(ticker, minutes):
    url = f"{BASE_URL}/stocks/{ticker}?minutes={minutes}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            return data
        else:
            return [data.get('stock')] if data.get('stock') else []
    else:
        return []


@app.route('/stocks', methods=['GET'])
def update_stock_price():
    
    url = "http://20.244.56.144/evaluation-service/stocks"
    response = requests.get(url, headers=HEADERS)
    print(response)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch stock data."}), response.status_code

@app.route('/stocks/<ticker>', methods=['GET'])
def average_stock_price(ticker):
    minutes = request.args.get('minutes', type=int)
    aggregation = request.args.get('aggregation', default='average')
    print(f"Aggregation: {aggregation}")
    print(f"Ticker: {ticker}")
    print(f"Minutes: {minutes}")

    if not minutes:
        return jsonify({"error": "Please provide 'minutes' query parameter."}), 400

    price_data = get_stock_history(ticker, minutes)

    if not price_data:
        return jsonify({"error": "No data found."}), 404

    prices = [entry['price'] for entry in price_data]

    avg_price = sum(prices) / len(prices)

    return jsonify({
        "averageStockPrice": avg_price,
        "priceHistory": price_data
    })

@app.route('/stockcorrelation', methods=['GET'])
def stock_correlation():
    minutes = request.args.get('minutes', type=int)
    tickers = request.args.getlist('ticker')

    if not minutes or len(tickers) != 2:
        return jsonify({"error": "Please provide 'minutes' and exactly 2 'ticker' query parameters."}), 400

    stock_data = {}
    aligned_prices = {}

    for ticker in tickers:
        data = get_stock_history(ticker, minutes)
        if not data:
            return jsonify({"error": f"No data found for {ticker}."}), 404

        stock_data[ticker] = data
        aligned_prices[ticker] = {entry['lastUpdatedAt']: entry['price'] for entry in data}

    timestamps = set(aligned_prices[tickers[0]].keys()) & set(aligned_prices[tickers[1]].keys())
    if len(timestamps) < 3:
        return jsonify({"error": "Insufficient overlapping data points for correlation."}), 400

    prices_1 = [aligned_prices[tickers[0]][ts] for ts in sorted(timestamps)]
    prices_2 = [aligned_prices[tickers[1]][ts] for ts in sorted(timestamps)]

    correlation = float(np.corrcoef(prices_1, prices_2)[0, 1])

    def compute_avg(prices):
        return sum(prices) / len(prices) if prices else 0

    result = {
        "correlation": round(correlation, 4),
        "stocks": {
            tickers[0]: {
                "averagePrice": compute_avg(prices_1),
                "priceHistory": stock_data[tickers[0]]
            },
            tickers[1]: {
                "averagePrice": compute_avg(prices_2),
                "priceHistory": stock_data[tickers[1]]
            }
        }
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
