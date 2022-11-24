import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function CartList() {
  return (
    <div className="cart-content">
      <div className="cart-media">
        <div className="cart-inner">
          <figure className="cart-img-wrapper">
            <Image
              className="cart-img"
              src=""
              width={200}
              height={150}
              alt="商品の画像"
            />
          </figure>
          <div className="cart-body">
            <div className="cart-title">
              <p className="cart-artists">The 1975</p>
              <p className="cart-fes">SUMMER SONIC TOKYO 2022-8-20</p>
              <p className="cart-period">
                レンタル期間　2020/11/23-2022/11/25
              </p>
              <Link href="" legacyBehavior>
                <a>詳細ページへ</a>
              </Link>
            </div>
            <p className="cart-price">￥150</p>
          </div>
        </div>
        <div className="cart-btn-wrapper">
          <button className="cart-before-btn">削除</button>
        </div>
      </div>
      <style jsx>
        {`
          .cart-content {
            max-width: 1230px;
            padding: 15px;
            margin: 0 auto;
          }
          .cart-media {
            border: 1px solid #333;
            padding: 10px;
          }
          .cart-img {
            width: 100%;
          }
          .cart-inner {
            display: flex;
            align-items: center;
          }
          .cart-btn-wrapper {
            text-align: right;
          }
          .cart-before-btn {
            padding: 5px 10px;
            border: 1px solid #333;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}
