import Head from 'next/head';
import styles from '../styles/paymentComp.module.css';

export default function Error() {
  return (
    <>
      <Head>
        <title>エラー</title>
      </Head>
      <main className={styles.payCompMain}>
        <div className={`${styles.contents} ${styles.errorContent}`}>
          <p>エラーが発生しました。</p>
          <br />
          <p>時間を置いて再度お試しください。</p>
        </div>
      </main>
    </>
  );
}
