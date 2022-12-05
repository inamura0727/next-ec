import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Item } from 'types/item';
import { UserCart, RentalHistory } from 'types/user';
import styles from 'styles/detail.module.css';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../api/getUser';
import Header from '../../components/Header';
import Head from 'next/head';
import Player from '../../components/Player';

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
  let rentalFlg = false;
  let cartflg = false;
  let rentalPeriod;
  let rentalCartId: number;
  let nowDate = new Date();

  let rentaledItems = rentalHistory?.filter((rentaledItem) => {
    return rentaledItem.itemId === item.id;
  });

  // 再生ボタンの出しわけ
  if (!rentaledItems?.length) {
    rentalFlg = false;
  } else if (rentaledItems.length) {
    // 同じ商品をレンタルした場合、最新のものを取得する
    let lastItem = rentaledItems.slice(-1)[0];
    if (!lastItem.rentalEnd) {
      rentalFlg = true;
      rentalCartId = lastItem.id;
      rentalPeriod = '未再生';
    } else if (lastItem.rentalStart && lastItem.rentalEnd) {
      const rentalStart = new Date(lastItem.rentalStart);
      const rentalEnd = new Date(lastItem.rentalEnd);
      if (rentalEnd > nowDate) {
        rentalFlg = true;
        rentalCartId = lastItem.id;
        const startYear = rentalStart.getFullYear();
        const startMonth = rentalStart.getMonth() + 1;
        const startDate = rentalStart.getDate();
        const endYear = rentalEnd.getFullYear();
        const endMonth = rentalEnd.getMonth() + 1;
        const endDate = rentalEnd.getDate();
        rentalPeriod = `${startYear}年${startMonth}月${startDate}日〜${endYear}年${endMonth}月${endDate}日`;
      }
    }
  }

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
        id: res.length + 1,
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

      console.log(fil);

      const newFil = [];
      for (let item of fil) {
        newFil.push({
          id: newFil.length + 1,
          itemId: item.itemId,
          itemName: item.itemName,
          itemImage: item.itemImage,
          price: item.price,
          rentalPeriod: item.rentalPeriod,
        });
      }

      const body = { userCarts: newFil };

      await fetch(`http://localhost:3000/api/users/${id}`, {
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

      await fetch(`/api/itemDelete`, {
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
                    <div className={styles.btnWrapper}>
                      <p>視聴期間：{rentalPeriod}</p>
                      <button
                        className={`${styles.btn} ${styles.pushdown}`}
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
                              className={`${styles.detailBtn} ${styles.bgleft}`}
                            >
                              <span>カートから削除</span>
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
                              className={`${styles.detailBtn} ${styles.bgleft}`}
                            >
                              <span>カートに追加</span>
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
