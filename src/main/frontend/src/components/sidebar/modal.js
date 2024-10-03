/*

import './modal.css';
import image1 from '../../sample1.png';
import image2 from '../../sample2.png';
import image3 from '../../sample3.jpg';
import image4 from '../../sample4.jpg';
import image5 from '../../sample5.png';


export default function Modal({ onClose, setCurrentImage }) {
    

    
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl); 
        onClose(); 
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImage(reader.result); 
                onClose();
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

*/

import './modal.css';
import image1 from '../../sample1.png';
import image2 from '../../sample2.png';
import image3 from '../../sample3.jpg';
import image4 from '../../sample4.jpg';
import image5 from '../../sample5.png';

export default function Modal({onClose, setCurrentImage}) {
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl); // 로컬 스토리지에 저장
        onClose();
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImage(reader.result);
                localStorage.setItem('profileImage', reader.result); // 로컬 스토리지에 저장
                onClose();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modal-box" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>프로필 변경
                    <button className="close-btn" onClick={onClose}>X</button>
                </h2>
                <div className="sample-image">
                    <img src={image1} alt="Sample 1" onClick={() => handleImageClick(image1)}/>
                    <img src={image2} alt="Sample 2" onClick={() => handleImageClick(image2)}/>
                    <img src={image3} alt="Sample 3" onClick={() => handleImageClick(image3)}/>
                    <img src={image4} alt="Sample 4" onClick={() => handleImageClick(image4)}/>
                    <img src={image5} alt="Sample 5" onClick={() => handleImageClick(image5)}/>
                    <label htmlFor="file-upload" className="upload-label">
                        +
                        <input id="file-upload" type="file" accept="image/*" onChange={handleImageSelect}/>
                    </label>
                </div>
            </div>
        </div>
    );
}
