
export default function SortSelect ({onSortChange}: {onSortChange: (value: string)=>void}) {
    const sortChange = (value: string) => {
        onSortChange(value);
    }
    return(
        <>
        <form action="GET" >
        <select onChange={(e)=>sortChange(e.target.value)}>
            <option  value="id&_order=desc">新着順</option>
            <option value="twoDaysPrice&_order=desc">価格が高い順</option>
            <option value="twoDaysPrice&_order=asc">価格が安い順</option>
        </select>
        </form>
        </>
    )
}
