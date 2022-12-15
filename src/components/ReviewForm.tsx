import reviewStyles from 'styles/review.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { Item } from 'types/item';
import { Reviews } from 'types/review';

export default function Review(props:any) {


  //星を押した時
  const handleClick = function (e: any) {
    
    setFormEvaluation(Number((e.target as Element).id));

    for (let j = 0; j < 5; j++) {
      review.current?.children[j].classList.remove(
        `${reviewStyles.active}`
      );
    }

    for (let j = 0; j < Number((e.target as Element).id); j++) {
      review.current?.children[j].classList.add(
        `${reviewStyles.active}`
      );
    }
  };


  return (
    <>
      <Head>
        <title>{props.item.fesName}レビュー</title>
      </Head>

      <div>
        <Image
          src={`${props.item.itemImage}`}
          alt="画像"
          width={400}
          height={225}
        />
        <p>{props.item.fesName}</p>
      </div>
      <main>
        <h2>レビュー</h2>
        <p>ユーザー{props.datas.userName}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <div ref={review}>
              <span
                className={reviewStyles.evaluation}
                id="1"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="2"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="3"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="4"
                onClick={(e) => handleClick(e)}
              >
                ★
              </span>
              <span
                className={reviewStyles.evaluation}
                id="5"
                onClick={(e) => handleClick(e)}
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
              value={formReviewName}
              onChange={(e) => setFormReviewName(e.target.value)}
            />

            <ul>
              <p>ネタバレ</p>
              <li key={1}>
                <input
                  name="spoiler"
                  id="1"
                  type="radio"
                  value={1}
                  onChange={(e) => setFormSpoiler(true)}
                />
                <label htmlFor="1">あり</label>
              </li>
              <li key={2}>
                <input
                  name="spoiler"
                  id="2"
                  type="radio"
                  value={2}
                  onChange={(e) => setFormSpoiler(false)}
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
              value={formReviewText}
              onChange={(e) => setFormReviewText(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">投稿する</button>
          </div>
        </form>
      </main>
    </>
  );
}
