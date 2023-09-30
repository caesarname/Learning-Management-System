import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import "../ChatBot.css";
import { Navbar } from "../component/navbar";
import { Notificationbar } from "../component/notificationbar";
import axios from "axios";

export const ChatTest = () => {
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

    // set the api endpoint and access token
    const apiendpoint = "https://api.openai.com/v1/completions";
    const accesstoken = "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";

    // set the prompt text and parameters
    const prompttext = inputValue;

    const params = {
      model: "text-davinci-002",
      prompt: prompttext,
      max_tokens: 64,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "\n",
    };

    // send the api request
    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${accesstoken}`,
    };

    axios
      .post(apiendpoint, params, { headers })
      .then((response) => {
        const choices = response.data.choices;
        if (choices && choices.length > 0) {
          const responsetext = choices[0].text;
          console.log(`chatgpt response: ${responsetext}`);

          const botMessage = {
            content: responsetext,
            sender: "Bot",
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          console.error("No response text found");
        }
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
                  <div className="ChatMessage" key={index}>
                    <div className="ChatMessageSender">{message.sender}</div>
                    <div className="ChatMessageContent">{message.content}</div>
                    <div className="ChatMessageTimestamp">
                      {message.timestamp}
                    </div>
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
