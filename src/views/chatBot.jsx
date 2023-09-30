import React, { useState, useRef, useEffect } from "react";
import Chat, { Bubble, useMessages } from "@chatui/core";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import "../ChatBot.css";
import { Navbar } from "../component/navbar";
import { Notificationbar } from "../component/notificationbar";
import axios from "axios";

export const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chatHeight, setChatHeight] = useState(540);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newMessage = {
      content: inputValue,
      sender: "Me",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    const apiendpoint = "https://api.openai.com/v1/chat/completions";
    const accesstoken = "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";

    const params = {
      messages: [{ content: inputValue, role: "user" }],
      max_tokens: 150,
      n: 1,
      temperature: 0.5,
      model: "gpt-3.5-turbo",
    };

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${accesstoken}`,
    };
    axios
      .post(apiendpoint, params, { withCredentials: false, headers })
      .then((response) => {
        const responsetext = response.data.choices[0].message.content.trim();

        const botMessage = {
          content: responsetext,
          sender: "Chat Bot",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const chatWindow = messagesEndRef.current.parentNode;
    chatWindow.scroll({
      top: messagesEndRef.current.offsetTop - chatWindow.offsetTop - 100,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

  const handleMessageContainerResize = () => {
    const messageContainerHeight =
      document.getElementById("messageContainer").clientHeight;
    setChatHeight(messageContainerHeight);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2}>
          <Notificationbar />
          <div className="ChatBoxWrapper">
            <div
              className="ChatWindow"
              style={{ height: `${chatHeight}px` }}
              onScroll={handleMessageContainerResize}
            >
              <div className="ChatMessages" id="messageContainer">
                {messages.map((message, index) => (
                  <div
                    className={`ChatMessage ${
                      message.sender === "Me"
                        ? "ChatMessage--user"
                        : "ChatMessage--bot"
                    }`}
                    key={index}
                  >
                    <Box
                      sx={{
                        borderRadius: 8,
                        bgcolor:
                          message.sender === "Me"
                            ? "rgb(247, 247, 248)"
                            : "rgb(124, 186, 204)",
                        p: 2,
                        color:
                          message.sender === "Me"
                            ? "common.black"
                            : "common.white",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {message.sender}
                      </Typography>

                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {message.timestamp}
                      </Typography>

                      <Typography>{message.content}</Typography>
                    </Box>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="InputBox">
              <TextField
                className="ChatInputField"
                label="Send a message"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                className="SendButton"
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </Stack>
      </Box>
    </>
  );
};
