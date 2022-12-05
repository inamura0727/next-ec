import styles from "styles/search.module.css";

type Props = {
        totalCount: number;
        pageSize: number;
        onClick: (index: number) => void;
        currentPage: number;
    }

const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);

export default function Pagination ({ totalCount, pageSize, onClick, currentPage }: Props){
    return(
        <div className={styles.paging}>
        {range(1, Math.ceil(totalCount / pageSize)).map((number, index) => (
            <button
                className={styles.pagingBtn}
                key ={index}
                onClick={()=>onClick(number)}>
                {number}
            </button>
        ))}
        </div>
    )
}
