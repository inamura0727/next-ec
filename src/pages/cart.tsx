import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import useSWR, { useSWRConfig } from 'swr';
import { UserCart } from 'types/user';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { User } from 'types/user';

const fetcher = (resource: string) =>
  fetch(resource).then((res) => res.json());

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const isLoggedIn = req.session.isLoggedIn;
    let cart = req.session.cart;
    console.log(cart)
    if (!cart) {
      cart = [];
      console.log('hoge')
    }
    // console.log(req);

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

  // 多分原因はここかな〜
  console.log(user.userCarts);

  const { data, error } = useSWR(`/api/users/?id=${id}`, fetcher);
  if (error) return <div>Failed to load</div>;
  
  if (!data) return <div>Loading</div>;

  let items
  if(isLoggedIn){
  items = data.userCarts;
  }else{
    items = user.userCarts
  }
  // console.log(items);

  return (
    <>
      {items?.map((item: UserCart) => {
        return (
          <div className="cart-content" key={item.id}>
            <div className="cart-media">
              <div className="cart-inner">
                <figure className="cart-img-wrapper">
                  <div key={item.id}>
                    <Image
                      className="cart-img"
                      src={item.itemImage}
                      width={200}
                      height={150}
                      alt="商品の画像"
                    />
                    <p>{item.itemName}</p>
                    <p>{item.price}</p>
                  </div>
                </figure>
                <div className="cart-body">
                  <div className="cart-title">
                    <p className="cart-artists"></p>
                    <p className="cart-period">レンタル期間</p>
                    <Link href="" legacyBehavior>
                      <a>詳細ページへ</a>
                    </Link>
                  </div>
                  <p className="cart-price"></p>
                </div>
              </div>
              <div className="cart-btn-wrapper">
                <button className="cart-before-btn">削除</button>
              </div>
            </div>
            <button>
              {isLoggedIn ? '決済へ進む' : 'ログインしてくだい'}
            </button>
            <style jsx>
              {`
                .cart-content {
                  max-width: 1230px;
                  padding: 15px;
                  margin: 0 auto;
                }
                .cart-media {
                  border: 1px solid #333;
                  padding: 10px;
                }
                .cart-img {
                  width: 100%;
                }
                .cart-inner {
                  display: flex;
                  align-items: center;
                }
                .cart-btn-wrapper {
                  text-align: right;
                }
                .cart-before-btn {
                  padding: 5px 10px;
                  border: 1px solid #333;
                  border-radius: 10px;
                }
              `}
            </style>
          </div>
        );
      })}
    </>
  );
}
