import { Item } from 'types/item';
import { useState } from 'react';
import styles from 'styles/cart.module.css';
import { useSWRConfig } from 'swr';

export default function DeleteBtn({
  id,
  cartId,
  rebuild,
}: {
  id: number | undefined;
  cartId: number;
  rebuild: () => void;
}) {
  const handleDelte = async () => {
    if (id !== undefined) {
      // ログイン後の場合
      const req = await fetch(
        `http://localhost:3000/api/users/${id}`
      );
      const data = await req.json();
      const res = data.userCarts;

      const fil = res.filter((cartItem: Item) => {
        return cartItem.id !== cartId;
      });

      const newFil = [];
      for (let item of fil) {
        newFil.push({
          id: newFil.length + 1,
          itemId: item.itemId,
          itemName: item.itemName,
          itemImage: item.itemImage,
          price: item.price,
          rentalPeriod: item.rentalPeriod,
        });
      }

      console.log(newFil)
      const body = { userCarts: newFil };

      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('Success', result);
          rebuild();
        })
        .catch((error) => {
          console.log('Error', error);
        });
    } else {
      // ログイン前の場合
      const body = { id: cartId };

      await fetch(`/api/itemDelete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('Success', result);
          rebuild();
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
