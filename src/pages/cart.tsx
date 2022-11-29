import Image from 'next/image';
import Link from 'next/link';
import useSWR, { useSWRConfig } from 'swr';
import { UserCart } from 'types/user';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { User } from 'types/user';
import styles from 'styles/cart.module.css';
import DeleteBtn from '../../components/Deleteitem';

const fetcher = (resource: string) =>
  fetch(resource).then((res) => res.json());

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    let cart = req.session.cart;

    if (!cart) {
      cart = [];
    }

    if (user === undefined) {
      return {
        props: {
          user: {
            id: 0,
            userName: 'ゲスト',
            userCarts: cart,
          },
          isLoggedIn: false,
        },
      };
    }
    return {
      props: {
        user: req.session.user,
        isLoggedIn: true,
      },
    };
  },
  ironOptions
);

export default function CartList({
  user,
  isLoggedIn,
}: {
  user: User;
  isLoggedIn: boolean;
}) {
  // ユーザーのidを取得予定
  const id = user.id;

  console.log(user.userCarts);
  const { data, error } = useSWR(`/api/users/${id}`, fetcher);
  if (error) return <div>Failed to load</div>;

  if (!data) return <div>Loading</div>;

  let items;
  if (isLoggedIn) {
    items = data.userCarts;
  } else {
    items = user.userCarts;
  }

  return (
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
                    <Link
                      href={`/ItemDetail?id=${item.id}`}
                      legacyBehavior
                    >
                      <a>詳細ページへ</a>
                    </Link>
                  </div>
                </div>
                <div className={styles.cartPriceWrapper}>
                  <p className={styles.cartPrice}>￥{item.price}</p>
                </div>
              </div>
              <DeleteBtn id={id} itemId={item.id} />
            </div>
          </div>
        );
      })}
      <div className={styles.btnWrapper}>
        {isLoggedIn ? (
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
  );
}
