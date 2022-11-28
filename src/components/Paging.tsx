type Props = {
        totalCount: number;
        pageSize: number;
        onClick: (index: number) => void;
        currentPage: number;
    }

const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);

export default function Pagination ({ totalCount, pageSize, onClick, currentPage }: Props){
    return(
        <>
        {range(1, Math.ceil(totalCount / pageSize)).map((number, index) => (
            <button
                key ={index}
                onClick={()=>onClick(number)}>
                {number}
            </button>
        ))}
        </>
    )
}
