import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Item } from 'types/item';
import { UserCart } from 'types/user';
import { User } from 'types/user';
import { ironOptions } from '../../lib/ironOprion';
import { withIronSessionSsr } from 'iron-session/next';
import styles from 'styles/detail.module.css';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export async function getStaticPaths() {
  const req = await fetch('http://localhost:3000/api/items');
  const data = await req.json();

  const paths = data.map((item: { id: number }) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const id = params.id;
  const req = await fetch(`http://localhost:3000/api/items/${id}`);
  const data = await req.json();

  return {
    props: {
      item: data,
    },
  };
}

export default function ItemDetail({ item }: { item: Item }) {
  const [price, setPrice] = useState(0);
  const [period, setPeriod] = useState(0);
  const [checked, setChecked] = useState(false);
  const [addToCart, setAddtoCart] = useState(false);

  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data) return <div>Loading</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    chengeRentalPeriod(num);
  };

  const chengeRentalPeriod = (num: number) => {
    if (num === 2) {
      setPeriod(num);
      setPrice(item.twoDaysPrice);
    } else {
      setPeriod(num);
      setPrice(item.sevenDaysPrice);
    }
  };

  const handleAddtoCart = async (item: Item) => {
    // 　ラジオボタンの判定のチェック
    if (price === 0 && period === 0) {
      setChecked(!checked);
      return;
    }

    // 「カートから削除」が表示されている場合
    if (checked) {
      setChecked(!checked);
    }

    // カートに追加と削除の表示切り替え
    setAddtoCart(!addToCart);

    // ユーザーidの取得
    const id = data.userId;

    // ログイン後
    if (id !== undefined) {
      const req = await fetch(
        `http://localhost:3000/api/users/${id}`
      );
      const data = await req.json();
      const res = data.userCarts;

      let userCarts: UserCart = {
        id: res.length,
        itemName: `${item.artist}  ${item.fesName}`,
        rentalPeriod: period,
        price: price,
        itemImage: item.itemImage,
        itemId: item.id,
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
      let itemId;
      if (data.userCarts === undefined) {
        return (itemId = 1);
      }

      let userCarts: UserCart = {
        id: data.userCarts.length + 1,
        itemName: `${item.artist}  ${item.fesName}`,
        rentalPeriod: period,
        price: price,
        itemImage: item.itemImage,
        itemId: item.id,
      };

      const body = { cart: userCarts };

      // ログイン前　cookieに保存するために/api/cartに飛ばす
      fetch(`/api/addCart`, {
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

  // 選択した商品をカートから削除
  const handleDelte = async (item: Item) => {
    const id = data.userId;
    if (id !== undefined) {
      // ログイン後の場合
      const req = await fetch(
        `http://localhost:3000/api/users/${id}`
      );
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
    } else {
      // ログイン前の場合
      const body = { id: item.id };

      fetch(`/api/itemDelete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('Success', result);
          setAddtoCart(!addToCart);
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    item: Item
  ) => {
    e.preventDefault();
    console.log(data.userId);
    addToCart ? handleDelte(item) : handleAddtoCart(item);
  };

  return (
    <>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
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
                      {checked
                        ? 'レンタル期間を選択してください'
                        : ''}
                    </p>
                    <div className={styles.detailBtnWrapper}>
                      <button
                        type="submit"
                        className={styles.detailBtn}
                      >
                        {addToCart
                          ? 'カートから削除'
                          : 'カートに追加'}
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
    </>
  );
}
