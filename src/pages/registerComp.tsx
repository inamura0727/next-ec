import Head from 'next/head';
import Link from 'next/link';
import styles from 'styles/registerComp.module.css';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Completion() {

  const { data } = UseSWR<SessionUser>('/api/getUser',fetcher);
  if(!data) return <div>Loading</div>

  return (
    <>
      <Head>
        <title>登録完了</title>
      </Head>
      <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')}/>

      <main className={styles.registerCompMain}>
        <div className={styles.contents}>
          <p>
          登録完了いたしました
            <br />
            ご登録ありがとうございます。
          </p>
          <Link href={`/login`} className={styles.loginLink}>ログイン画面へ</Link>
        </div>
      </main>
    </>
  );
}
