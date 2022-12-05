import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/itemList.module.css";

export default function ItemList ({items}: {items: Array<Item>}) {
    return(
        <main className={styles.main}>
        <div className={styles.p}>新着作品</div>
        <section className={styles.itemList}>
        {items.slice(0, 10).map((item)=>{
            return(
                <div key={item.id} className={styles.item}>
                <Link href={`/items/${item.id}`}>
                <Image src={item.itemImage} width={200} height={112.5} alt={item.artist} />
                <br />
                <div className={styles.artist}>{item.artist}</div>
                <div>{item.fesName}</div>
                {/* <div>{item.releaseDate}</div> */}
                </Link>
                </div>
            )
        }).reverse()}
        </section>
        </main>
    )
}
