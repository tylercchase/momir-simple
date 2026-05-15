import { useState } from "react";
import "./index.css";

export function App() {
    let [error, setError] = useState('');
    async function getCard(cmc: number) {
        try {
            const res = await fetch(`/api/creature/${cmc}`).catch(err => setError('Trouble loading card'));

            const data = await res?.json();


            console.log(data);
            if(data?.error) {
                console.log('don\'t print');
                setError(`No creature available for: ${cmc}`);
                setTimeout(() => {
                    setError('')
                }, 2000);
            } else if (data) {
                fetch("/api/print", {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(res => res.json()).then(res => {
                    console.log(res);
                    if(res?.error) {
                        setError(res.error);
                        setTimeout(() => {
                            setError('');
                        }, 2000)
                    }
                }).catch(err => setError('Trouble printing card, is the printer connected?'))
            }
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="app">
            <div className="error">{error}</div>
            <div className="buttons">
                {[
                    ...Array(16)
                        .keys()
                        .map((x) => x + 1),
                ].map((i) => (
                    <button key={i} onClick={() => getCard(i)}>
                        {i}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default App;
