import {useEffect, useState} from "react";

function App() {

    const [health, setHealth] = useState('loading...');

    useEffect(() => {
        fetch('http://localhost:8080/api/health')
            .then((res) => res.text())
            .then((text) => setHealth(text))
            .catch((err) => {
                console.error(err);
                setHealth('error');
            });
    }, []);

    return (
        <div>
            <header>
                <h1>Ocean Map Frontend</h1>
            </header>
            <main>
                <p>지도</p>
            </main>
        </div>
    );
}

export default App;