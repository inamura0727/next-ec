import Head from 'next/head';
import Image from 'next/image';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from './api/getUser';
import { RentalHistory } from '../types/user';
import Header from '../components/Header';
import { useState } from 'react';
import Player from '../components/Player';

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
  const rentalNows = rentalHistory?.filter((rental) => {
    if (rental.rentalEnd) {
      const rentalEnd = new Date(rental.rentalEnd);
      return rentalEnd >= nowDate;
    }
    return false;
  });

  //レンタル履歴に表示する情報取得
  const rentalHistories = rentalHistory?.map((rentalHistories) => {
    const PayDay = new Date(rentalHistories.payDate);
    const PayYear = PayDay.getFullYear();
    const PayMonth = PayDay.getMonth() + 1;
    const PayDate = PayDay.getDate();

    let addRentalHistories = {
      id: rentalHistories.id,
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

  console.log(typeof rentalNows);
  console.log(typeof rentalHistories);

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
        <h1>マイページ</h1>
        <div>
          <h2>レンタル中</h2>
          <div>
            {(() => {
              if (rentalNows?.length) {
                return rentalNows?.map((rentalNow: RentalHistory) => (
                  <li key={rentalNow.id}>
                    <Image
                      priority
                      src={rentalNow.itemImage}
                      height={144}
                      width={144}
                      alt="画像"
                    />
                    <h2>{`${rentalNow.itemName}`}</h2>
                    <button onClick={() => startPlayer(rentalNow.id)}>
                      再生
                    </button>
                  </li>
                ));
              } else {
                return <p>レンタル中作品はありません</p>;
              }
            })()}
          </div>
        </div>
        <div>
          <h2>レンタル履歴</h2>
          <div>
            {(() => {
              if (rentalHistories?.length) {
                return rentalHistories?.map((rentalHistory) => (
                  <li key={rentalHistory.id}>
                    <Image
                      priority
                      src={rentalHistory.itemImage}
                      height={144}
                      width={144}
                      alt="画像"
                    />
                    <h2>{`${rentalHistory.itemName}`}</h2>
                    <p>{`決済日：${rentalHistory.payDate.Year}年${rentalHistory.payDate.Month}月${rentalHistory.payDate.Date}日`}</p>
                    <p>{`視聴期間：${rentalHistory.period}`}</p>
                    <p>{`金額：${rentalHistory.price}円`}</p>
                  </li>
                ));
              } else {
                return <p>レンタル履歴はありません</p>;
              }
            })()}
          </div>
        </div>

        {start && (
          <Player closePlayer={() => setStart(!start)} id={startId} />
        )}
      </main>
    </>
  );
}
