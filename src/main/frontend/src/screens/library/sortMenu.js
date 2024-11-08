// sortMenu.js
import React, { useState } from 'react';

const SortMenu = ({ setSortMethod }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sortOption) => {
    setSortMethod(sortOption);
    setIsOpen(false); // 정렬 선택 후 드롭다운 닫기
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sort-menu">
      <button onClick={toggleDropdown} className="sort-button">정렬 ▼</button>
      {isOpen && (
        <div className="sort-options">
          <p onClick={() => handleSortChange("upload")}>업로드순</p>
          <p onClick={() => handleSortChange("title")}>제목순</p>
          <p onClick={() => handleSortChange("favorite")}>하트순</p>
        </div>
      )}
    </div>
  );
};

export default SortMenu;
