import styles from '../styles/paymentComp.module.css';
import Head from 'next/head';
import Link from 'next/link';

export default function PaymentComp() {
  return (
    <>
      <Head>
        <title>決済完了画面</title>
      </Head>
      <main className={styles.payCompMain}>
        <div className={styles.contents}>
          <p>
            決済が確認できました。
            <br />
            ご利用ありがとうございました。
          </p>
          <Link href={`/`}>マイページへ</Link>
        </div>
      </main>
    </>
  );
}
