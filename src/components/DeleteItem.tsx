import { Item } from 'types/item';
import { useState } from 'react';
import styles from 'styles/cart.module.css';
import { config } from '../config/index';

export default function DeleteBtn({
  id,
  cartId,
  itemId,
  rebuild,
}: {
  id: number | undefined;
  cartId: number;
  itemId: number;
  rebuild: () => void;
}) {
  const handleDelte = async () => {
    if (id !== undefined) {
      // ログイン後の場合
      // deleteCartに飛ばす
      await fetch(`/api/deleteCart/${id}/${cartId}`);
      rebuild();
    } else {
      // ログイン前の場合
      const body = { id: itemId };

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
