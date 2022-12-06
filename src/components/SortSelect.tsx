import styles from 'styles/search.module.css'

export default function SortSelect ({onSortChange}: {onSortChange: (value: string)=>void}) {
    const sortChange = (value: string) => {
        onSortChange(value);
    }
    return(
        <>
        <form action="GET" >
        <select  className={styles.sortSelect} onChange={(e)=>sortChange(e.target.value)}>
            <option className={styles.sortSelect} value="id&_order=desc">新着順</option>
            <option className={styles.sortSelect} value="twoDaysPrice&_order=desc">価格が高い順</option>
            <option className={styles.sortSelect} value="twoDaysPrice&_order=asc">価格が安い順</option>
        </select>
        </form>
        </>
    )
}
