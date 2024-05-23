//음악 편집 아직 안됨
import React, { useState } from 'react';

function EditMusicForm({ music, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: music.id,
    title: music.title,
    artist: music.artist,
    group: music.group,
    favorite: music.favorite,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // 수정된 데이터를 onSave 콜백으로 전달
  };

  return (
    <div className="edit-music-form">
      <h2>Edit Music Info</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Artist</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Group</label>
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Favorite</label>
          <input
            type="checkbox"
            name="favorite"
            checked={formData.favorite}
            onChange={handleCheckboxChange}
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditMusicForm;