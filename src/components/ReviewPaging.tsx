import loadStyles from 'styles/loading.module.css';
import useSWR from 'swr';

type Props = {
  itemId: number;
  pageSize: number;
  handleClick: (number: number) => void;
};

const range = (start: number, end: number) =>
  [...Array(end - start + 1)].map((_, i) => start + i);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReviewPagination({
  itemId,
  pageSize,
  handleClick,
}: Props) {
  const { data } = useSWR(`/api/reviews/?itemId=${itemId}`, fetcher);
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
  let totalCount = data.length;

  return (
    <div>
      {range(1, Math.ceil(totalCount / pageSize)).map((index) => (
        <button key={index} onClick={() => handleClick(index)}>
          {index}
        </button>
      ))}
    </div>
  );
}
