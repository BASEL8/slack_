import React, { useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
let socket = socketIOClient("http://localhost:3001/");

const Body = () => {
  useEffect(() => {
    axios.get("/messages").then((res) => console.log(res));
    socket.emit("hello", { name: "basel" });
  }, []);
  return <h1>body</h1>;
};

export default Body;
