import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Item } from 'types/item';
import { UserCart } from 'types/user';
import { User } from 'types/user';
import { ironOptions } from '../../lib/ironOprion';
import { withIronSessionSsr } from 'iron-session/next';
import styles from 'styles/detail.module.css';
import cart from './api/cart';

// ログイン後の場合、商品のデータ情報とユーザー情報の取得
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    // 商品情報の取得
    const id = query.id;
    const data = await fetch(`http://localhost:3000/api/items/${id}`);
    const items = await data.json();

    // ユーザー情報の取得
    const user = req.session.user;
    console.log(user);
    if (user === undefined) {
      return {
        props: {
          user: {
            id: 0,
            userName: 'ゲスト',
            userCarts: [],
          },
          item: items,
        },
      };
    }
    return {
      props: {
        user: req.session.user,
        item: items,
      },
    };
  },
  ironOptions
);

export default function ItemDetail({
  item,
  user,
}: {
  item: Item;
  user: User;
}) {
  const [price, setPrice] = useState(0);
  const [period, setPeriod] = useState(0);
  const [checked, setChecked] = useState(false);
  const [addToCart, setAddtoCart] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    setPeriod(num);
    if (period === 2) {
      setPrice(item.twoDaysPrice);
    } else {
      setPrice(item.sevenDaysPrice);
    }
  };

  const handleAddtoCart = async (item: Item) => {
    // 　ラジオボタンの判定のチェック(多分できた)
    if (price === 0 && period === 0) {
      setChecked(!checked);
      return;
    }

    // 「カートから削除」が表示されている場合
    if (checked) {
      setChecked(!checked);
    }

    console.log(checked);

    // カートに追加と削除の表示切り替え（多分できた？）
    setAddtoCart(!addToCart);

    // ユーザーidの取得
    const id = user.id;
    console.log(id);

    // ログイン後
    if (id !== 0) {
      const req = await fetch(
        `http://localhost:3000/api/users/${id}`
      );
      const data = await req.json();
      const res = data.userCarts;
      console.log(res);

      let userCarts: UserCart = {
        id: item.id,
        itemName: item.artist + item.fesName,
        // アーティスト名とフェス名の間の空白どうやったら入る？？
        rentalPeriod: period,
        price: price,
        itemImage: item.itemImage,
      };

      res.push(userCarts);
      const body = { userCarts: res };

      // ログイン後　userCartsに追加
      fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('Success', result);
        })
        .catch((error) => {
          console.log('Error', error);
        });
    } else {
      // ログイン前
      let userCarts: UserCart = {
        id: item.id,
        itemName: item.artist + item.fesName,
        rentalPeriod: period,
        price: price,
        itemImage: item.itemImage,
      };

      const body = { cart: userCarts };

      // ログイン前　cookieに保存するために/api/cartに飛ばす
      fetch(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('Success', result);
          if (checked === true) {
            setChecked(!checked);
          }
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };

  const handleDelte = async (item: Item) => {
    const id = user.id;
    // console.log(id)
    const req = await fetch(`http://localhost:3000/api/users/${id}`);
    const data = await req.json();
    const res = data.userCarts;

    console.log(`${res}`);
    const fil = res.filter((cartItem: UserCart) => {
      return cartItem.id !== item.id;
    });

    console.log(fil);
    const body = { userCarts: fil };

    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('Success', result);
        setAddtoCart(!addToCart);
        console.log(addToCart);
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    item: Item
  ) => {
    e.preventDefault();
    addToCart ? handleDelte(item) : handleAddtoCart(item);
  };

  return (
    <section className={styles.detail}>
      <form onSubmit={(e) => handleSubmit(e, item)}>
        <div>
          <div className={styles.detaiContainer}>
            <div className={styles.detailImgWrapper}>
              <Image
                className={styles.detailImg}
                src={item.itemImage}
                alt="画像"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.detailBodyWrapper}>
              <p className={styles.detailTitle}>{item.artist}</p>
              <div className={styles.detailBody}>
                <div className={styles.detailBodyInner}>
                  <p>{item.itemDetail}</p>
                  <p>{item.fesName}</p>
                  <p>{item.playTime}分</p>
                </div>
                <div className={styles.detailRadioWrapper}>
                  <p className={styles.detailLerge}>
                    【レンタル期間】
                  </p>
                  <label htmlFor="palyTime">
                    <input
                      type="radio"
                      name="palyTime"
                      value={2}
                      onChange={(e) => handleChange(e)}
                    />
                    48時間&nbsp;¥{item.twoDaysPrice}円
                  </label>
                  <br />
                  <label htmlFor="palyTime">
                    <input
                      type="radio"
                      name="palyTime"
                      value={7}
                      onChange={(e) => handleChange(e)}
                    />
                    7泊&nbsp;¥{item.sevenDaysPrice}円
                  </label>
                  <br />
                  <p className={styles.cartAlert}>
                    {checked ? 'レンタル期間を選択してください' : ''}
                  </p>
                  <div className={styles.detailBtnWrapper}>
                    <button
                      type="submit"
                      className={styles.detailBtn}
                      // onClick={() => handleDelte(item)}
                    >
                      {addToCart ? 'カートから削除' : 'カートに追加'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style jsx>{`
            p {
              margin-block-start: 0;
              margin-block-end: 0;
            }
          `}</style>
        </div>
      </form>
    </section>
  );
}
