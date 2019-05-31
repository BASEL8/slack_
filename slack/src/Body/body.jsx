import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "./UserInfo";
import socketIOClient from "socket.io-client";
let socket = null;
const Body = ({ Data }) => {
  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/channels").then((res) => {
      setChannels(res.data.channels);
      setUsers(res.data.users);
    });
    socket = socketIOClient("http://localhost:3001/");
    socket &&
      socket.on("update", (data) => {
        console.log("update request");
        axios.get("/channels").then((res) => {
          setChannels(res.data.channels);
          setUsers(res.data.users);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const emit = () => {
    socket.emit("hello", { name: "basel" });
  };
  console.log(channels, users);
  return (
    <div className="row h-100 w-100">
      <div className="col-md-2">
        <UserInfo
          userData={Data}
          socket={socket}
          channels={channels}
          users={users}
        />
      </div>
      <div className="col-md-8">
        <button onClick={() => emit()}>t</button>
      </div>
      <div className="col-md-2">activeusers</div>
    </div>
  );
};

export default Body;
