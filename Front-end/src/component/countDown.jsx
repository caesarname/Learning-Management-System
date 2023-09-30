import { useState, useRef, useEffect } from 'react';


const CountDownWapper: React.FC<any> = (props) => {
  const countDownTimer = useRef(); // 倒计时标记
  const [timeView, setTimeView] = useState(null); // 倒计时显示
  const [time, setTime] = useState(props.expire*60); // 倒计时显示
   let timeNum = props.expire*60
  const countDown = () => {
    const times = parseInt(`${timeNum}`); //把剩余时间毫秒数转化为秒
    const h = parseInt(`${(times / 60 / 60) % 24}`); //计算小时数 转化为整数
    const m = parseInt(`${(times / 60) % 60}`); //计算分钟数 转化为整数
    const s = parseInt(`${times % 60}`); //计算描述 转化为整数
    //设置时间格式
    setTimeView({
      h: h < 10 ? `0${h}` : `${h}`,
      m: m < 10 ? `0${m}` : `${m}`,
      s: s < 10 ? `0${s}` : `${s}`,
    });
    props.getTime(timeNum)
    //时间判断
    if (times <= 0) {
      clearTimeout(countDownTimer.current);
      setTimeView({ h: '00', m: '00', s: '00' });
    } else {
      countDownTimer.current = setTimeout(() => {
        countDown();
        timeNum = timeNum - 1
      }, 1000);
    }
  };

  useEffect(() => {
    if (props.expire) {
      countDown();
    } else {
      setTimeView({ h: '00', m: '00', s: '00' });
    }
    return () => {
      clearTimeout(countDownTimer.current);
    };
  }, []);
  return (
    <>
      {props.showDomStruct ?? true ? (
        <>
          {timeView?.h}:{timeView?.m}:{timeView?.s}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default CountDownWapper;