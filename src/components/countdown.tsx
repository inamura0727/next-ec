import { useEffect, useState } from 'react';

type Countdown = {
  endTime: Date;
  period?: string;
  startTime: Date;
};

export default function Countdown(props: Countdown) {
  //レンタル終了日(ミリ秒)
  const end = new Date(props.endTime);
  const endTime = end.getTime();
  //今の時間(ミリ秒)
  const now = new Date();
  const nowTime = now.getTime();
  const firstVariation = endTime - nowTime;
  //初めのレンタル時間
  const endHour = Math.floor(firstVariation / 1000 / 60 / 60);
  const endMin = Math.floor(firstVariation / 1000 / 60) % 60;
  const endSec = Math.floor(firstVariation / 1000) % 60;
  //レンタル開始・終了日
  const StartDay = new Date(props.startTime);
  const EndDay = new Date(props.endTime);
  const StartYear = StartDay.getFullYear();
  const StartMonth = StartDay.getMonth() + 1;
  const StartDate = StartDay.getDate();
  const StartHours = StartDay.getHours();
  const StartMinutes = StartDay.getMinutes();
  const EndYear = EndDay.getFullYear();
  const EndMonth = EndDay.getMonth() + 1;
  const EndDate = EndDay.getDate();
  const EndHours = StartDay.getHours();
  const EndMinutes = StartDay.getMinutes();
  //カウントダウンの時間・分・秒
  const [calcHour, setCalcHour] = useState(endHour);
  const [calcMin, setCalcMin] = useState(endMin);
  const [calcSec, setCalcSec] = useState(endSec);
  //カウントダウンのState
  const [countdown, setCountdown] = useState(
    `視聴期限：残り${calcHour}時間${calcMin}分${calcSec}秒`
  );
  //レンタル期間のState
  const [endCountdown, setEndCountdown] = useState(
    `視聴期間：${StartYear}/${StartMonth}/${StartDate} ${StartHours}:${StartMinutes} 〜 ${EndYear}/${EndMonth}/${EndDate} ${EndHours}:${EndMinutes}`
  );

  useEffect(() => {
    setTimeout(() => {
      const now = new Date();
      const nowTime = now.getTime();
      const variation = endTime - nowTime;
      //レンタル期間が過ぎているのかどうか
      if (Math.sign(variation) === 1) {
        const hour = Math.floor(variation / 1000 / 60 / 60);
        const min = Math.floor(variation / 1000 / 60) % 60;
        const sec = Math.floor(variation / 1000) % 60;
        setCalcHour(hour);
        setCalcMin(min);
        setCalcSec(sec);
        return setCountdown(
          `視聴期限：残り${calcHour}時間${calcMin}分${calcSec}秒`
        );
      } else {
        return setEndCountdown(
          `視聴期間：${StartYear}/${StartMonth}/${StartDate} ${StartHours}:${StartMinutes} 〜 ${EndYear}/${EndMonth}/${EndDate} ${EndHours}:${EndMinutes}`
        );
      }
    }, 1000);
  }, [
    EndDate,
    EndHours,
    EndMinutes,
    EndMonth,
    EndYear,
    StartDate,
    StartHours,
    StartMinutes,
    StartMonth,
    StartYear,
    calcHour,
    calcMin,
    calcSec,
    endTime,
    props.endTime,
    props.startTime,
  ]);

  return Math.sign(firstVariation) === 1 ? (
    <p>{countdown}</p>
  ) : (
    <p>{endCountdown}</p>
  );
}
