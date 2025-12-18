import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import GebcoMap from './pages/GebcoMap';
import EtopoMap from './pages/EtopoMap';
import LayerManagerPage from './pages/LayerManagerPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/gebco" replace />} />
                    <Route path="gebco" element={<GebcoMap />} />
                    <Route path="etopo" element={<EtopoMap />} />
                    <Route path="layers" element={<LayerManagerPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
