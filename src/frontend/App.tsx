import { useState } from "react";
import "./index.css";
import {CostButton} from './cost-button';

enum STATUS {
    DONE,
    PENDING,
    ERROR,
}

interface CardStatus {
    [cmc: number]: string[]
}

export function App() {
    let [error, setError] = useState('');
    let [status, setStatus] = useState(STATUS.DONE);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    function showError(err: string) {
        setError(err);
        setStatus(STATUS.ERROR);
        setTimeout(() => {
            setError('');
        }, 2000)
    }

    async function getCard(cmc: number) {
        try {
            setStatus(STATUS.PENDING);
            const res = await fetch(`/api/creature/${cmc}`).catch(err => setError('Trouble loading card'));

            const data = await res?.json();


            console.log(data);
            if(data?.error) {
                console.log('don\'t print');
                showError(`No creature available for: ${cmc}`)
            } else if (data) {
                // await sleep(2000)
                fetch("/api/print", {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(res => res.json()).then(res => {
                    console.log(res);
                    if(res?.error) {
                        showError(res.error);
                    } else {
                        setStatus(STATUS.DONE)
                    }
                }).catch(_err => {
                    showError('Trouble printing card, is the printer connected?');
                })
            }
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="app">
            <div className="error">{error}</div>
            { status === STATUS.PENDING && 
                <div className="loading">
                    <span className="loader"></span>
                </div>
            }
            
            <div className="buttons">
                {[
                    ...Array(16)
                        .keys()
                        .map((x) => x + 1),
                ].map((i) => (
                    <CostButton
                    key={i} onClick={() => getCard(i)} disabled={status === STATUS.PENDING} cmc={i}
                    ></CostButton>
                ))}
            </div>
        </div>
    );
}

export default App;
