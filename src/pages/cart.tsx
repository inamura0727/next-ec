import Image from 'next/image';
import Link from 'next/link';
import { UserCart } from 'types/user';
import styles from 'styles/cart.module.css';
import DeleteBtn from '../components/DeleteItem';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';
import Head from 'next/head';
import loadStyles from 'styles/loading.module.css';
import { Item } from 'types/item';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CartList() {
  const { data } = UseSWR('/api/selectCart', fetcher);
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

  // ユーザーのidを取得予定
  const id = data.userId;
  // ユーザーのカート情報を取得
  let carts = data.userCarts;
  console.log(data);

  if (!carts) {
    return {
      redirect: {
        destination: '/error',
      },
    };
  }
  const cartItems = carts.map(
    (item: {
      items: { cartId: number; rentalPeriod: number };
      cartId: number;
      rentalPeriod: number;
    }) => {
      item.items.cartId = item.cartId;
      item.items.rentalPeriod = item.rentalPeriod;
      return item.items;
    }
  );
  // console.log(cartItems);

  let isCartflg = true;
  if (!cartItems?.length) {
    isCartflg = false;
  }

  // 合計金額の表示
  let sum: number[] = [];
  if (cartItems !== undefined) {
    cartItems.map(
      (item: {
        rentalPeriod: number;
        twoDaysPrice: number;
        sevenDaysPrice: number;
      }) => {
        if (item.rentalPeriod === 2) {
          sum.push(item.twoDaysPrice);
        } else if (item.rentalPeriod === 7) {
          sum.push(item.sevenDaysPrice);
        }
      }
    );
  }

  let total;
  if (!sum.length) {
    total = 0;
  } else {
    total = sum.reduce((accu, curr) => accu + curr);
  }

  type cartItem = {
    itemId: number;
    fesName: string;
    artist: string;
    itemDetail: string;
    itemImage: string;
    // 形式: yyyy-MM-dd
    releaseDate: Date | string;
    // 単位：分
    playTime: number;
    twoDaysPrice: number;
    sevenDaysPrice: number;
    rentalPeriod: number;
    cartId: number;
  };

  return (
    <>
      <Head>
        <title>カート</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/selectCart')}
      />

      <main className={styles.cart}>
        {cartItems?.map((item: cartItem) => {
          return (
            <div className={styles.cartContent} key={item.itemId}>
              <div className={styles.cartMedia}>
                <div className={styles.cartInner}>
                  <div className={styles.cartBodyWrapper}>
                    <figure className={styles.cartImgWrapper}>
                      <Image
                        className={styles.cartImg}
                        src={item.itemImage}
                        width={200}
                        height={112}
                        alt="商品の画像"
                        priority
                      />
                    </figure>
                    <div className={styles.cartBody}>
                      <p className={styles.cartTitle}>
                        {`${item.artist}  ${item.fesName}`}
                      </p>
                      <p>
                        レンタル期間：
                        {item.rentalPeriod === 2 ? '48時間' : '7泊'}
                      </p>
                      <Link
                        href={`/items/${item.itemId}`}
                        legacyBehavior
                      >
                        <a>詳細ページへ</a>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.cartPriceWrapper}>
                    <p>価格</p>
                    {item.rentalPeriod === 2 ? (
                      <p className={styles.cartPrice}>
                        {item.twoDaysPrice}円
                      </p>
                    ) : (
                      <p className={styles.cartPrice}>
                        {item.sevenDaysPrice}円
                      </p>
                    )}
                    <DeleteBtn
                      id={id}
                      cartId={item.cartId}
                      rebuild={() => mutate('/api/selectCart')}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!isCartflg && (
          <p className={styles.isCartFlg}>カートの中身はありません</p>
        )}
        <div className={styles.btnWrapper}>
          <div className={styles.totalPrice}>
            <p>合計金額{total}円</p>
          </div>
          {!isCartflg ? (
            <Link href="/search?categories_like=&q=">
              <button
                className={`${styles.cartBtn} ${styles.bgleft}`}
              >
                <span>商品を探す</span>
              </button>
            </Link>
          ) : (
            <>
              {data.isLoggedIn ? (
                <Link href="/payment">
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>決済へ進む</span>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <p>※決済に進むにはログインが必要です</p>
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>ログインしてください</span>
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
        <style jsx>
          {`
            p {
              margin-block-start: 0;
              margin-block-end: 0;
            }
          `}
        </style>
      </main>
    </>
  );
}
