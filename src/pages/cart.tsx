import Image from 'next/image';
import Link from 'next/link';
import { UserCart } from 'types/user';
import styles from 'styles/cart.module.css';
import DeleteBtn from '../components/DeleteItem';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CartList() {
  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data) return <div>Loading</div>;
  // ユーザーのidを取得予定
  const id = data.userId;
  // ユーザーのカート情報を取得
  let items = data.userCarts;

  console.log(items)

  // 合計金額の表示
  let sum = 0;
  if (items !== undefined) {
    items.map((item) => {
      sum += item.price;
    });
  }

  return (
    <>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
      <section className="cart">
        {items?.map((item: UserCart) => {
          return (
            <div className={styles.cartContent} key={item.id}>
              <div className={styles.cartMedia}>
                <div className={styles.cartInner}>
                  <div className={styles.cartBodyWrapper}>
                    <figure className={styles.cartImgWrapper}>
                      <Image
                        className={styles.cartImg}
                        src={item.itemImage}
                        width={200}
                        height={112.5}
                        alt="商品の画像"
                      />
                    </figure>
                    <div className={styles.cartBody}>
                      <p className={styles.cartTitle}>
                        {item.itemName}
                      </p>
                      <p className={styles.cartPeriod}>
                        レンタル期間 {item.rentalPeriod}泊
                      </p>
                      <Link href={`/${item.itemId}`} legacyBehavior>
                        <a>詳細ページへ</a>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.cartPriceWrapper}>
                    <p>価格</p>
                    <p className={styles.cartPrice}>￥{item.price}</p>
                  </div>
                </div>
                <DeleteBtn
                  id={id}
                  cartId={item.id}
                  rebuild={() => mutate('/api/getUser')}
                />
              </div>
            </div>
          );
        })}
        <div className={styles.btnWrapper}>
          <div>
            <p>合計金額￥{sum}</p>
          </div>
          {data.isLoggedIn ? (
            <Link href="/payment">
              <button className={styles.cartBtn}>決済へ進む</button>
            </Link>
          ) : (
            <Link href="/login">
              <p>※決済に進むにはログインが必要です</p>
              <button className={styles.cartBtn}>
                ログインしてください
              </button>
            </Link>
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
      </section>
    </>
  );
}
