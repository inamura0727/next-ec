import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/itemList.module.css";
import { SessionUser } from "pages/api/getUser";
import Router from "next/router";

export default function RecommendItemList ({items, data}: {items: Array<Item>, data: SessionUser}) {
    const route = () => {
        Router.push('/chatbot')
    }
    return(
        <main>
        {typeof(data.favoriteGenre) !== 'number' ? (
            <>
             <div className={styles.p}>ジャンル:バンド</div>
             <section className={styles.itemList}>
             {/* if文で表示したいカテゴリにフィルター(仮でバンド) */}
             {items.filter((item)=>{if(item.categories.includes(4)) return item})
             .slice(0, 10)
             .map((item)=>{
                 return(
                     <div key={item.id} className={styles.item}>
                     <Link href={`/items/${item.id}`}>
                     <Image src={item.itemImage} width={200} height={112.5} alt={item.artist} />
                     <br />
                     <div className={styles.artist}>{item.artist}</div>
                     <div>{item.fesName}</div>
                     </Link>
                     </div>
                 )
             }).reverse()}
             </section>
            </>
        ): (data.favoriteGenre === 0 ? (
            <div className={styles.btnWrapper}>
            <button className={styles.chatbotButtonBefore} onClick={route}>やってみよう！チャットボット</button>
            </div>
        ): (
            <>
            <div className={styles.p}>{data.userName}さんへのおすすめ</div>
            <section className={styles.itemList}>
            {/* if文で表示したいカテゴリにフィルター */}
            {items.filter((item)=>{if(data.favoriteGenre){if(item.categories.includes(data.favoriteGenre)) return item}})
            .slice(0, 10)
            .map((item)=>{
                return(
                    <div key={item.id} className={styles.item}>
                    <Link key={item.id} href={`/items/${item.id}`}>
                    <Image src={item.itemImage} width={200} height={112.5} alt={item.artist} />
                    <br />
                    <div className={styles.artist}>{item.artist}</div>
                    <div>{item.fesName}</div>
                    </Link>
                    </div>
                )
            }).reverse()}
            </section>
            <div className={styles.btnWrapper}>
            <button className={styles.chatbotButton} onClick={route}>チャットボット</button>
            </div>
            </>
            )
        )}
        
        </main>
    )
}
