import Head from 'next/head';
import Image from 'next/image';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from './api/getUser';
import { RentalHistory } from '../types/user';
import Header from '../components/Header';
import { useState } from 'react';
import Player from '../components/Player';
import Link from 'next/link';
import styles from 'styles/mypage.module.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Mypage() {
  // 動画プレイヤー用のstateと関数
  const [start, setStart] = useState(false);
  const [startId, setStartId] = useState(0);
  const startPlayer = (id: number) => {
    setStart(!start);
    setStartId(id);
  };

  //ログインしたアカウント情報を取得
  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data) return <div>Loading</div>;
  const rentalHistory = data.userRentalHistories; //レンタル履歴を取得

  //レンタル中作品情報を取得
  let nowDate = new Date(); //今の時間
  //レンタル中商品のデータ取得

  const rentalNows = rentalHistory?.filter((item) => {
    if (item.rentalStart && item.rentalEnd) {
      const StartDay = new Date(item.rentalStart);
      const EndDay = new Date(item.rentalEnd);
      return EndDay >= nowDate;
    }
  }).map((rentalItem) => {
    if (rentalItem.rentalStart && rentalItem.rentalEnd) {
      const StartDay = new Date(rentalItem.rentalStart);
      const EndDay = new Date(rentalItem.rentalEnd);
      const StartYear = StartDay.getFullYear();
      const StartMonth = StartDay.getMonth() + 1;
      const StartDate = StartDay.getDate();
      const EndYear = EndDay.getFullYear();
      const EndMonth = EndDay.getMonth() + 1;
      const EndDate = EndDay.getDate();
      rentalItem.displayPeriod = `${StartYear}年${StartMonth}月${StartDate}日〜${EndYear}年${EndMonth}月${EndDate}日`;
    }
    return rentalItem;

  });
  
  //レンタル履歴に表示する情報取得
  const rentalHistories = rentalHistory?.map((rentalHistories) => {
    const PayDay = new Date(rentalHistories.payDate);
    const PayYear = PayDay.getFullYear();
    const PayMonth = PayDay.getMonth() + 1;
    const PayDate = PayDay.getDate();

    let addRentalHistories = {
      id: rentalHistories.id,
      itemId: rentalHistories.itemId,
      itemImage: rentalHistories.itemImage,
      itemName: rentalHistories.itemName,
      payDate: { Year: PayYear, Month: PayMonth, Date: PayDate },
      period: '',
      price: rentalHistories.price,
    };

    //未再生かじゃないか判断
    if (rentalHistories.rentalStart && rentalHistories.rentalEnd) {
      const StartDay = new Date(rentalHistories.rentalStart);
      const EndDay = new Date(rentalHistories.rentalEnd);
      const StartYear = StartDay.getFullYear();
      const StartMonth = StartDay.getMonth() + 1;
      const StartDate = StartDay.getDate();
      const EndYear = EndDay.getFullYear();
      const EndMonth = EndDay.getMonth() + 1;
      const EndDate = EndDay.getDate();
      addRentalHistories.period = `${StartYear}年${StartMonth}月${StartDate}日〜${EndYear}年${EndMonth}月${EndDate}日`;
    } else {
      addRentalHistories.period = '未再生';
    }

    return addRentalHistories;
  });

  return (
    <>
      <Head>
        <title>マイページ</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
      <main>
        <section className={styles.mypageSection}>
          <div className={styles.leftWrapper}>
            <h1 className={styles.wrapperTitle}>レンタル中</h1>
            <ul>
              {(() => {
                if (rentalNows?.length) {

                  return rentalNows?.map(
                    (rentalNow: RentalHistory) => (
                      <li key={rentalNow.id}>
                        <Image
                          priority
                          src={rentalNow.itemImage}
                          height={144}
                          width={144}
                          alt="画像"
                        />
                        <h2>{`${rentalNow.itemName}`}</h2>
                        <p>{`視聴期間：${rentalNow.displayPeriod}`}</p>
                        <button
                          onClick={() => startPlayer(rentalNow.id)}
                        >
                          再生
                        </button>
                      </li>
                    )
                  );
                } else {
                  return <p>レンタル中作品はありません</p>;
                }
              })()}
            </ul>
          </div>

          <div className={styles.rightWrapper}>
            <h1 className={styles.wrapperTitle}>レンタル履歴</h1>
            <ul>
              {(() => {
                if (rentalHistories?.length) {
                  return rentalHistories?.map((rentalHistory) => (
                    <li key={rentalHistory.id}>
                      <h2
                        className={styles.itemName}
                      >{`${rentalHistory.itemName}`}</h2>
                      <div className={styles.itemInfo}>
                        <Image
                          priority
                          src={rentalHistory.itemImage}
                          height={168}
                          width={300}
                          alt="画像"
                        />

                        <div className={styles.rentalInfo}>
                          <p>{`決済日：${rentalHistory.payDate.Year}年${rentalHistory.payDate.Month}月${rentalHistory.payDate.Date}日`}</p>
                          <p>{`視聴期間：${rentalHistory.period}`}</p>
                          <p>{`金額：${rentalHistory.price}円`}</p>
                        </div>
                      </div>

                      <Link
                        href={`/items/${rentalHistory.itemId}`}
                        legacyBehavior
                      >
                        <a>詳細ページへ</a>
                      </Link>
                    </li>
                  ));
                } else {
                  return <p>レンタル履歴はありません</p>;
                }
              })()}
            </ul>
          </div>
        </section>

        {start && (
          <Player closePlayer={() => setStart(!start)} id={startId} />
        )}
      </main>
    </>
  );
}
