import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const useUnread = () => {
  const [broadcastList, setBroadcastList] = useState([]);
  const initialReadState = localStorage.getItem("readState")
    ? JSON.parse(localStorage.getItem("readState"))
    : {};
  const [readState, setReadState] = useState(initialReadState);

  useEffect(() => {
    const fetchBroadcastList = () => {
      const zid = localStorage.getItem("zid");
      axios({
        url: "http://129.226.223.80:8000/api/broadcast/student_broadcast/",
        data: {
          zid: zid,
        },
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        const formattedBroadcastList = res.data.broadcast_list.map(
          (broadcast) => ({
            ...broadcast,
            read: false,
          })
        );
        setBroadcastList(formattedBroadcastList);
      });
    };
    fetchBroadcastList();
    const interval = setInterval(fetchBroadcastList, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const readStateCopy = { ...readState };
    broadcastList.forEach((broadcast) => {
      if (readStateCopy[broadcast.created] === undefined) {
        readStateCopy[broadcast.created] = broadcast.read;
      }
    });
    setReadState(readStateCopy);
  }, [broadcastList, readState]);

  useEffect(() => {
    localStorage.setItem("readState", JSON.stringify(readState));
  }, [readState]);

  const trueCount = Object.values(readState).reduce(
    (count, value) => count + !value,
    0
  );
  const lastUnreadMessage = broadcastList.filter((broadcast) => !readState[broadcast.created])[broadcastList.filter((broadcast) => !readState[broadcast.created]).length - 1];
  const lastUnreadMessageText = lastUnreadMessage ? lastUnreadMessage.message : "";
  const trueCountnew = localStorage.getItem("trueCountnew")

 
  return { trueCount,trueCountnew,lastUnreadMessageText};
};
