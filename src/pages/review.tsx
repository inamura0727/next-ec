import Head from 'next/head';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import UseSWR from 'swr';
import { SessionUser } from './api/getUser';
import loadStyles from 'styles/loading.module.css';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import { Item } from 'types/item';
import ReviewForm from '../components/ReviewForm';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({ post }: { post: Item }) {
  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher); //ユーザー情報取得

  const [formReviewName, setFormReviewName] = useState('');
  const [formReviewText, setFormReviewText] = useState('');
  const [formEvaluation, setFormEvaluation] = useState(0);
  const [formSpoiler, setFormSpoiler] = useState(false);

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
      reviewId: 1,
      itemId: post.itemId,
      userId: data.userId,
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
        <p>ユーザー{data.userName}</p>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            item={post}
            userItem={data}
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

export async function getServerSideProps({
  query,
}: {
  query: { itemId: number };
}) {
  // const response = await fetch(
  //   `http://localhost:8000/items/${query.itemId}`,
  //   {
  //     method: 'GET',
  //   }
  // );
  // const dates: Item = await response.json();
  const items = await prisma.item.findMany({
    where: {
      itemId: query.itemId,
    },
  });

  

  return {
    props: { post: items },
  };
}
