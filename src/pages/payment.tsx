import { GetServerSideProps } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { UserCart, User } from '../types/user';
import Image from 'next/image';
import styles from '../styles/payment.module.css';
import Head from 'next/head';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type stripeError = string | string[] | undefined;

export const getServerSideProps: GetServerSideProps =
  withIronSessionSsr(async function getServerSideProps({
    req,
    query,
  }) {
    let error: stripeError = '';
    // カート情報の取得
    const user = req.session.user;
    if (user !== undefined) {
      const result = await fetch(
        `http://localhost:3000/api/users/${user.id}`
      );
      const userData = await result.json();
      const cart: UserCart[] = userData.userCarts;
      // ID昇順
      cart.sort((a, b) => {
        return a.id - b.id;
      });

      // エラー時の処理
      if (query.error) {
        error = query.error;
      }

      return {
        props: {
          cart: cart,
          error: error,
        },
      };
    } else {
      return {
        props: {
          cart: [],
          error: error,
        },
      };
    }
  },
  ironOptions);

export default function Payment({
  cart,
  error,
}: {
  cart: UserCart[];
  error: stripeError;
}) {
  // 合計金額
  const sum = cart
    .map((item) => item.price)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

  return (
    <>
      <Head>
        <title>決済画面</title>
      </Head>
      <main className={styles.paymentMain}>
        {error && (
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
          {cart.map((item: UserCart) => (
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
          <div>合計:{cart.length}点</div>
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
