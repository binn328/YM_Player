import { Routes, Route } from "react-router-dom";

function MyRoutes() {
    return (
        <Routes>
            <Route path="/music" element={<div>뮤직</div>} />
            <Route path="/playlist" element={<div>재생목록</div>} />
            <Route path="/album" element={<div>앨범</div>} />
            <Route path="/download" element={<div>다운로드</div>} />
        </Routes>
    );
}
export default MyRoutes;
