import reviewStyles from 'styles/review.module.css';

export default function ReviewForm(props: any) {
  return (
    <div>
      <div ref={props.review}>
        <span
          className={reviewStyles.evaluation}
          id="1"
          onClick={(e) =>props.onClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="2"
          onClick={(e) =>props.onClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="3"
          onClick={(e) =>props.onClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="4"
          onClick={(e) =>props.onClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="5"
          onClick={(e) =>props.onClick(e)}
        >
          ★
        </span>
      </div>

      <div>
        <label>レビュータイトル</label>
      </div>
      <input
        type="text"
        name="reviewName"
        id="reviewName"
        value={props.formReviewName}
        onChange={(e) => props.setFormReviewName(e.target.value)}
      />

      <ul>
        <p>ネタバレ</p>
        <li key={1}>
          <input
            name="spoiler"
            id="1"
            type="radio"
            value={1}
            onChange={(e) => props.setFormSpoiler(true)}
          />
          <label htmlFor="1">あり</label>
        </li>
        <li key={2}>
          <input
            name="spoiler"
            id="2"
            type="radio"
            value={2}
            onChange={(e) => props.setFormSpoiler(false)}
          />
          <label htmlFor="2">なし</label>
        </li>
      </ul>

      <div>
        <label>レビュー追加</label>
      </div>
      <input
        type="text"
        name="reviewText"
        id="reviewText"
        value={props.formReviewText}
        onChange={(e) => props.setFormReviewText(e.target.value)}
      />
    </div>
  );
}
