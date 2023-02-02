import styles from 'styles/review.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import { useState } from 'react';
import ReviewSelect from './ReviewSort ';
import { Item } from 'types/item';
import { User } from 'types/user';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Review = {
  reviewId: number;
  itemId: number;
  userId: number;
  postTime: string;
  reviewTitle: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
  items: Item;
  users: User;
};

export default function Review({ itemId }: { itemId: number }) {
  const [orderBy, setOrderBy] = useState('reviewId');
  const [order, setOrder] = useState('desc');
  // ページ番号
  const [page, setPage] = useState(1);

  // １ページにつき表示する件数
  const itemPerPage = 5;

  // ページ番号の総数を出す式
  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  // ２バイト文字のパラメーター含むURLはエラーになるためエンコードに変換
  const url = encodeURI(
    `${process.env.NEXT_PUBLIC_API_URL}/review/${itemId}/${orderBy}/${order}/${page}/${itemPerPage}`
  );
  const { data } = useSWR(url, fetcher);

  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  // 取得したレビュー
  const reviews = data.reviews;
  // アイテムの平均スコア
  let average = data.average._avg.evaluation;
  // レビューの総数
  const total = data.total;

  if (average === null) {
    average = 0;
  }

  // ページ番号の選択
  const handleClick = (i: number) => {
    setPage(i);
  };

  // 動的APIルーティングの値を変更
  const selectChange = (value: string) => {
    const result = value.split(',');
    setOrderBy(result[0]);
    setOrder(result[1]);
  };

  return (
    <>
      <section className={styles.accordionWrapper}>
        <h1 className={styles.title}>レビュー</h1>
        <p className={styles.score}>総合{average}点</p>
        <p className={styles.star}>
          <span className={styles.rating} data-rate={average}></span>
        </p>
        <div className={styles.accordionOuter}>
          <ReviewSelect selectChange={selectChange} />
          {reviews.map((review: Review) => {
            return (
              <div key={review.reviewId} className={styles.accordion}>
                <input
                  type="checkbox"
                  className={styles.toggle}
                  id={String(review.reviewId)}
                />
                <label
                  className={styles.label}
                  htmlFor={String(review.reviewId)}
                >
                  {review.reviewTitle}
                  {review.spoiler && (
                    <span className={styles.tag}>ネタバレあり </span>
                  )}
                </label>
                <div className={styles.contentBody}>
                  <p>投稿者名：{review.users.userName}</p>
                  <p>投稿日：{review.postTime}</p>
                  <p>点数：{review.evaluation}点</p>
                  <p>{review.reviewText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {range(1, Math.ceil(total / itemPerPage)).map(
        (number, index) => (
          <button
            key={index}
            className={styles.pagingBtn}
            onClick={() => handleClick(number)}
          >
            {number}
          </button>
        )
      )}
      <style jsx>
        {`
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        `}
      </style>
    </>
  );
}
