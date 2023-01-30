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
import UseSWR, { mutate } from 'swr';
import { SessionUser } from './api/getSessionInfo';
import Header from '../components/Header';
import loadStyles from 'styles/loading.module.css';
import axios from 'axios';

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReviewEdit({
  reviewItem,
}: {
  reviewItem: ReviewItem;
}) {
  let [doLogout, setLogout] = useState(false);
  const [formReviewTitle, setFormReviewTitle] = useState(
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

  const { data } = UseSWR<SessionUser>(
    '/api/getSessionInfo',
    fetcher
  );

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
  if (!data.isLoggedIn) {
    router.push(`/`);
  }

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
      reviewTitle: formReviewTitle,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
    };

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/review/update`,
      body
    );
    router.push(`/items/${reviewItem.item.itemId}`);
    //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
  };

  const logout = () => {
    setLogout(true);
    mutate('/api/getSessionInfo');
  };

  return (
    <>
      <p>編集</p>
      <Head>
        <title>{reviewItem?.item.fesName}レビュー</title>
      </Head>

      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => logout()}
      />

      <Image
        src={`${reviewItem?.item.itemImage}`}
        alt="画像"
        width={400}
        height={225}
      />
      <div>
        <p>{reviewItem?.item.fesName}</p>
      </div>
      <main>
        <h2>レビュー</h2>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            formReviewTitle={formReviewTitle}
            formReviewText={formReviewText}
            formEvaluation={formEvaluation}
            setFormReviewTitle={setFormReviewTitle}
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
