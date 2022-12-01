import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from 'styles/login.module.css';

export default function Home() {
  const [mailAddress, setMailAddress] = useState(''); //名前の情報を更新して保存
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  //ログイン
  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
    }).then((res) => {
      if (res.status === 200) {
        router.push('/api/addLogedinCart')
      } else {
        setErrorMessage('ログイン情報が異なります');
      }
    });
  };

  return (
    <>
      <Head>
        <title>ログイン</title>
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
                  type="email"
                  name="mailAddress"
                  id="mailAddress"
                  value={mailAddress}
                  onChange={(e) => setMailAddress(e.target.value)}
                />
              </li>
              <li>
                <label>パスワード</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            </ul>
            <p>{errorMessage}</p>
            <button type="submit">ログイン</button>
          </form>
          <Link href={`/`}>トップページへ</Link>
        </div>
      </main>
    </>
  );
}
