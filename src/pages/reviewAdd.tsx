import Head from 'next/head';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import loadStyles from 'styles/loading.module.css';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import { Item } from 'types/item';
import ReviewForm from '../components/ReviewForm';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import prisma from '../../lib/prisma';

export default function Review({
  item,
  userId,
}: {
  item: Item;
  userId: number;
}) {

  const [formReviewName, setFormReviewName] = useState('');
  const [formReviewText, setFormReviewText] = useState('');
  const [formEvaluation, setFormEvaluation] = useState(0);
  const [formSpoiler, setFormSpoiler] = useState(false);

  if (!userId)
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
  // if (!user.) {
  //   router.push(`/`);
  // }

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
      itemId: item.itemId,
      userId: userId,
      postTime: nowPostTime,
      reviewTitle: formReviewName,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
    };

    await fetch('/api/addReview', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    }).then(() => {
      router.push(`/items/${item.itemId}`); //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    });
  };

  return (
    <>
      <Head>
        <title>
          {item.artist}
          {item.fesName}レビュー
        </title>
      </Head>

      <div>
        <Image
          src={`${item.itemImage}`}
          alt="画像"
          width={400}
          height={225}
        />
        <p>
          {item.artist}
          {item.fesName}
        </p>
      </div>
      <main>
        <h2>レビュー</h2>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            item={item}
            // userItem={data}
            formReviewName={formReviewName}
            formReviewText={formReviewText}
            formEvaluation={formEvaluation}
            setFormReviewName={setFormReviewName}
            setFormReviewText={setFormReviewText}
            setFormEvaluation={setFormEvaluation}
            setFormSpoiler={setFormSpoiler}
          />
          <div>
            <button type="submit">投稿する</button>
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req, query }) => {
    const item = await prisma.item.findUnique({
      where: {
        itemId: 6,
      },
    });
    // if (!req.session.user) {
    //   return {
    //     redirect: {
    //       permanent: false,
    //       destination: '/error',
    //     },
    //   };
    // }

    //  const userId = req.session.user.userId;
    const userId = 5;

    // if (userId) {
    //   if (items) {
    //     const tmp: Item = items;
    //     tmp.releaseDate = String(items?.releaseDate);
    //   }
    // }
    if (item) {
      const tmp: Item = item;
      tmp.releaseDate = String(item?.releaseDate);
    }

    return {
      props: {
        item,
        userId
      },
    };
  },
  ironOptions
);
