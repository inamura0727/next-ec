import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/top.module.css";
import { SessionUser } from "pages/api/getUser";

export default function RecommendItemList ({items, data}: {items: Array<Item>, data: SessionUser}) {
    return(
        <main>
        {!data.favoriteGenre ? (
            <>
             <p>ジャンル:バンド</p>
             <section className={styles.itemList}>
             {/* if文で表示したいカテゴリにフィルター(仮でバンド) */}
             {items.filter((item)=>{for(let category of item.categories){if(category === 4) return item}})
             .slice(0, 10)
             .map((item)=>{
                 return(
                     <div key={item.id} className={styles.item}>
                     <Link href={`/${item.id}`}>
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
            </>
        ): (data.favoriteGenre === 0 ? (
            <>
             <p>ジャンル:バンド</p>
             <section className={styles.itemList}>
             {/* if文で表示したいカテゴリにフィルター(仮でバンド) */}
             {items.filter((item)=>{for(let category of item.categories){if(category === 4) return item}})
             .slice(0, 10)
             .map((item)=>{
                 return(
                     <div key={item.id} className={styles.item}>
                     <Link href={`/${item.id}`}>
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
            </>
        ): (
            <>
            <p>{data.userName}さんへのおすすめ</p>
            <section className={styles.itemList}>
            {/* if文で表示したいカテゴリにフィルター */}
            {items.filter((item)=>{for(let category of item.categories){if(category === data.favoriteGenre) return item}})
            .slice(0, 10)
            .map((item)=>{
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
            </>
            )
        )}
        
        </main>
    )
}
