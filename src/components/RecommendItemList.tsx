import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/itemList.module.css';
import { SessionUser } from 'pages/api/getUser';
import Router from 'next/router';

const css = { width: '100%', height: 'auto' };

export default function RecommendItemList({
  items,
  data,
}: {
  items: Array<Item>;
  data: SessionUser;
}) {
  const route = () => {
    Router.push('/chatbot');
  };
  return (
    <main>
      {typeof data.favoriteGenre !== 'number' ? (
        <>
          <div className={styles.p}>邦楽ロック</div>
          <section className={styles.itemList}>
            {/* if文で表示したいカテゴリにフィルター(仮で邦楽ロック) */}
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
                    <div className={styles.fesName}>
                      {item.fesName}
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        </>
      ) : data.favoriteGenre === 0 ? (
        <div className={styles.btnWrapper}>
          <button
            className={styles.chatbotButtonBefore}
            onClick={route}
          >
            やってみよう！ <br className={styles.br} /> チャットボット
          </button>
        </div>
      ) : (
        <>
          <div className={styles.p}>
            {data.userName}さんへのおすすめ
          </div>
          <section className={styles.itemList}>
            {/* if文で表示したいカテゴリにフィルター */}
            {items
              .filter((item) => {
                if (data.favoriteGenre) {
                  if (item.categories.includes(data.favoriteGenre))
                    return item;
                }
              })
              .slice(0, 10)
              .map((item) => {
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
                      <div className={styles.artist}>
                        {item.artist}
                      </div>
                      <div className={styles.fesName}>
                        {item.fesName}
                      </div>
                    </div>
                  </Link>
                );
              })
              .reverse()}
          </section>
          <div className={styles.btnWrapper}>
            <button className={styles.chatbotButton} onClick={route}>
              チャットボット
            </button>
          </div>
        </>
      )}
    </main>
  );
}
