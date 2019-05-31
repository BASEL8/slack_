import React, { useState } from "react";
import axios from "axios";
import ChannelsList from "./ChannelsList";
const UserInfo = ({
  userData: { _id, name, username, profileImage },
  socket,
  users,
  channels,
  setAuth,
  setLoginInfo,
  setActiveChannel
}) => {
  const [value, setValue] = useState("");
  const createChannel = () => {
    socket.emit("create channel", { channelName: value, by: name });
    setValue("");
  };
  const logOut = () => {
    axios.get("/users/logout").then((res) => {
      setAuth(res.data.isAuthenticated);
      setLoginInfo({ username: "", password: "" });
      socket.emit("loggedOut", { _id });
    });
  };
  return (
    <div className="d-flex flex-column h-75">
      <div className="d-flex justify-content-start align-items-center mb-5">
        <div className="user-logo">
          <img
            src="http://www.webcoderskull.com/img/team4.png"
            className="img-responsive"
            alt=""
          />
        </div>
        <p className="m-0 pl-2 text-white">{name}</p>
      </div>
      <div className="h-75 d-flex flex-column mb-2">
        <ul className="list-group user_info_ul h-75 flex-grow-1">
          {channels.map((channel, index) => (
            <ChannelsList
              channel={channel}
              key={channel._id}
              index={index}
              setActiveChannel={setActiveChannel}
              socket={socket}
            />
          ))}
        </ul>
        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-success text-white"
              type="button"
              onClick={() => createChannel()}
            >
              add
            </button>
          </div>
        </div>
      </div>
      <button className="btn btn-success btn-sm" onClick={() => logOut()}>
        logout
      </button>
    </div>
  );
};

export default UserInfo;
