import styles from 'styles/detail.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({
  isLoggedIn,
  userId,
  id,
}: {
  isLoggedIn: boolean;
  userId: number | undefined;
  id: number;
}) {
  // ユーザーのレビュー情報を取得
  const { data } = useSWR(`/api/reviews/?userId=${userId}`, fetcher);

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

  //レビューされた商品のIDを取得
  let itemIdArr = data.map((item: any) => {
    return item.id;
  });

  // 詳細ページと一致しているレビューを取得
  let reviewdItem = itemIdArr.filter((item: any) => {
    return item === id;
  });

  //レビューされた商品の場合はフラグを変更
  let isReviewd = false;
  if (reviewdItem.length) {
    isReviewd = true;
  }

  console.log(isReviewd);

  return (
    <>
      {isReviewd ? (
        <Link href="/">
          <button className={styles.btnReview}>編集する</button>
        </Link>
      ) : (
        <Link href="/">
          <button className={styles.btnReview}>
            {isLoggedIn ? 'レビューを書く' : 'ログインする'}
          </button>
        </Link>
      )}
    </>
  );
}
