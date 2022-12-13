import styles from 'styles/review.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';
import { Reviews } from 'types/review';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({ itemId }: { itemId: number }) {
  const { data } = useSWR(`/api/reviews/?id=${itemId}`, fetcher);

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

  // 点数の配列のみ取り出す
  let scoreArr = data.map((dataList: Reviews) => {
    return dataList.evaluation;
  });

  let sum = 0;
  //平均点を求める
  if (!scoreArr.length) {
    sum = 0;
  } else {
    sum = scoreArr.reduce((pre: number, curr: number) => pre + curr);
  }

  // 平均点に１０をかけ、小数点を切り捨てた後１０で割ると小数点一桁のみ表示可能
  let average = Math.floor((sum / scoreArr.length) * 10) / 10;

  if (!average) {
    average = 0;
  }

  // 投稿日の取得
  data.map((review: Reviews) => {
    let reviewedDate = new Date(review.postTime);
    let year = reviewedDate.getFullYear();
    let month = reviewedDate.getMonth() + 1;
    let date = reviewedDate.getDate();
    return (review.postedDate = `${year}/${month}/${date}`);
  });

  return (
    <section className={styles.contentWrapper}>
      <p>総合{average}点</p>
      {data.map((review: Reviews) => {
        return (
          <div key={review.reviewId} className={styles.content}>
            {review.spoiler && <p>ネタバレあり</p>}
            <p>{review.reviewName}</p>
            <div className={styles.contentBody}>
              <p>{review.userName}</p>
              <p>投稿日{review.postedDate}</p>
              <p>{review.evaluation}</p>
              <div>{review.reviewText}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
