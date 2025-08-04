import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>测试页面 - 这里应该显示内容</h1>
      <p>如果您看到这个内容，说明React组件正在正常渲染。</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;