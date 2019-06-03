import React, { useState } from "react";

const ChannelsList = ({ channel, index, setActiveChannel, socket }) => {
  const [deleteBtn, toggleDelet] = useState(false);
  const deleteChannel = (id) => {
    socket.emit("delete.channel", { id });
  };
  return (
    <li
      className="list-group-item rounded shadow-sm mb-2 p-1 d-flex justify-content-between align-items-center"
      onMouseOver={() => toggleDelet(true)}
      onMouseLeave={() => toggleDelet(false)}
      onClick={() => setActiveChannel(index)}
    >
      # {channel.channelName}
      <div className="mr-3">
        {deleteBtn && (
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => deleteChannel(channel._id)}
          >
            <span aria-hidden="true" style={{ color: "white" }}>
              &times;
            </span>
          </button>
        )}
        <span className="badge badge-success badge-pill">
          {channel.users.length} users
        </span>
      </div>
    </li>
  );
};
export default ChannelsList;
