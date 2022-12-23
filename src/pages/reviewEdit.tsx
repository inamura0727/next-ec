import { SyntheticEvent, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import { Reviews } from 'types/review';
import ReviewForm from '../components/ReviewForm';
import Image from 'next/image';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { GetServerSidePropsResult } from 'next';

//編集前の商品情報表示
export const getServerSideProps = withIronSessionSsr(
  async ({ query }) => {
    const reviewItems = await prisma.review.findUnique({
      where: {
        reviewId: Number(query.reviewId),
      },
    });
    return {
      props: {
        reviewItems,
        userId,
      },
    };
  },
  ironOptions
);

export default function ReviewEdit({ post }: { post: any }) {
  const [formReviewName, setFormReviewName] = useState(
    post.reviewItems.reviewName
  );
  const [formReviewText, setFormReviewText] = useState(
    post.reviewItems.reviewText
  );
  const [formEvaluation, setFormEvaluation] = useState(
    post.reviewItems.evaluation
  );
  const [formSpoiler, setFormSpoiler] = useState(post.reviewItems.spoiler);

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
      postTime: nowPostTime,
      reviewName: formReviewName,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
    };

    const res = await fetch(`/api/updateReview`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    }).then(() => {
      router.push(`/items/${post.itemId}`);
      //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    });
  };

  return (
    <>
      <p>編集</p>
      <Head>
        <title>{item.itemName}レビュー</title>
      </Head>

      <Image
        src={`${item.itemImg}`}
        alt="画像"
        width={400}
        height={225}
      />
      <div>
        <p>{item.itemName}</p>
      </div>
      <main>
        <h2>レビュー</h2>
        <p>ユーザー{item.userName}</p>
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
