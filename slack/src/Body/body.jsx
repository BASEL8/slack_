import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "./UserInfo";
import socketIOClient from "socket.io-client";
import Users from "./Users";
import ChannelBody from "./ChannelBody";
let socket = null;
const Body = ({ Data, setAuth, setLoginInfo }) => {
  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState(0);

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
    socket.emit("logggedIn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="row h-100 w-100">
      <div className="col-md-2 h-100">
        <UserInfo
          userData={Data}
          socket={socket}
          channels={channels}
          users={users}
          setAuth={setAuth}
          setLoginInfo={setLoginInfo}
          setActiveChannel={setActiveChannel}
        />
      </div>
      <div className="col-md-8 d-flex flex-column">
        {channels[activeChannel] ? (
          <ChannelBody
            activeChannel={channels[activeChannel]}
            socket={socket}
            Data={Data}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100 text-white">
            <h1>Chose Channel to start </h1>
          </div>
        )}
      </div>
      <div className="col-md-2 h-100">
        <Users
          users={users}
          currentUser={Data._id}
          activeChannelUsers={channels[activeChannel]}
        />
      </div>
    </div>
  );
};

export default Body;
