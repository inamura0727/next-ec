import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from 'styles/login.module.css';

export default function Home() {
  const [mailAddress, setMailAddress] = React.useState(''); //名前の情報を更新して保存
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  //ログイン
  const submitHandler = async (e: any) => {
    e.preventDefault(); //既定の動作を止める
    const response = await fetch('/api/login', {
      //Jsonファイルに送る
      method: 'POST',
      body: JSON.stringify({
        mailAddress,
        password,
      }),
      headers: {
        'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
      },
    }).then(() => {
      router.push('http://localhost:3000/top');
    });
  };

  const cancelHandler = async (e: any) => {
    e.preventDefault(); //既定の動作を止める
    window.location.href = 'http://localhost:3000/top';
  };

  return (
    <>
      <Head>
        <title>登録完了</title>
      </Head>
      <main className={styles.itemList}>
        <div>
          <h1>フェスタ</h1>
          <form onSubmit={submitHandler}>
            <span id="Message"></span>
            <ul>
              <li>
                <label>メースアドレス</label>
                <input
                  type="text"
                  name="mailAddress"
                  id="mailAddress"
                  value={mailAddress}
                  onChange={(e) => setMailAddress(e.target.value)}
                />
              </li>
              <li>
                <label>パスワード</label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            </ul>
            <button type="submit">ログイン</button>
            <button onClick={cancelHandler}>キャンセル</button>
          </form>
        </div>
      </main>
    </>
  );
}
