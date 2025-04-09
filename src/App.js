// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


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
      <h1>📚 GitHub 代码文档生成器</h1>
      <div className="search-box">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入关键词，例如：quick sort"
        />
        <button onClick={handleSearch}>生成文档</button>
      </div>

      {loading && <p>加载中...</p>}



      {result && (
        <div className="result">
          <h3>🔎 关键词：{result.keyword}</h3>
          <p><strong>代码路径：</strong> <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a></p>

          <p><strong>原始代码：</strong></p>
          <pre>{result.code}</pre>

          <p><strong>文档说明：</strong></p>
          <pre>{result.explanation}</pre>

          {result.topResults && result.topResults.length > 0 && (
            <div className="top-results">
              <h4>📂 GitHub 搜索结果前 10 项：</h4>
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
        <h2>📜 历史记录</h2>
        {history.map((item) => (
          <div className="history-item" key={item.id}>
            <strong>{item.keyword}</strong>({new Date(item.timestamp).toLocaleString()})
            <details>
              <summary>展开查看</summary>
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