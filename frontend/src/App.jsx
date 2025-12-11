import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import GebcoMap from './pages/GebcoMap';
import EtopoMap from './pages/EtopoMap';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* 루트 경로는 /gebco로 리다이렉트 */}
                    <Route index element={<Navigate to="/gebco" replace />} />
                    {/* 자식 라우트들 */}
                    <Route path="gebco" element={<GebcoMap />} />
                    <Route path="etopo" element={<EtopoMap />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
