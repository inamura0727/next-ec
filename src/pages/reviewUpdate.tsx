import { SyntheticEvent, useRef, useState } from 'react';
import Head from 'next/head';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import ReviewForm from '../components/ReviewForm';
import Image from 'next/image';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { Item } from 'types/item';
import prisma from '../../lib/prisma';

type ReviewItem = {
  reviewId: number;
  item: Item;
  userId: number;
  postTime: string;
  reviewTitle: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
};

//編集前の商品情報表示
export const getServerSideProps = withIronSessionSsr(
  async ({ query }) => {
    const reviewItem = await prisma.review.findUnique({
      where: {
        reviewId: Number(query.reviewId),
      },

      include: {
        item: true,
      },
    });

    if (reviewItem?.item) {
      const tmp: Item = reviewItem?.item;
      tmp.releaseDate = String(reviewItem?.item.releaseDate);
    }

    return {
      props: {
        reviewItem,
      },
    };
  },
  ironOptions
);

export default function ReviewEdit({
  reviewItem,
}: {
  reviewItem: ReviewItem;
}) {
  const [formReviewName, setFormReviewName] = useState(
    reviewItem.reviewTitle
  );
  const [formReviewText, setFormReviewText] = useState(
    reviewItem.reviewText
  );
  const [formEvaluation, setFormEvaluation] = useState(
    reviewItem.evaluation
  );
  const [formSpoiler, setFormSpoiler] = useState(reviewItem.spoiler);

  const review = useRef<HTMLDivElement>(null);

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

    const body = {
      reviewId: reviewItem.reviewId,
      postTime: nowPostTime,
      reviewTitle: formReviewName,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
    };

    await fetch(`/api/updateReview`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    })
    // .then(() => {
    //   router.push(`/items/${reviewItem.item.fesName}`);
    //   //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    // });
  };

  return (
    <>
      <p>編集</p>
      <Head><title>{reviewItem?.item.fesName}レビュー</title></Head>

      <Image
        src={`${reviewItem?.item.itemImage}`}
        alt="画像"
        width={400}
        height={225}
      />
      <div><p>{reviewItem?.item.fesName}</p></div>
      <main>
        <h2>レビュー</h2>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            formReviewName={formReviewName}
            formReviewText={formReviewText}
            formEvaluation={formEvaluation}
            setFormReviewName={setFormReviewName}
            setFormReviewText={setFormReviewText}
            setFormEvaluation={setFormEvaluation}
            setFormSpoiler={setFormSpoiler}
          />
          <div>
            <button type="submit">編集完了</button>
          </div>
        </form>
      </main>
    </>
  );
}
