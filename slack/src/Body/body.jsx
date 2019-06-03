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
    axios.post("/channels", { data: { userId: Data.id } }).then((res) => {
      setChannels(res.data.channels);
      setUsers(res.data.users);
    });
    socket = socketIOClient("http://localhost:3001/");
    socket &&
      socket.on("update", (data) => {
        axios.post("/channels", { userId: Data._id }).then((res) => {
          setChannels(res.data.channels);
          setUsers(res.data.users);
        });
      });
    socket.emit("loggedIn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      socket.off("update");
    };
  }, [Data._id, Data.id]);
  return (
    <div className="row h-100 w-100">
      <div className="col-md-2 h-100 border-right border-success pr-2">
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
          <div className="d-flex justify-content-center align-items-center h-100 text-white flex-column">
            <h1>Chose Channel to start or</h1>
            <h1 className="text-success">start one !</h1>
          </div>
        )}
      </div>
      <div className="col-md-2 h-100 border-left border-success">
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
