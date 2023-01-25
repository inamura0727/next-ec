import Head from 'next/head';
import { Item } from 'types/item';
import Header from '../components/Header';
import ItemList from 'components/ItemList';
import UseSWR, { mutate } from 'swr';
import RecommendItemList from 'components/RecommendItemList';
import loadStyles from 'styles/loading.module.css';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import prisma from '../../lib/prisma';
import { useState } from 'react';
import { SessionUser } from './api/getSessionInfo';
import PreTop from './api/preRendering/PreTop';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Top({
  newItems,
  genreItems,
  useChatbot,
  userName,
}: {
  newItems: Array<Item>;
  genreItems: Array<Item>;
  useChatbot: boolean;
  userName: string;
}) {
  let [doLogout, setLogout] = useState(false);
  const logout = () => {
    setLogout(true);
    mutate('/api/getSessionInfo');
  };

  const { data } = UseSWR<SessionUser>(
    '/api/getSessionInfo',
    fetcher
  );
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
        dologout={() => logout()}
      />
      <ItemList items={newItems} />
      <RecommendItemList
        items={genreItems}
        user={data}
        useChatbot={useChatbot}
        doLogout={doLogout}
        userName={userName}
      />
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const take = 10;
    // ユーザー情報の取得
    let user: SessionUser = {
      isLoggedIn: false,
    };
    let favoriteId = 3;
    let userName = 'guest';
    let useChatbot = false;
    // ログインしている場合、favoriteIdを取得する
    if (req.session.user) {
      const result = await prisma.user.findUnique({
        where: {
          userId: req.session.user.userId,
        },
      });
      if (result?.favoriteId) {
        favoriteId = result.favoriteId;
        useChatbot = true;
      }
      if (result?.userName) {
        userName = result.userName;
      }
      user.userId = req.session.user.userId;
      user.isLoggedIn = true;
    }

    // 作品情報取得
    const { newItems, genreItems } = await PreTop(take, favoriteId);

    return {
      props: {
        newItems,
        genreItems,
        favoriteId,
        useChatbot,
        userName,
      },
    };
  },
  ironOptions
);
