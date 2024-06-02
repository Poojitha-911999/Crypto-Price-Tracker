import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const UNISWAP_GRAPH_API = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const App = () => {
  const [cryptos, setCryptos] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [filter, setFilter] = useState('7');
  const cryptoList = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'solana'];

  useEffect(() => {
    const fetchPrices = async () => {
      const responses = await Promise.all(
        cryptoList.map(crypto => axios.get(`/path/to/your/csv/files/${crypto}_last_${filter}_days.csv`))
      );
      setCryptos(responses.map(response => response.data));
    };
    fetchPrices();
  }, [filter]);

  useEffect(() => {
    const fetchTopTokens = async () => {
      const query = `
        {
          tokens(orderBy: volumeUSD, orderDirection: desc, first: 5) {
            id
            symbol
            name
            volumeUSD
          }
        }
      `;
      const response = await axios.post(UNISWAP_GRAPH_API, { query });
      setTopTokens(response.data.data.tokens);
    };
    fetchTopTokens();
  }, []);

  return (
    <div className="App">
      <h1>Crypto Price Tracker</h1>
      <div>
        <button onClick={() => setFilter('7')}>7 Days</button>
        <button onClick={() => setFilter('30')}>30 Days</button>
        <button onClick={() => setFilter('365')}>1 Year</button>
        <button onClick={() => setFilter('max')}>All</button>
      </div>
      <div>
        {cryptos.map((crypto, index) => (
          <div key={index}>
            <h2>{cryptoList[index]}</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {crypto.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <h2>Top Tokens by 24-Hour Trading Volume</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Volume (USD)</th>
          </tr>
        </thead>
        <tbody>
          {topTokens.map((token, index) => (
            <tr key={index}>
              <td>{token.symbol}</td>
              <td>{token.name}</td>
              <td>{token.volumeUSD}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
