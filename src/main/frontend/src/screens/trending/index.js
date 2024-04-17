import React from 'react';

export default function Trending() {
  return (
    <div className="screen-container">
      <iframe
        title="chart"
        src="https://52hz.kr/all-rank"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
}