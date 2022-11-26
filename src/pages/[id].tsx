import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Item } from 'types/item';
import { UserCart } from 'types/user';
import { User } from 'types/user';
import { ironOptions } from '../../lib/ironOprion';
import { withIronSessionSsr } from 'iron-session/next';


// ログイン後の場合、商品のデータ情報とユーザー情報の取得
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    const id = query.id;
    const data = await fetch(`http://localhost:3000/api/items/${id}`);
    const items = await data.json();

    const user = req.session.user;
    if (user === undefined) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        user: req.session.user,
        item: items,
      },
    };
  },
  ironOptions
);

export default function ItemDetail({
  item,
  user,
}: {
  item: Item;
  user: User;
}) {
  const [price, setPrice] = useState(0);
  // const [userCart, setUserCart] = useState<UserCart[]>([]);
  const [period, setPeriod] = useState(0);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    setPeriod(num);
    if (period === 2) {
      setPrice(item.twoDaysPrice);
    } else {
      setPrice(item.sevenDaysPrice);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // ユーザーidの取得
    const id = user.id;

    const req = await fetch(`http://localhost:3000/api/users/${id}`);
    const data = await req.json();
    const res = data.userCarts;
    console.log(res);

    let userCarts: UserCart = {
      id: item.id,
      itemName: item.artist + item.fesName,
      rentalPeriod: period,
      price: price,
      itemImage: item.itemImage,
    };

    res.push(userCarts);
    const body = { userCarts: res };

    fetch(`http://localhost:3000/api/users/${id}`, {
      // user情報はgetserverside
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('Success', result);
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="detail-container">
            <div className="detail-img-wrapper">
              <Image
                className="detail-img"
                src={item.itemImage}
                alt="画像"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="detail-title">{item.artist}</p>
            <div className="detail-body">
              <div className="detail-body-inner">
                <p>{item.itemDetail}</p>
                <p>{item.fesName}</p>
                <p>{item.palyTime}分</p>
              </div>
              <div className="detail-btn-wrapper">
                <label htmlFor="palyTime">
                  <input
                    type="radio"
                    name="palyTime"
                    value={1}
                    onChange={(e) => handleChange(e)}
                  />
                  48時間&nbsp;¥{item.twoDaysPrice}円
                </label>
                <br />
                <label htmlFor="palyTime">
                  <input
                    type="radio"
                    name="palyTime"
                    value={7}
                    onChange={(e) => handleChange(e)}
                  />
                  7泊&nbsp;¥{item.sevenDaysPrice}円
                </label>
                <br />
                <button type="submit" className="detail-btn">
                  カートに追加
                </button>
              </div>
            </div>
          </div>
          <style jsx>{`
            .detail-img-wrapper {
              max-width: 100%;
              height: 350px;
              position: relative;
            }
            .detail-title {
              font-size: 80px;
              font-weight: bold;
              position: absolute;
              top: 25%;
              left: 5%;
              color: white;
            }
            .detail-container {
              max-width: 1330px;
            }
            .detail-body {
              padding: 15px;
            }
            .detail-img-wrapper::after {
              content: '';
              width: 100%;
              height: 100%;
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              background-color: rgba(0, 0, 0, 0.4);
            }
            .detail-btn {
              padding: 5px 10px;
              border: 1px solid #333;
              border-radius: 10px;
            }
          `}</style>
        </div>
      </form>
    </>
  );
}
