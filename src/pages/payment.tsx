import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { GetServerSideProps } from 'next';
import { UserCart } from '../types/user';
import Image from 'next/image';
import styles from '../styles/payment.module.css';
import Head from 'next/head';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../../components/Header';
import { SessionUser } from 'pages/api/getUser';
import { useRouter } from 'next/router';
import { useState } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const getServerSideProps: GetServerSideProps =
  withIronSessionSsr(async ({ req, query }) => {
    // ユーザー情報の取得
    let user: SessionUser = {
      isLoggedIn: false,
    };
    // ログインしている場合、カート情報を取得する
    if (req.session.user) {
      const result = await fetch(
        `http://localhost:3000/api/users/${req.session.user.id}`
      );
      const userData = await result.json();
      const cart: UserCart[] = userData.userCarts;
      // ID昇順
      cart.sort((a, b) => {
        return a.id - b.id;
      });
      user.userId = req.session.user.id;
      user.userCarts = cart;
      user.isLoggedIn = true;
    }

    // stripeエラー時の判定情報を設定
    const { error } = query;
    let errorflg = '';
    if (error && typeof error === 'string') {
      errorflg = error;
    }
    return {
      props: {
        user: user,
        stripeError: errorflg,
      },
    };
  }, ironOptions);

export default function Payment({
  user,
  stripeError,
}: {
  user: SessionUser;
  stripeError: string;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(user.isLoggedIn);

  // ログインしていない場合は、ログイン画面へ
  if (!isLoggedIn) {
    router.push(`/login`);
  }
  // 合計金額
  const sum = user.userCarts
    ?.map((item) => item.price)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

  return (
    <>
      <Head>
        <title>決済画面</title>
      </Head>
      <Header
        isLoggedIn={isLoggedIn}
        dologout={() => setIsLoggedIn(!isLoggedIn)}
      />
      <main className={styles.paymentMain}>
        {stripeError && (
          <p className={styles.errorMessage}>
            決済処理中にエラーが発生しました。
            <br />
            時間を置いて再度お試しください。
          </p>
        )}
        <h2>決済画面</h2>
        <section className={styles.orderWrapper}>
          <h3>注文内容</h3>
          <h4>ご利用明細</h4>
          {user.userCarts?.map((item: UserCart) => (
            <div className={styles.itemWrapper} key={item.id}>
              <Image
                src={item.itemImage}
                width={200}
                height={150}
                alt={'商品画像のURL'}
              />
              <div className={styles.title}>{item.itemName}</div>
              <div className={styles.rentalPeriod}>
                {item.rentalPeriod}日
              </div>
              <div className={styles.price}>{item.price}円</div>
            </div>
          ))}
          <div>合計:{user.userCarts?.length}点</div>
        </section>

        <form action="/api/checkout_stripe" method="POST">
          <div className={styles.sumPrice}>ご請求金額：{sum}円</div>
          <input type="hidden" name="price" value={sum} />
          <button type="submit">決済する</button>
        </form>
      </main>
    </>
  );
}
