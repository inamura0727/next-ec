import Head from 'next/head';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import loadStyles from 'styles/loading.module.css';
import router from 'next/router';
import { Item } from 'types/item';
import ReviewForm from '../components/ReviewForm';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import prisma from '../../lib/prisma';
import { GetServerSidePropsResult } from 'next';


export default async function Review({ post }: { post: any }) {

  const [formReviewName, setFormReviewName] = useState('');
  const [formReviewText, setFormReviewText] = useState('');
  const [formEvaluation, setFormEvaluation] = useState(0);
  const [formSpoiler, setFormSpoiler] = useState(false);

  if (!post)
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
  if (!post.userId) {
    router.push(`/`);
  }

  //ユーザー情報取得
  const users = await prisma.user.findMany({
    where: {
      userId: post.userId,
    },
  });


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
      reviewId: 1,
      itemId: post.itemId,
      userId: post.userId,
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
      router.push(`/items/${post.itemId}`); //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
    });
  };

  return (
    <>
      <Head>
        <title>
          {post.artist}
          {post.fesName}レビュー
        </title>
      </Head>

      <div>
        <Image
          src={`${post.itemImage}`}
          alt="画像"
          width={400}
          height={225}
        />
        <p>
          {post.artist}
          {post.fesName}
        </p>
      </div>
      <main>
        <h2>レビュー</h2>
        <p>ユーザー{users[0].userName}</p>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            item={post.itemId}
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
  async ({
    req,
    query
  }) => {
    const items = await prisma.item.findUnique({
      where: {
        itemId: Number(query.itemId),
      },
    });
    if(!req.session.user){
      return {
        redirect: {
          permanent: false,
          destination: '/error',
        },
      };
    }
    const userId = req.session.user.userId;

    return {
      props: {
        items,
        userId,
      },
    };
  },
  ironOptions
);
