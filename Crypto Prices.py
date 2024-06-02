import requests
import pandas as pd
from datetime import datetime, timedelta

cryptos = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'solana']


base_url = 'https://api.coingecko.com/api/v3'

def fetch_current_prices(cryptos):
    ids = ','.join(cryptos)
    url = f'{base_url}/simple/price?ids={ids}&vs_currencies=usd'
    response = requests.get(url)
    return response.json()

def fetch_historical_data(crypto, days):
    url = f'{base_url}/coins/{crypto}/market_chart?vs_currency=usd&days={days}'
    response = requests.get(url)
    data = response.json()
    return data['prices']

def save_historical_data(crypto, data, days):
    df = pd.DataFrame(data, columns=['timestamp', 'price'])
    df['date'] = pd.to_datetime(df['timestamp'], unit='ms')
    df = df[['date', 'price']]
    df.to_csv(f'{crypto}_last_{days}_days.csv', index=False)


current_prices = fetch_current_prices(cryptos)
print(current_prices)


for crypto in cryptos:
    for days in [7, 30, 365, 'max']:
        data = fetch_historical_data(crypto, days)
        save_historical_data(crypto, data, days)
