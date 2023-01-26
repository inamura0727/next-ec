import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/itemList.module.css';
import { SessionUser } from 'pages/api/getUser';
import Router from 'next/router';
import UseSWR from 'swr';

const fetcher = (url: string, init: any) =>
  fetch(url, init).then((res) => res.json());

export default function RecommendItemList({
  items,
  user,
  useChatbot,
  doLogout,
  userName,
}: {
  items: Array<Item>;
  user: SessionUser;
  useChatbot: boolean;
  doLogout: boolean;
  userName: string;
}) {
  let logItems: Array<Item> = [];
  if (doLogout) {
    const id = 3;
    const take = 10;
    const { data } = UseSWR<Array<Item>>(
      `${process.env.NEXT_PUBLIC_API_URL}/${id}`,
      fetcher
    );
    if (data) {
      logItems.push(...data);
    }
    console.log(`data: ${data}`);
  }
  const route = () => {
    Router.push('/chatbot');
  };
  return (
    <main>
      {user.isLoggedIn ? (
        useChatbot ? (
          <div className={styles.p}>{userName}さんへのおすすめ</div>
        ) : (
          <div className={styles.btnWrapper}>
            <button
              className={styles.chatbotButtonBefore}
              onClick={route}
            >
              やってみよう！ <br className={styles.br} />{' '}
              チャットボット
            </button>
          </div>
        )
      ) : (
        <div className={styles.p}>邦楽ロック</div>
      )}
      {user.isLoggedIn ? (
        useChatbot ? (
          <section className={styles.itemList}>
            {logItems.map((item) => {
              return (
                <Link
                  key={item.itemId}
                  href={`/items/${item.itemId}`}
                  className={styles.item}
                >
                  <Image
                    src={item.itemImage}
                    width={400}
                    height={225}
                    alt={item.artist}
                    className={styles.itemImage}
                    priority
                  />
                  <div className={styles.detail}>
                    <div className={styles.artist}>{item.artist}</div>
                    <div className={styles.fesName}>
                      {item.fesName}
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        ) : (
          <div></div>
        )
      ) : logItems.length > 1 ? (
        <section className={styles.itemList}>
          {logItems.map((item) => {
            return (
              <Link
                key={item.itemId}
                href={`/items/${item.itemId}`}
                className={styles.item}
              >
                <Image
                  src={item.itemImage}
                  width={400}
                  height={225}
                  alt={item.artist}
                  className={styles.itemImage}
                  priority
                />
                <div className={styles.detail}>
                  <div className={styles.artist}>{item.artist}</div>
                  <div className={styles.fesName}>{item.fesName}</div>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className={styles.itemList}>
          {items.map((item) => {
            return (
              <Link
                key={item.itemId}
                href={`/items/${item.itemId}`}
                className={styles.item}
              >
                <Image
                  src={item.itemImage}
                  width={400}
                  height={225}
                  alt={item.artist}
                  className={styles.itemImage}
                  priority
                />
                <div className={styles.detail}>
                  <div className={styles.artist}>{item.artist}</div>
                  <div className={styles.fesName}>{item.fesName}</div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
      {user.isLoggedIn ? (
        useChatbot ? (
          <div className={styles.btnWrapper}>
            <button className={styles.chatbotButton} onClick={route}>
              チャットボット
            </button>
          </div>
        ) : (
          <div></div>
        )
      ) : (
        <div></div>
      )}
    </main>
  );
}
