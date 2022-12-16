import loadStyles from 'styles/loading.module.css';
import useSWR from 'swr';

type Props = {
  total: number;
  pageSize: number;
  handleClick: (number: number) => void;
};

const range = (start: number, end: number) =>
  [...Array(end - start + 1)].map((_, i) => start + i);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReviewPagination({
  total,
  pageSize,
  handleClick,
}: Props) {
  return (
    <div>
      {range(1, Math.ceil(total / pageSize)).map((index) => (
        <button key={index} onClick={() => handleClick(index)}>
          {index}
        </button>
      ))}
    </div>
  );
}
