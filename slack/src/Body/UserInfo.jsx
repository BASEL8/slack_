import React, { useState } from "react";

const UserInfo = ({
  userData: { _id, name, username, profileImage },
  socket,
  users,
  channels
}) => {
  const [value, setValue] = useState("");
  const createChannel = () => {
    socket.emit("create channel", { channelName: value, by: name });
  };
  return (
    <>
      <h3>{name}</h3>
      <ul>
        {channels.map((channel) => (
          <li key={channel._id}>{channel.channelName}</li>
        ))}
      </ul>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => createChannel()}>create</button>
    </>
  );
};

export default UserInfo;
