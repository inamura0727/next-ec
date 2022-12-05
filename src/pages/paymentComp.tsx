import styles from '../styles/paymentComp.module.css';
import Head from 'next/head';
import Link from 'next/link';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import Header from '../components/Header';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaymentComp() {

  const { data } = UseSWR<SessionUser>('/api/getUser',fetcher);
  if(!data) return <div>Loading</div>

  return (
    <>
      <Head>
        <title>決済完了画面</title>
      </Head>
      <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')}/>
      <main className={styles.payCompMain}>
        <div className={styles.contents}>
          <p>
            決済が確認できました。
            <br />
            ご利用ありがとうございました。
          </p>
          <Link href={`/mypage`} className={styles.maypageLink}>レンタルした作品を確認する</Link>
        </div>
      </main>
    </>
  );
}
