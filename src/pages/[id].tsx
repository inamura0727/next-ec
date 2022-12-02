import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Item } from 'types/item';
import { UserCart, RentalHistory } from 'types/user';
import styles from 'styles/detail.module.css';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';
import Head from 'next/head';
import Player from '../components/Player';

export type loginUser = {
  userId: number;
  userCarts: UserCart[];
  userRentalHistories: RentalHistory[];
  isLoggedIn: boolean;
};

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
  const [isChoiced, setIsChoiced] = useState(false);
  const [start, setStart] = useState(false);
  const [startId, setStartId] = useState(0);
  const startPlayer = (id: number) => {
    setStart(!start);
    setStartId(id);
  };

  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data) return <div>Loading</div>;

  let carts = data.userCarts;
  let rentalHistory: RentalHistory[] | undefined =
    data.userRentalHistories;

  //ユーザーか否かを調べる型ガード
  function isUser(data: SessionUser): data is loginUser {
    return data.isLoggedIn === true;
  }

  // レンタルエンドがあるか否か
  let isRentalEnd = false;
  if (isUser(data)) {
    let rentalItem = data.userRentalHistories;
    if ('rentalEnd' in rentalItem) {
      isRentalEnd = false;
    } else {
      isRentalEnd = true;
    }
  }

  //レンタル中（既に再生ボタンが押されている）
  let nowDate = new Date();
  const rentalNows = rentalHistory?.filter((rental) => {
    if (rental.rentalEnd) {
      const rentalEnd = new Date(rental.rentalEnd);
      return rentalEnd > nowDate;
    }
    return false;
  });

  // // レンタル中あるいはレンタルエンドがないもの
  let rentalFlg = false;
  // レンタル商品のIDを格納するため
  let rentalCartId: number;

  if (rentalNows || isRentalEnd === true) {
    if (rentalHistory) {
      const isRentaled: RentalHistory[] = rentalHistory.filter(
        (rental) => {
          return rental.itemId === item.id;
        }
      );
      console.log(isRentaled);
      if (isRentaled.length) {
        rentalFlg = true;
        rentalCartId = isRentaled[0].id;
        console.log(rentalCartId);
      }
    }
  }

  // 詳細画面で選択されている作品がレンタル中か否か調べる

  if (rentalNows) {
    const isRental = rentalNows.filter((rental) => {
      rental.itemId === item.id;
    });
    console.log(isRental);
    if (isRental.length) {
      rentalFlg = true;
    }
  }

  let cartflg = false;
  if (carts) {
    // 商品が既に追加されている場合に同じitemIdがないか確かめる
    const check = carts.filter((cart) => {
      return cart.itemId === item.id;
    });
    if (check.length) {
      cartflg = true;
      mutate('/api/getUser');
    }
  }

  // レンタル中の作品情報を取得

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    chengeRentalPeriod(num);
  };

  // レンタル期間と価格の切り替え
  const chengeRentalPeriod = (num: number) => {
    if (num === 2) {
      setPeriod(num);
      setPrice(item.twoDaysPrice);
    } else {
      setPeriod(num);
      setPrice(item.sevenDaysPrice);
    }
  };

  // 選択した商品をカートに追加
  const handleAddItem = async (item: Item) => {
    // 　ラジオボタンの判定のチェック
    if (price === 0 || period === 0) {
      setIsChoiced(true);
      return;
    }

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
          if (isChoiced === true) {
            setIsChoiced(!isChoiced);
          }
          cartflg = true;
          mutate('/api/getUser');
        })
        .catch((error) => {
          console.log('Error', error);
        });
    } else {
      // ログイン前

      let cartId;
      if (!data.userCarts) {
        cartId = 1;
      } else {
        cartId = data.userCarts.length;
      }
      console.log('elseきた');

      let userCarts: UserCart = {
        id: cartId,
        itemName: `${item.artist}  ${item.fesName}`,
        rentalPeriod: period,
        price: price,
        itemImage: item.itemImage,
        itemId: item.id,
      };

      const body = { cart: userCarts };

      // cookieに保存するために/api/cartに飛ばす
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
          if (isChoiced === true) {
            setIsChoiced(!isChoiced);
          }
          cartflg = true;
          mutate('/api/getUser');
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

      const fil = res.filter((cartItem: UserCart) => {
        return cartItem.itemId !== item.id;
      });

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
          cartflg = false;
          mutate('/api/getUser');
        })
        .catch((error) => {
          console.log('Error', error);
        });
    } else {
      // ログイン前の場合
      const body = { id: item.id, detail: true };

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
          cartflg = false;
          mutate('/api/getUser');
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
    cartflg ? handleDelte(item) : handleAddItem(item);
  };

  return (
    <>
      <Head>
        <title>{`${item.artist} ${item.fesName}`}</title>
      </Head>
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
                  {rentalFlg ? (
                    <div>
                      <button
                        onClick={() => startPlayer(rentalCartId)}
                      >
                        再生
                      </button>
                    </div>
                  ) : (
                    <>
                      {cartflg ? (
                        <div className={styles.detailRadioWrapper}>
                          <div className={styles.detailBtnWrapper}>
                            <button
                              type="submit"
                              className={styles.detailBtn}
                            >
                              カートから削除
                            </button>
                          </div>
                        </div>
                      ) : (
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
                            48時間&nbsp;{item.twoDaysPrice}円
                          </label>
                          <br />
                          <label htmlFor="palyTime">
                            <input
                              type="radio"
                              name="palyTime"
                              value={7}
                              onChange={(e) => handleChange(e)}
                            />
                            7泊&nbsp;{item.sevenDaysPrice}円
                          </label>
                          <br />
                          <p className={styles.cartAlert}>
                            {isChoiced
                              ? 'レンタル期間を選択してください'
                              : ''}
                          </p>
                          <div className={styles.detailBtnWrapper}>
                            <button
                              type="submit"
                              className={styles.detailBtn}
                            >
                              カートに追加
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
        {start && (
          <Player closePlayer={() => setStart(!start)} id={startId} />
        )}
      </section>
    </>
  );
}
