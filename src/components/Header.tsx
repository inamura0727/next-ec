import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/header.module.css';

type headerProps = {
  isLoggedIn?: boolean;
  // ログアウト後処理を受け取る
  dologout: () => void;
};

export default function Header({
  isLoggedIn,
  dologout,
}: headerProps) {
  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <Image
          src={'/images/logo.png'}
          width={199}
          height={60}
          alt={'タイトルロゴ'}
        />

        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/">トップページ</Link>
            </li>
            <li>
              <Link href="/search">検索</Link>
            </li>
            <li>
              <Link href="/cart">カート</Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/mypage">マイページ</Link>
              </li>
            )}
          </ul>
        </nav>
        <span className={styles.loginInfo}>
          {isLoggedIn ? (
            <div className={styles.btnWrapper}>
              <Link
                href="/api/logout"
                onClick={async (e) => {
                  e.preventDefault();
                  await fetch('/api/logout').then(() => dologout());
                }}
              >
                ログアウト
              </Link>
            </div>
          ) : (
            <div className={styles.btnWrapper}>
              <Link href="/login">ログイン</Link>
            </div>
          )}
        </span>
      </div>
    </header>
  );
}
