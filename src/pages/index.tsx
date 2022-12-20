import Head from 'next/head';
import { Item } from 'types/item';
import Header from '../components/Header';
import ItemList from 'components/ItemList';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import RecommendItemList from 'components/RecommendItemList';
import loadStyles from 'styles/loading.module.css';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
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

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
    // ユーザー情報の取得
    let user: SessionUser = {
      isLoggedIn: false,
    };
    // ログインしている場合、favoriteIdを取得する
    if (req.session.user) {
      const result = await prisma.user.findUnique({
        where: {
          userId: req.session.user.id,
        }
      });
      let favoriteId = 3
      if(result){
        favoriteId = result.favoriteId
      }
      user.userId = req.session.user.id;
      user.favoriteGenre = favoriteId;
      user.isLoggedIn = true;
    };

      // 新着作品取得
  const res = await fetch('http://localhost:3000/api/selectNewItem')
  const newItems = await res.json();

  // ジャンル別作品取得
  const body = { categoriesId: user.favoriteGenre };
  const result = await fetch('http://localhost:3000/api/selectGenre', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const genreItems = await result.json();

  return {
    props: {
      newItems,
      genreItems,
    },
  };
  }, ironOptions)
