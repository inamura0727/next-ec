import Head from 'next/head';
import { Item } from 'types/item';
import Header from '../components/Header';
import ItemList from 'components/ItemList';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import RecommendItemList from 'components/RecommendItemList';
import loadStyles from 'styles/loading.module.css';
import { config } from '../config/index';
import prisma from '../../lib/prisma';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Top({
  newItems,
  genreItems,
}: {
  newItems: Array<Item>;
  genreItems: Array<Item>;
}) {
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
      <ItemList items={newItems} />
      <RecommendItemList items={genreItems} data={data} />
    </>
  );
}

export async function getServerSideProps() {
  // 新着アイテムの取得
  const res = await prisma.item.findMany({
    orderBy: {
      releaseDate: 'desc',
    },
    take: 10,
  });
  const newItems = res.map((item) => ({
    ...item,
    releaseDate: item.releaseDate.toString(),
  }));

  //邦ロックの取得
  const response = await prisma.item.findMany({
    where: {
      categories: {
        has: 3,
      },
    },
    orderBy: {
      releaseDate: 'desc',
    },
    take: 10,
  });
  console.log(response);

  const genreItems = response.map((item) => ({
    ...item,
    releaseDate: item.releaseDate.toString(),
  }));

  return {
    props: {
      newItems,
      genreItems,
    },
  };
}
