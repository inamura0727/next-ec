import styles from 'styles/detail.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Review } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReviewBtn({
  userId,
  id,
  isRentaled,
  isLoggedIn,
}: {
  userId: number | undefined;
  id: number;
  isRentaled: boolean;
  isLoggedIn: boolean | undefined;
}) {
  // 配列の中にどういう型の値が入ってくるか示すために<Review[]>の型指定を行う
  const [userRental, setUserRentals] = useState<Review[]>([]);

  // ユーザーのレビュー情報を取得
  useEffect(() => {
    (async () => {
      if (userId) {
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/review/getUserReview/${userId}/${id}`
        );
        setUserRentals(result.data);
      }
    })();
  }, [userId, id]);

  //レビューされた商品の場合はフラグを変更
  let isReviewed = false;
  if (userRental.length) {
    isReviewed = true;
  }

  // ログアウトした際にボタンを非表示にする
  if (!isLoggedIn) {
    isRentaled = false;
  }
  return (
    <>
      {isRentaled ? (
        <>
          {isReviewed ? (
            <Link
              href={`/reviewUpdate?reviewId=${userRental[0].reviewId}`}
            >
              <button className={styles.btnReview}>編集する</button>
            </Link>
          ) : (
            <Link href={`/reviewAdd?itemId=${id}`}>
              <button className={styles.btnReview}>
                レビューする
              </button>
            </Link>
          )}
        </>
      ) : null}
    </>
  );
}
