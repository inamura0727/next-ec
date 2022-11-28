import Head from 'next/head';
import Link from 'next/link';
import styles from 'styles/completion.module.css';

export default function Completion() {
  return (
    <>
      <Head>
        <title>登録完了</title>
      </Head>
      <main className={styles.itemList}>
        <div className={styles.item}>
          <div className={styles.itemBox}>
            <h2>登録完了いたしました</h2>
            <h2>ご登録ありがとうございます。</h2>
            <Link href={'/login'}>ログイン画面へ</Link>
          </div>
        </div>
      </main>
    </>
  );
}
