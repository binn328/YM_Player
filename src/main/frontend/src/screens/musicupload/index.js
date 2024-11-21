import React, { useState, useEffect } from 'react';
import './musicupload.css';

function MusicForm() {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [group, setGroup] = useState('');
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');
    const [progress, setProgress] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [uploadCompleted, setUploadCompleted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProgress(0);
        setUploadCompleted(false);
        setIsSimulating(false);

        if (!link && !file) {
            alert('제목, 가수, 그룹, 파일을 모두 입력하거나 링크를 입력하세요.');
            return;
        }

        try {
            if (link) {
                alert('링크 변환 요청을 처리 중입니다...');
                setIsSimulating(true);

                const dlResponse = await fetch('/api/dl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: link }),
                });

                if (!dlResponse.ok) {
                    const errorDetails = await dlResponse.text();
                    throw new Error(`링크 변환 실패: ${errorDetails}`);
                }

                console.log('링크 변환 요청 성공');
            } else {
                alert('음악 파일 업로드 요청을 처리 중입니다...');
                const formData = new FormData();

                if (title) formData.append('title', title);
                if (artist) formData.append('artist', artist);
                if (group) formData.append('group', group);
                formData.append('file', file);
                formData.append('favorite', 'false');

                const response = await fetch('/api/music', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`음악 파일 업로드 실패: ${errorText}`);
                }

                console.log('음악 업로드 성공');
                setProgress(100);
                setUploadCompleted(true);
                resetProgressBarAfterDelay();
            }
            setLink('');
        } catch (error) {
            console.error('업로드 중 에러:', error);
        }
    };

    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/dl');
                if (!response.ok) {
                    throw new Error('다운로드 상태 확인 실패');
                }

                let progressData = await response.json();
                console.log('다운로드 상태:', progressData);

                progressData = progressData.filter(
                    (item) => item.status === 'NOT_STARTED' || item.status === 'IN_PROGRESS'
                );

                const inProgress = progressData.some((item) => item.status === 'IN_PROGRESS');

                if (inProgress) {
                    setProgress((prevProgress) => {
                        const nextProgress = prevProgress + 10;
                        return nextProgress > 90 ? 90 : nextProgress;
                    });
                }

                if (progressData.length === 0) {
                    setProgress(100);
                    setUploadCompleted(true);
                    setIsSimulating(false);
                    resetProgressBarAfterDelay();
                }
            } catch (error) {
                console.error('다운로드 상태 확인 에러:', error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isSimulating]);

    const resetProgressBarAfterDelay = () => {
        setTimeout(() => {
            setProgress(0);
            setUploadCompleted(false);
        }, 2000);
    };

    return (
        <div className="screen-container">
            <div className="upload-container">
                <div className="form-box">
                    <h1>Music Upload</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="music-form">

                        <div className="form-group">
                            <label>파일</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                required={!link}
                                disabled={isSimulating}
                            />
                        </div>
                        <div className="form-group">
                            <label>링크</label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="업로드할 링크를 입력하세요."
                                required={!title && !artist && !group && !file}
                                disabled={isSimulating}
                            />
                        </div>
                        <button type="submit" disabled={isSimulating}>
                            {isSimulating ? '업로드 중...' : '확인'}
                        </button>
                    </form>
                </div>
                <div className="progress-container">
                    <h2>업로드 진행률</h2>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        >
                            {progress.toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicForm;
