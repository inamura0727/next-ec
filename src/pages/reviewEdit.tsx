import { SyntheticEvent, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import { Reviews } from 'types/review';

//編集前の商品情報表示
export const getServerSideProps: GetServerSideProps = async ({
  query,
}) => {
  //分割代入
  console.log(query.itemId);
  const response = await fetch(
    `http://localhost:8000/reviews?itemId=${query.itemId}`,
    {
      method: 'GET',
    }
  );
  const items = await response.json();
  const item = items[0];
  return {
    props: {
      item,
    },
  };
};

export default function ReviewEdit({ item }: { item: Reviews }) {
  console.log('aaaa');
  const [formReviewName, setFormReviewName] = useState(
    item.reviewName
  );
  const [formReviewText, setFormReviewText] = useState(
    item.reviewText
  );
  const [formEvaluation, setFormEvaluation] = useState(
    item.evaluation
  );
  const [formSpoiler, setFormSpoiler] = useState(item.spoiler);

  const review = useRef<HTMLDivElement>(null);

  //星を押した時
  const handleClick = function (e: SyntheticEvent) {
    setFormEvaluation(Number((e.target as Element).id));

    for (let i = 0; i < 5; i++) {
      review.current?.children[i].classList.remove(
        `${reviewStyles.active}`
      );
    }

    for (let i = 0; i < Number((e.target as Element).id); i++) {
      review.current?.children[i].classList.add(
        `${reviewStyles.active}`
      );
    }
  };

  //投稿ボタンを押した時
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const postTime = new Date();
    const postTimeYear = postTime.getFullYear();
    const postTimeMonth = postTime.getMonth() + 1;
    const postTimeDate = postTime.getDate();
    const postTimeHours = postTime.getHours();
    const postTimeMinutes = postTime.getMinutes();

    const nowPostTime = `${postTimeYear}/${postTimeMonth}/${postTimeDate} ${postTimeHours}:${postTimeMinutes}`;

    item.reviewId = item.id;

    const body = {
      itemId: item.itemId,
      itemName: item.fesName,
      userId: item.userId,
      itemImg: item.itemImage,
      userName: item.userName,
      postTime: nowPostTime,
      reviewName: formReviewName,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
      reviewId: item.id,
    };

    const res = await fetch(`/api/reviews/${item.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    }).then(() => {
      router.push(`/items/${item.itemId}`);
      //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    });
  };

  return (
    <>
      <p>編集</p>
      <Head>
        <title>{item.fesName}レビュー</title>
      </Head>

      <div>
        <p>{item.fesName}</p>
      </div>
      <main>
        <h2>レビュー</h2>
        <p>ユーザー{item.userName}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <div ref={review}>
              <span
                className={reviewStyles.evaluation}
                id="1"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="2"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="3"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="4"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="5"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
            </div>

            <div>
              <label>レビュータイトル</label>
            </div>
            <input
              type="text"
              name="reviewName"
              id="reviewName"
              value={formReviewName}
              onChange={(e) => setFormReviewName(e.target.value)}
            />

            <ul>
              <p>ネタバレ</p>
              <li key={1}>
                <input
                  name="spoiler"
                  id="1"
                  type="radio"
                  value={1}
                  onChange={(e) => setFormSpoiler(true)}
                />
                <label htmlFor="1">あり</label>
              </li>
              <li key={2}>
                <input
                  name="spoiler"
                  id="2"
                  type="radio"
                  value={2}
                  onChange={(e) => setFormSpoiler(false)}
                />
                <label htmlFor="2">なし</label>
              </li>
            </ul>

            <div>
              <label>レビュー追加</label>
            </div>
            <input
              type="text"
              name="reviewText"
              id="reviewText"
              value={formReviewText}
              onChange={(e) => setFormReviewText(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">編集完了</button>
          </div>
        </form>
      </main>
    </>
  );
}
