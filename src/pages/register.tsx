import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/register.module.css';
import styleHeader from 'styles/header.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { config } from '../config/index';
import axios from 'axios';

type Errors = {
  userName: string;
  zipcode: string;
  prefectures: string;
  city: string;
  houseNumber: string;
  buildingName: string;
  familyName: string;
  firstName: string;
  familyNameKana: string;
  firstNameKana: string;
  phoneNumbe: string;
  mailAddress: string;
  password: string;
  passwordTest: string;
};

export default function LoginScreen() {
  const initialValues = {
    userName: '',
    zipcode: '',
    prefectures: '',
    city: '',
    houseNumber: '',
    buildingName: '',
    familyName: '',
    firstName: '',
    familyNameKana: '',
    firstNameKana: '',
    phoneNumbe: '',
    mailAddress: '',
    password: '',
    passwordTest: '',
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErros, setFormErrors] = useState({
    userName: '',
    zipcode: '',
    prefectures: '',
    city: '',
    houseNumber: '',
    buildingName: '',
    familyName: '',
    firstName: '',
    familyNameKana: '',
    firstNameKana: '',
    phoneNumbe: '',
    mailAddress: '',
    password: '',
    passwordTest: '',
  });
  const [error, setError] = useState('');
  const rentalHistories: [] = []; ///レンタル履歴
  const userCarts: [] = []; //カートの中身
  const favoriteGenre: number = 0; //お気に入りジャンル
  const router = useRouter(); //登録された情報を更新した状態でページを移動

  //住所を検索
  const submitAddress = async () => {
    ///住所API
    //住所情報のURLを作成
    let api = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=';
    let url = api + formValues.zipcode;
    //住所情報を取得
    const response = await fetch(url, {
      method: 'GET',
    });
    const Address = await response.json();

    //郵便番号が正しく取得できているか
    if (Address.results !== null) {
      // prefectures,city,houseNumberの値を変更
      setFormValues({
        ...formValues,
        prefectures: Address.results[0].address1,
        city:
          Address.results[0].address2 + Address.results[0].address3,
      });

      setFormErrors({
        ...formErros,
        zipcode: '',
      });
    } else {
      setFormErrors({
        ...formErros,
        zipcode: '正しい郵便番号を入力してください',
      });
    }
  };

  //文字を打った時
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  //会員登録ボタンを押した時
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const error: Errors = validate(formValues);
    try {
      // 登録内容を登録する
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          userName: formValues.userName,
          zipcode: formValues.zipcode,
          prefecture: formValues.prefectures,
          city: formValues.city,
          houseNumber: formValues.houseNumber,
          buildingName: formValues.buildingName,
          familyName: formValues.familyName,
          firstName: formValues.firstName,
          familyNameKana: formValues.familyNameKana,
          firstNameKana: formValues.firstNameKana,
          mailAddress: formValues.mailAddress,
          password: formValues.password,
          passwordTest: formValues.passwordTest,
          rentalHistories,
          userCarts,
          favoriteGenre,
        }
      );
      if (response.data.result === false) {
        error.mailAddress = response.data.message;
        setFormErrors(error);
        return;
      }
      router.push('/registerComp');
    } catch (e: any) {
      setError(e.response.data.message[0]);
    }
  };

  //入力情報エラー条件
  const validate = (values: Errors) => {
    const errors: Errors = {
      userName: '',
      zipcode: '',
      prefectures: '',
      city: '',
      houseNumber: '',
      buildingName: '',
      familyName: '',
      firstName: '',
      familyNameKana: '',
      firstNameKana: '',
      phoneNumbe: '',
      mailAddress: '',
      password: '',
      passwordTest: '',
    };
    const regex =
      /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))([a-zA-Z0-9!@;:]){8,16}$/;

    const tellRegex = /^0\d{9,10}$/;

    if (!formValues.password) {
      errors.password = 'パスワードを入力してください';
    } else if (!regex.test(formValues.password)) {
      errors.password =
        '※8文字以上16文字以内。大文字、小文字、数字、記号のうち3種類以上';
    }
    if (!formValues.passwordTest) {
      errors.passwordTest = '確認用パスワードを入力してください';
    } else if (formValues.password !== formValues.passwordTest) {
      errors.passwordTest =
        'パスワードと確認用パスワードが異なります';
    }
    return errors;
  };

  return (
    <>
      <Head>
        <title>Festal - 会員登録</title>
      </Head>
      <header className={styleHeader.header}>
        <div className={styleHeader.info}>
          <Image
            src={'/images/logo.png'}
            width={232}
            height={70}
            alt={'タイトルロゴ'}
          />
        </div>
      </header>
      <main className={styles.registMain}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <ul>
            <li>
              <div className={styles.labelWrapper}>
                <label className={styles.label} htmlFor={'userName'}>
                  ユーザー名
                </label>
                <span className={styles.required}>必須</span>
              </div>
              <input
                type="text"
                name="userName"
                id="userName"
                value={formValues.userName}
                onChange={(e) => handleChange(e)}
              />
              {formErros.userName && (
                <p className={styles.error}>{formErros.userName}</p>
              )}
            </li>
            <li>
              <div className={styles.labelWrapper}>
                <label className={styles.label} htmlFor={'zipcode'}>
                  郵便番号
                </label>
                <span className={styles.required}>必須</span>
              </div>
              <input
                type="text"
                name="zipcode"
                id="zipcode"
                value={formValues.zipcode}
                onChange={(e) => handleChange(e)}
              />
              <button
                className={styles.Search}
                onClick={submitAddress}
                type="button"
                id="btn-search"
              >
                住所検索
              </button>
              {formErros.zipcode && (
                <p className={styles.error}>{formErros.zipcode}</p>
              )}
            </li>

            <li className={styles.listWrapper}>
              <div className={styles.listflex}>
                <div className={styles.listInfo}>
                  <div className={styles.labelWrapper}>
                    <label
                      className={styles.label}
                      htmlFor={'prefectures'}
                    >
                      都道府県
                    </label>
                    <span className={styles.required}>必須</span>
                  </div>
                  <input
                    type="text"
                    name="prefectures"
                    id="prefectures"
                    value={formValues.prefectures}
                    onChange={(e) => handleChange(e)}
                  />
                  {formErros.prefectures && (
                    <p className={styles.error}>
                      {formErros.prefectures}
                    </p>
                  )}
                </div>
                <div className={styles.listInfo}>
                  <div className={styles.labelWrapper}>
                    <label className={styles.label} htmlFor={'city'}>
                      市区町村
                    </label>
                    <span className={styles.required}>必須</span>
                  </div>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formValues.city}
                    onChange={(e) => handleChange(e)}
                  />
                  {formErros.city && (
                    <p className={styles.error}>{formErros.city}</p>
                  )}
                </div>
              </div>
              <div className={styles.listflex}>
                <div className={styles.listInfo}>
                  <div className={styles.labelWrapper}>
                    <label
                      className={styles.label}
                      htmlFor={'houseNumber'}
                    >
                      番地
                    </label>
                    <span className={styles.required}>必須</span>
                  </div>
                  <input
                    type="text"
                    name="houseNumber"
                    id="houseNumber"
                    value={formValues.houseNumber}
                    onChange={(e) => handleChange(e)}
                  />
                  {formErros.houseNumber && (
                    <p className={styles.error}>
                      {formErros.houseNumber}
                    </p>
                  )}
                </div>
                <div className={styles.listInfo}>
                  <div className={styles.labelWrapper}>
                    <label
                      className={styles.label}
                      htmlFor={'buildingName'}
                    >
                      建物名・部屋番号
                    </label>
                  </div>
                  <input
                    type="text"
                    name="buildingName"
                    id="buildingName"
                    value={formValues.buildingName}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </li>

            <li
              className={`${styles.listWrapperFlex} ${styles.listWrapper}`}
            >
              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'familyName'}
                  >
                    姓
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="text"
                  name="familyName"
                  id="familyName"
                  value={formValues.familyName}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.familyName && (
                  <p className={styles.error}>
                    {formErros.familyName}
                  </p>
                )}
              </div>

              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'firstName'}
                  >
                    名
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formValues.firstName}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.firstName && (
                  <p className={styles.error}>
                    {formErros.firstName}
                  </p>
                )}
              </div>
            </li>

            <li
              className={`${styles.listWrapperFlex} ${styles.listWrapper}`}
            >
              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'familyNameKana'}
                  >
                    セイ
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="text"
                  name="familyNameKana"
                  id="familyNameKana"
                  value={formValues.familyNameKana}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.familyNameKana && (
                  <p className={styles.error}>
                    {formErros.familyNameKana}
                  </p>
                )}
              </div>

              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'firstNameKana'}
                  >
                    メイ
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="text"
                  name="firstNameKana"
                  id="firstNameKana"
                  value={formValues.firstNameKana}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.firstNameKana && (
                  <p className={styles.error}>
                    {formErros.firstNameKana}
                  </p>
                )}
              </div>
            </li>

            <li className={styles.listWrapper}>
              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'phoneNumbe'}
                  >
                    電話番号
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="tel"
                  name="phoneNumbe"
                  id="phoneNumbe"
                  value={formValues.phoneNumbe}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.phoneNumbe && (
                  <p className={styles.error}>
                    {formErros.phoneNumbe}
                  </p>
                )}
              </div>
            </li>

            <li>
              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'mailAddress'}
                  >
                    メールアドレス
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="email"
                  name="mailAddress"
                  id="mailAddress"
                  value={formValues.mailAddress}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.mailAddress && (
                  <p className={styles.error}>
                    {formErros.mailAddress}
                  </p>
                )}
              </div>
            </li>

            <li
              className={`${styles.listWrapperFlex} ${styles.listWrapper}`}
            >
              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'password'}
                  >
                    パスワード
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.password && (
                  <p className={styles.error}>{formErros.password}</p>
                )}
              </div>

              <div className={styles.listInfo}>
                <div className={styles.labelWrapper}>
                  <label
                    className={styles.label}
                    htmlFor={'passwordTest'}
                  >
                    確認用パスワード
                  </label>
                  <span className={styles.required}>必須</span>
                </div>
                <input
                  type="password"
                  id="passwordTest"
                  name="passwordTest"
                  value={formValues.passwordTest}
                  onChange={(e) => handleChange(e)}
                />
                {formErros.passwordTest && (
                  <p className={styles.error}>
                    {formErros.passwordTest}
                  </p>
                )}
              </div>
            </li>
          </ul>
          <p className={styles.error}>{error}</p>
          <div className={styles.btnWrapper}>
            <button type="submit" className={styles.registBtn}>
              登録する
            </button>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={`/`} className={styles.topLink}>
              会員登録せずトップページへ
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
