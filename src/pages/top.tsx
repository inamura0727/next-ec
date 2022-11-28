import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/top.module.css";
import ItemList from "components/ItemList";

export default function Top ({items}: {items: Array<Item>}) {
    return(
        <>
        <Head>
            <title>トップページ - Festal</title>
        </Head>
        <ItemList items={items}/>
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
