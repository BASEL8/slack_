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
  const [protectedChannel, toggleCheckbox] = useState(false);
  const [password, setPassword] = useState("");
  const createChannel = (e) => {
    e.preventDefault();
    socket.emit("create channel", {
      channelName: value,
      by: name,
      protectedChannel,
      password
    });
    setValue("");
    setPassword("");
    toggleCheckbox(false);
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
      <div className="d-flex justify-content-start align-items-center mb-5 mt-3">
        <div className="user-logo">
          <img
            src="http://www.webcoderskull.com/img/team4.png"
            className="img-responsive"
            alt=""
          />
        </div>
        <p className="m-0 pl-2 text-white">{name}</p>
      </div>
      <h4 className="text-white">Channels</h4>
      <div className="pb-4 pt-2 h-75 d-flex flex-column mb-2 border-top border-success border-bottom">
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
        <form onSubmit={(e) => createChannel(e)}>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control mb-1"
              placeholder="name"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          {protectedChannel && (
            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="password"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <div className="custom-control custom-checkbox pt-2">
            <input
              type="checkbox"
              className="custom-control-input"
              id="defaultUnchecked"
              checked={protectedChannel}
              onChange={() => toggleCheckbox(!protectedChannel)}
            />
            <label
              className="custom-control-label text-white"
              htmlFor="defaultUnchecked"
            >
              protect with password
            </label>
          </div>
          <div className="input-group mt-2">
            <button className="btn btn-success btn-sm w-100">add</button>
          </div>
        </form>
      </div>

      <button className="btn btn-success btn-sm mt-5" onClick={() => logOut()}>
        logout
      </button>
    </div>
  );
};

export default UserInfo;
