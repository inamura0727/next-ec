import Head from 'next/head';
import styles from 'styles/completion.module.css';

export default function Completion() {
  ///住所API
  const submitRogin = async (e: any) => {
    window.location.href = 'http://localhost:3000/login';
  };

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

            <button
              onClick={submitRogin}
              type="button"
              id="btn-search"
            >
              ログイン画面へ
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
