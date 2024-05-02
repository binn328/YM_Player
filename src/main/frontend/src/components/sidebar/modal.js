import './modal.css';
import image1 from '../../sample1.png';
import image2 from '../../sample2.png';
import image3 from '../../sample3.jpg';
import image4 from '../../sample4.jpg';
import image5 from '../../sample5.png';


export default function Modal({ onClose, setCurrentImage }) {
    

    // 이미지 선택 시
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl); // 선택된 이미지를 현재 이미지로 설정
        onClose(); // 모달 닫기
    };

    // 이미지 파일 선택 시
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImage(reader.result); // 선택된 이미지를 현재 이미지로 설정
                onClose(); // 모달 닫기
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>프로필 변경
                <button className="close-btn" onClick={onClose}>X</button>
                
                </h2>
               
                <div className="sample-image">
                   
                    <img src={image1} alt="Sample 1" onClick={() => handleImageClick(image1)} />
                    <img src={image2} alt="Sample 2" onClick={() => handleImageClick(image2)} />
                    <img src={image3} alt="Sample 3" onClick={() => handleImageClick(image3)} />
                    <img src={image4} alt="Sample 4" onClick={() => handleImageClick(image4)} />
                    <img src={image5} alt="Sample 5" onClick={() => handleImageClick(image5)} />
                   
                    <label htmlFor="file-upload" className="upload-label">
                        +
                        <input id="file-upload" type="file" accept="image/*" onChange={handleImageSelect} />
                    </label>
                </div>
              
               
            </div>
        </div>
    );
}
