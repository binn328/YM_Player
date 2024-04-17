import React, { useState } from 'react';

function App() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>My Music App</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {files.map((file, index) => (
          <div key={index} style={{ margin: '10px' }}>
            <audio controls style={{ width: '200px' }}>
              <source src={URL.createObjectURL(file)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p style={{ marginTop: '10px' }}>File {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;