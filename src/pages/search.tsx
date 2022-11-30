import Head from "next/head";
import { Item } from "types/item";
import Header from "../components/Header";
import SearchForm from "components/SearchForm";
import ItemList from "components/ItemList";
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Search ({items}: {items: Array<Item>}) {
    const { data } = UseSWR<SessionUser>('/api/getUser',fetcher);
    if(!data) return <div>Loading</div>
    return (
        <>
        <Head>
            <title>作品検索</title>
        </Head>
        <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')}/>
        <SearchForm />
        <ItemList items={items} />
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
