
export function CostButton({cmc, onClick, disabled}: {cmc: number, onClick: any, disabled: boolean}) {
    return <button onClick={onClick} disabled={disabled}>
        {cmc}
    </button>
}