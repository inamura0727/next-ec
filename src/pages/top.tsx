import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/top.module.css";

export default function Top ({items}: {items: Array<Item>}) {
    return(
        <>
        <Head>
            <title>トップページ - Festal</title>
        </Head>
        <main>
        <p>新着作品</p>
        {/* 今はdb.jsonにあるすべての作品が表示されます */}
        <section className={styles.itemList}>
        {items.map((item)=>{
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
        <p>カテゴリ：バンド</p>
        <section className={styles.itemList}>
        {/* 仮でcategoryId=4 バンドで絞っています */}
        {items.filter((item)=>{for(let category of item.categories){if(category === 4) return item}})
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
        </main>
        </>
    )
}

export async function getServerSideProps() {
    const res = await fetch('http://localhost:3000/api/items')
    const items = await res.json()
    return {
        props: {
            items
        }
    }
}
