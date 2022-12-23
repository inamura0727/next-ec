import { Item } from 'types/item';
import { useState } from 'react';
import styles from 'styles/cart.module.css';
import { config } from '../config/index';

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
      console.log('DeleteItemきた');
      // ログイン後の場合
      // deleteCartに飛ばす
      const res = await fetch(`/api/deleteCart/${id}/${cartId}`);
      rebuild();
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
