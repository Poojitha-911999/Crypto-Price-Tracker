import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const UNISWAP_GRAPH_API = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const App = () => {
  const [topTokens, setTopTokens] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTokens = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching top tokens:', error);
        setError(error.message);
      }
    };
    fetchTopTokens();
  }, []);

  return (
    <div className="App">
      <h1>Top Tokens by 24-Hour Trading Volume</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
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
                <td>{parseFloat(token.volumeUSD).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
