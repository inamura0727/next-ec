import Head from "next/head";
import SearchForm from "components/SearchForm";
import ItemList from "components/ItemList";
import { Item } from "types/item";

export default function Search ({items}: {items: Array<Item>}) {
    return (
        <>
        <Head>
            <title>作品検索</title>
        </Head>
        <SearchForm />
        <ItemList items={items} />
        </>
    )
}

export async function getStaticProps() {
    const res = await fetch('http://localhost:3000/api/items')
    const items = await res.json()
    return {
        props: {
            items
        }
    }
}
