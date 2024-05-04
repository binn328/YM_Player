import React, { useState } from 'react';
import './musicupload.css';

function MusicForm() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [group, setGroup] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('group', group);
      formData.append('file', file);
      formData.append('favorite', 'false');

      const response = await fetch('http://localhost:8080/api/music', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Music uploaded');

      // Reset
      setTitle('');
      setArtist('');
      setGroup('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading music:', error);
    }
  };

  return (
    <div className="screen-container">
      <div className='container'>
        <div className='form-box'>
          <h1>Upload Music</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="music-form">
            <div className="form-group">
              <label>제목</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>가수</label>
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>그룹</label>
              <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>파일</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
            </div>
            <br></br>
            <input type="hidden" name="favorite" value="false" />
            <button type="submit">확인</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MusicForm;