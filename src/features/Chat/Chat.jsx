import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import chatApi from "../../Api/chatApi";
import Pusher from "pusher-js";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
Chat.propTypes = {};

function Chat(props) {
  const loggedInuser = useSelector((state) => state?.user?.current);
  const isLoggedIn = !!loggedInuser?.id;
  
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user?.id)
  const { userId } = useParams();
  const schema = yup.object({
    message: yup
      .string()
      .required("Nhập tin nhắn")
      .max(1000, "Vui lòng nhập ít hơn 1000 kí tự"),
  });
  const {
    register: message,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const newMessage = async (data) => {
    try {
      const result = await chatApi.newMessage(data);
      console.log(result);
      setMessages((prevMessages) => [...prevMessages, result]);
      reset();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const dataRes = await chatApi.getMessages(userId);
        setMessages(dataRes.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (isLoggedIn) {
      const pusher = new Pusher("edbe3c1ada201abc1182", {
        cluster: "ap1",
      });
      const channel = pusher.subscribe(`new-message.${user?.id}`);

      channel.bind("App\\Events\\NewMessage", function (data) {
        console.log(data);
        fetchMessages();
      });

      fetchMessages();

      return () => {
        channel.unbind();
        pusher.unsubscribe(`new-message.${user?.id}`);
      };
    }
  }, [isLoggedIn]);

  return (
    <Box marginTop={14}>
      {messages.map((message) => (
        <div
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
          className={`row ${
            message.sender_id == user?.id ? "text-end" : "text-start"
          }`}
          key={message.id}
        >
          <div>
            <p className="p-0">{message.content}</p>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit(newMessage)}>
        <div className="row col-12 p-2">
          <div className="col-10 col-lg-11">
            <TextField
              error={Boolean(errors.message)}
              id="message"
              style={{ width: "100%" }}
              size="small"
              label="Nhập tin nhắn"
              defaultValue=""
              helperText={errors.message?.message}
              {...message("message")}
            />
            <TextField
              id="userId"
              value={userId}
              hidden
              {...message("userId")}
            />
          </div>
          <div className="col-1 mt-1 col-lg-1">
            <Button
              variant="contained"
              size="small"
              color="warning"
              type="submit"
              className="mb-2"
              disabled={!isValid}
            >
              Gửi
            </Button>
          </div>
        </div>
      </form>
    </Box>
  );
}

export default Chat;
