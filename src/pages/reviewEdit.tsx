import { SyntheticEvent, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';

import { Reviews } from 'types/review';

//編集前の商品情報表示
export const getServerSideProps: GetServerSideProps = async (
  {
    //   query,
  }
) => {
  //分割代入
  const response = await fetch(`http://localhost:8000/reviews/1`, {
    //${query.id}
    method: 'GET',
  });
  const items = await response.json();
  return {
    props: {
      items,
    },
  };
};

export default function ReviewEdit({ items }: { items: Reviews }) {
  console.log(items);
  const [formReviewName, setFormReviewName] = useState(
    items.reviewName
  );
  const [formReviewText, setFormReviewText] = useState(
    items.reviewText
  );
  const [formEvaluation, setFormEvaluation] = useState(
    items.evaluation
  );
  const [formpoiler, setFormPoiler] = useState(items.spoiler);

  const review = useRef<HTMLDivElement>(null);

  //星を押した時
  const handleClick = function (e: SyntheticEvent) {
    setFormEvaluation(Number((e.target as Element).id));

    for (let j = 0; j < 5; j++) {
      review.current?.children[j].classList.remove(
        `${reviewStyles.active}`
      );
    }

    for (let j = 0; j < Number((e.target as Element).id); j++) {
      review.current?.children[j].classList.add(
        `${reviewStyles.active}`
      );
    }
  };

  //投稿ボタンを押した時
  const handleSubmit = async (
    e: SyntheticEvent
  ) => {
    e.preventDefault();

    const postTime = new Date();
    const postTimeYear = postTime.getFullYear();
    const postTimeMonth = postTime.getMonth() + 1;
    const postTimeDate = postTime.getDate();
    const postTimeHours = postTime.getHours();
    const postTimeMinutes = postTime.getMinutes();

    const nowPostTime = `${postTimeYear}/${postTimeMonth}/${postTimeDate} ${postTimeHours}:${postTimeMinutes}`;

    items.reviewId = items.id;

    const body = {
      itemId: items.reviewId,
      itemName: items.fesName,
      userId: items.userId,
      itemImg: items.itemImage,
      userName: items.userName,
      postTime: nowPostTime,
      reviewName: formReviewName,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formpoiler,
      reviewId: items.id,
    };

    const res = await fetch(`/api/reviews/${items.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    }).then(() => {
      router.push(`/items/${items.id}`); //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    });
  };

  return (
    <>
      <p>編集</p>
      <Head>
        <title>{items.fesName}レビュー</title>
      </Head>

      <div>
        <p>{items.fesName}</p>
      </div>
      <main>
        <h2>レビュー</h2>
        <p>ユーザー{items.userName}</p>
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
                  onChange={(e) => setFormPoiler(true)}
                />
                <label htmlFor="1">あり</label>
              </li>
              <li key={2}>
                <input
                  name="spoiler"
                  id="2"
                  type="radio"
                  value={2}
                  onChange={(e) => setFormPoiler(false)}
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
