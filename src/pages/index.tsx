import Head from 'next/head';
import { Item } from 'types/item';
import Header from '../components/Header';
import ItemList from 'components/ItemList';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import RecommendItemList from 'components/RecommendItemList';
import loadStyles from 'styles/loading.module.css';
import {config} from '../config/index';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Top({ items }: { items: Array<Item> }) {
  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>トップページ - Festal</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
      <ItemList items={items} />
      <RecommendItemList items={items} data={data} />
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(config.items);
  const items = await res.json();
  return {
    props: {
      items,
    },
  };
}
