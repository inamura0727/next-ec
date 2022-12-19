import { memo } from 'react';
import styles from 'styles/review.module.css';

type Props = {
  total: number;
  pageSize: number;
  handleClick: (number: number) => void;
};

const range = (start: number, end: number) =>
  [...Array(end - start + 1)].map((_, i) => start + i);

export default function ReviewPagination({
  total,
  pageSize,
  handleClick,
}: Props) {
  return (
    <div className={styles.paging}>
      {range(1, Math.ceil(total / pageSize)).map((index) => (
        <button key={index} onClick={() => handleClick(index)} className={styles.pagingBtn}>
          {index}
        </button>
      ))}
    </div>
  );
}
