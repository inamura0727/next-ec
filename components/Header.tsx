import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/header.module.css';

type headerProps = {
  isLogined?: boolean;
  // ログアウト後処理を受け取る
  dologout: () => void;
};

export default function Header({ isLogined, dologout }: headerProps) {
  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <Image
          src={'/'}
          width={100}
          height={70}
          alt={'タイトルロゴ'}
        />

        <span className={styles.loginInfo}>
          {isLogined ? (
            <Link
              href="/api/logout"
              onClick={async (e) => {
                e.preventDefault();
                await fetch('/api/logout').then(() => dologout());
              }}
            >
              ログアウト
            </Link>
          ) : (
            <Link href="/login">ログイン</Link>
          )}
        </span>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/top">トップページ</Link>
          </li>
          <li>
            <Link href="/search">検索</Link>
          </li>
          <li>
            <Link href="/cart">カート</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
