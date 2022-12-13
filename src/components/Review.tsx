import styles from 'styles/review.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Reviwe = {
  id: number;
  itemName: string;
  userId: number;
  userName: string;
  postTime: Date;
  reviewName: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
};

export default function Review({
  id,
  userId,
  userName,
}: {
  id: number;
  userId: number | undefined;
  userName: string | undefined;
}) {
  const { data } = useSWR(`/api/reviews/?id=${id}`, fetcher);

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
  let scoreArr = data.map((dataList: Reviwe) => {
    return dataList.evaluation;
  });

  //平均点を求める
  let sum = 0;
  for (let i = 0; i < scoreArr.length; i++) {
    sum += scoreArr[i];
  }
  // 平均点に１０をかけ、小数点を切り捨てた後１０で割ると小数点一桁のみ表示可能
  let average = Math.floor((sum / scoreArr.length) * 10) / 10;

  if (!average) {
    average = 0;
  }

  return (
    <section className={styles.contentWrapper}>
      <p>総合{average}点</p>
      {data.map((review: Reviwe) => {
        return (
          <div key={review.id} className={styles.content}>
            {review.spoiler && <p>ネタバレあり</p>}
            <p>{review.reviewName}</p>
            <div className={styles.contentBody}>
              <p>{review.userName}</p>
              <p>投稿日{review.postTime}</p>
              <p>{review.evaluation}</p>
              <div>{review.reviewText}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
