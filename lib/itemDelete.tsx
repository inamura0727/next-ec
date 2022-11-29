import { Item } from 'types/item';
import { useState } from 'react';
// import { UserCart } from 'types/user';
import styles from 'styles/cart.module.css';

export default function DeleteBtn({
  id,
  itemId,
}: {
  id: number;
  itemId: number;
}) {
  const handleDelte = async () => {
    if (id !== 0) {
      // ログイン後の場合
      const req = await fetch(
        `http://localhost:3000/api/users/${id}`
      );
      const data = await req.json();
      const res = data.userCarts;

      console.log(`${res}`);
      const fil = res.filter((cartItem: Item) => {
        return cartItem.id !== itemId;
      });

      console.log(fil);
      const body = { userCarts: fil };

      fetch(`http://localhost:3000/api/users/${id}`, {
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
    } else {
      // ログイン前の場合
      const body = { id: itemId };

      fetch(`/api/itemDelete`, {
        method: 'POST',
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
    }
  };
  return (
    <div className={styles.cartBeforeBtnWrapper}>
      <button
        className={styles.cartBeforeBtn}
        onClick={() => handleDelte()}
      >
        削除
      </button>
    </div>
  );
}
