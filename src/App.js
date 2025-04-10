import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 调用后端搜索接口
  const handleSearch = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/search?keyword=${encodeURIComponent(keyword)}`);
      setResult(res.data);
      fetchHistory(); // 搜完刷新历史
    } catch (err) {
      console.error('搜索失败:', err);
    }
    setLoading(false);
  };

  // 获取历史记录
  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/search/history');
      setHistory(res.data);
    } catch (err) {
      console.error('历史记录获取失败:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1> GitHub code summary generator</h1>
      <div className="search-box">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Input keyword or code e.g.: quick sort"
        />
        <button onClick={handleSearch}> Search and Generate</button>
      </div>

      {loading && <p>loading...</p>}



      {result && (
        <div className="result">
          <h3> Keyword：{result.keyword}</h3>
          <p><strong>Code path: </strong> <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a></p>

          <p><strong>Original code: </strong></p>
          <pre>{result.code}</pre>

          <p><strong>Generated Summary</strong></p>
          <pre>{result.explanation}</pre>

          {result.topResults && result.topResults.length > 0 && (
            <div className="top-results">
              <h4>📂 GitHub top 10 search result: </h4>
              <ul>
                {result.topResults.map((item, index) => (
                  <li key={index}>
                    <a href={item.html_url} target="_blank" rel="noreferrer">
                      [{item.repository}] {item.path}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}


      <div className="history">
        <h2>📜 Search History</h2>
        {history.map((item) => (
          <div className="history-item" key={item.id}>
            <strong>{item.keyword}</strong>({new Date(item.timestamp).toLocaleString()})
            <details>
              <summary>Display</summary>
              <pre>{item.codeSnippet}</pre>
              <pre>{item.explanation}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;