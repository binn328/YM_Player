//업로드 인덱스
import React, { useState } from 'react';
import './musicupload.css';

function MusicForm() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [group, setGroup] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!title || !artist || !group || !file) && !link) {
      alert('제목, 가수, 그룹, 파일을 모두 입력하거나 링크를 입력하세요.');
      return;
    }

    try {
      const formData = new FormData();
      if (link) {
        const dlResponse = await fetch(`http://localhost:8080/api/dl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link })
        });

        if (!dlResponse.ok) {
          const errorDetails = await dlResponse.text();
          throw new Error(`링크를 통해 파일을 변환하는데 실패했습니다: ${errorDetails}`);
        }

        const dlData = await dlResponse.json();
        // Assuming the API returns a URL or file content
        const fileResponse = await fetch(dlData.fileUrl); // Adjust based on actual response
        const blob = await fileResponse.blob();
        formData.append('file', blob, 'downloaded_music.mp3');
      } else {
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('group', group);
        formData.append('file', file);
      }
      formData.append('favorite', 'false');

      const response = await fetch('http://localhost:8080/api/music', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('음악 업로드에 실패했습니다.');
      }

      console.log('음악 업로드 성공');

      // Reset
      setTitle('');
      setArtist('');
      setGroup('');
      setFile(null);
      setLink('');
    } catch (error) {
      console.error('음악 업로드 중 에러 발생:', error);
    }
  };

  return (
    <div className="screen-container">
      <div className='container'>
        <div className='form-box'>
          <h1>음악 업로드</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="music-form">
            <div className="form-group">
              <label>제목</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required={!link} />
            </div>
            <div className="form-group">
              <label>가수</label>
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required={!link} />
            </div>
            <div className="form-group">
              <label>그룹</label>
              <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} required={!link} />
            </div>
            <div className="form-group">
              <label>파일</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required={!link} />
            </div>
            <div className="form-group">
              <label>링크</label>
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required={!(title && artist && group && file)} />
            </div>
            <br />
            <input type="hidden" name="favorite" value="false" />
            <button type="submit">확인</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MusicForm;
