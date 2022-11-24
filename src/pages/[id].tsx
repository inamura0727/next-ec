import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export async function getStaticPaths() {
  const req = await fetch('http://localhost:3000/api/items');
  const data = await req.json();

  const paths = data.map((item: { id: number }) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const id = params.id;
  const req = await fetch(`http://localhost:3000/api/items/${id}`);
  const data = await req.json();

  return {
    props: {
      item: data,
    },
  };
}

export default function Item({ item }: { item: any }) {
  const [state, setState] = useState<any>({
    cart: { items: [], total: 0 },
  });

  const [val, setVal] = useState(item.twoDaysPrice);
  const [period, setPeriod] = useState('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleSubmit = () => {
    const body = {
      id: item.id,
      itemName: item.fesName + item.airtist,
      retalPriod: period,
      price: val,
    };

    fetch(`http://localhost:3000/api/users/}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };
  };

  const body = {
    id: item.id,
    itemName: item.fesName + item.artists,
  };

  fetch(`http://localhost:3000/api/users`, {
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
  // カートへの商品の追加
  const addItem = (item: any) => {
    let { items } = state.cart;
    setState({
      cart: {
        items: [...items, item],
        total: state.cart.total + item.price,
      },
    });
   };

  return (
    <div>
      <div className="detail-container">
        <div className="detail-img-wrapper">
          <Image
            className="detail-img"
            src={item.itemImage}
            alt="アー写"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <form action="patch" method="patch" onSubmit={handleSubmit}>
          <p className="detail-title">{item.airtist}</p>
          <div className="detail-body">
            <div className="detail-body-inner">
              <p>{item.itemDetail}</p>
              <p>{item.fesName}</p>
              <p>{item.playTime}分</p>
            </div>
            <div className="detail-btn-wrapper">
              <label htmlFor="palyTime">
                <input
                  type="radio"
                  name="palyTime"
                  value={item.twoDaysPrice}
                  onChange={(e) => handleChange(e)}
                />
                48時間&nbsp;¥{item.twoDaysPrice}円
              </label>
              <br />
              <label htmlFor="palyTime">
                <input
                  type="radio"
                  name="palyTime"
                  value={item.sevenDaysPrice}
                  onChange={(e) => handleChange(e)}
                />
                7泊&nbsp;¥{item.sevenDaysPrice}円
              </label>
              <br />
              <button
                type="submit"
                className="detail-btn"
                onClick={() => addItem(item)}
              >
                カートに追加
              </button>
            </div>
          </div>
        </form>
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
  );
}
