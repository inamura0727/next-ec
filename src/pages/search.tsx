import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/search.module.css';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Pagination from 'components/Paging';
import SearchForm from 'components/SearchForm';
import SortSelect from 'components/SortSelect';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import loadStyles from 'styles/loading.module.css';
import { config } from '../config/index';

// 1ページあたりの最大表示件数を指定(仮で2件にしています。)
const PAGE_SIZE = 12;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  items: Array<Item>;
  keyword: string;
  genre: string;
  page: number;
  totalCount: number;
  sort: string;
};

export default function Search({
  items,
  keyword,
  genre,
  page,
  totalCount,
  sort,
}: Props) {
  const router = useRouter();
  const onClick = (index: number) => {
    router.push({
      pathname: '/search',
      query: {
        categories_like: genre,
        q: keyword,
        page: index,
        _sort: sort,
      },
    });
  };
  const onSortChange = (value: string) => {
    router.push({
      pathname: '/search',
      query: { categories_like: genre, q: keyword, _sort: value },
    });
  };
  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );
  return (
    <>
      <Head>
        <title>検索</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getUser')}
      />
      <main className={styles.container}>
        <SearchForm />
        <div className={styles.searchResult}>
          <div className={styles.components}>
            <div className={styles.searchCount}>
              検索結果：{totalCount}件
            </div>
            <SortSelect onSortChange={onSortChange} />
          </div>
          {totalCount === 0 ? (
            <>
              <div className={styles.itemList}>
                条件に合う検索結果がありません。
              </div>
            </>
          ) : (
            <section className={styles.itemList}>
              {items.map((item) => {
                return (
                  <div key={item.id} className={styles.item}>
                    <Link href={`/items/${item.id}`}>
                      <Image
                        src={item.itemImage}
                        width={400}
                        height={225}
                        alt={item.artist}
                        className={styles.itemImage}
                        priority
                      />
                      <br />
                      <div className={styles.artist}>
                        {item.artist}
                      </div>
                      <div className={styles.fesName}>
                        {item.fesName}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </section>
          )}
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onClick={onClick}
          />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext) {
  const keyword = query.q;
  const genre = query.categories_like;
  const page = query.page ? +query.page : 1;
  const sort = query._sort ? query._sort : 'id&_order=desc';
  const res = await fetch(
    `${config.items}?categories_like=${genre}&q=${keyword}&_sort=${sort}`
  );
  const items = await res.json();
  const count = items.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const paging = items.slice(startIndex, startIndex + PAGE_SIZE);
  return {
    props: {
      items: paging,
      keyword: keyword,
      genre: genre,
      page: page,
      totalCount: count ? count : 0,
      sort: sort,
    },
  };
}
