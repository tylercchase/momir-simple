import "./index.css";

export function App() {
    // also print card?
    async function getCard(cmc: number) {
        const res = await fetch(`/api/creature/${cmc}`);

        const data = await res.json();
        console.log(data);
        // theoretically there can be an empty card
    }
    return (
        <div className="app">
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
