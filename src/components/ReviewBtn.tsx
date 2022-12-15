import styles from 'styles/detail.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';
import { Reviews } from 'types/review';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({
  userId,
  id,
  isRentaled,
}: {
  userId: number | undefined;
  id: number;
  isRentaled: boolean;
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
  let itemIdArr = data.map((item: Reviews) => {
    return item.itemId;
  });

  // 詳細ページと一致しているレビューを取得
  let reviewdItem = itemIdArr.filter((itemId: number) => {
    return itemId === id;
  });

  //レビューされた商品の場合はフラグを変更
  let isReviewd = false;
  if (reviewdItem.length) {
    isReviewd = true;
  }

  return (
    <>
      {isRentaled ? (
        <>
          {isReviewd ? (
            <Link href={`/reviewEdit?itemId=${id}`}>
              <button className={styles.btnReview}>編集する</button>
            </Link>
          ) : (
            <Link href={`/review?itemId=${id}`}>
              <button className={styles.btnReview}>
                レビューする
              </button>
            </Link>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
}
