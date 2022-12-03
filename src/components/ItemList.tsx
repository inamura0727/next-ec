import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/top.module.css";

export default function ItemList ({items}: {items: Array<Item>}) {
    return(
        <main>
        <p>新着作品</p>
        <section className={styles.itemList}>
        {items.slice(0, 10).map((item)=>{
            return(
                <div key={item.id} className={styles.item}>
                <Link href={`/items/${item.id}`}>
                <Image src={item.itemImage} width={200} height={112.5} alt={item.artist} />
                <br />
                <div>{item.artist}</div>
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
