import ReactPlayer from 'react-player'
import styles from '../styles/player.module.css';

type playerProps = {
  id: number;
  closePlayer: () => void;
  startPlayer: () => void;
};

export default function Player({ closePlayer, id ,startPlayer}: playerProps) {
  const sample = (id: number) => {
    const data = { id: id };
    fetch('/api/startRental', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => startPlayer());
  };
  return (
    <div className={styles.playerArea}>
      <ReactPlayer
        url={'https://www.youtube-nocookie.com/watch?v=Gqoby4CeA3Y'}
        className={styles.reactPlayer}
        width="70%"
        height="70%"
        controls={true}
        playing={true}
        config={{ youtube: { playerVars: { origin: 'https://localhost:3000' } } }}
        onStart={() => sample(id)}
      />
      <div
        className={styles.closePlayer}
        onClick={() => closePlayer()}
      >
        ×
      </div>
    </div>
  );
}
