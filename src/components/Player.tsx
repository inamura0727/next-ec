import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import styles from '../styles/player.module.css';

type playerProps = {
  id: number;
  // ログアウト後処理を受け取る
  closePlayer: () => void;
  url: string
};

export default function Player({closePlayer,id,url}:playerProps) {
  const sample = (id:number) => {
    const data = {id:id};
    fetch('/api/startRental', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  };
  return (
    <div className={styles.playerArea}>
      <ReactPlayer
        url={url}
        className={styles.reactPlayer}
        width='70%'
        height='70%'
        controls={true}
        playing={true}
        onStart={() => sample(id)}
      />
      <div className={styles.closePlayer} onClick={() => closePlayer()}>×</div>
    </div>
  );
}
