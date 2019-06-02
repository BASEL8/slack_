import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
const ChannelBody = ({
  Data,
  userName,
  socket,
  activeChannel: {
    users,
    _id,
    channelName,
    messages,
    protectedChannel,
    allowed
  }
}) => {
  console.log(messages);
  const [text, setText] = useState("");
  const [editMode, toggleEdit] = useState({
    status: false,
    value: "",
    messageId: "id"
  });
  const [password, setPassword] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    if (editMode.status) {
      socket.emit("edit.message", {
        channelId: _id,
        _id: editMode.messageId,
        value: editMode.value
      });
      toggleEdit({
        status: false,
        value: "",
        messageId: "id"
      });
    } else {
      socket.emit("message.sent", {
        _id,
        text,
        by: Data.name,
        userID: Data._id,
        Data
      });
      setText("");
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    protectedChannel
      ? allowed.includes(Data._id) &&
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      : messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password);
    socket && socket.emit("channel.open", { _id, password, userId: Data._id });
  };
  return (
    <>
      <h1 className="text-white border-bottom border-success">
        {channelName.toUpperCase()}
      </h1>
      {!allowed.includes(Data._id) && protectedChannel ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="form-inline h-100 w-100 d-flex justify-content-center align-items-center"
        >
          <div className="input-group w-50 mb-2">
            <label className="" htmlFor="inlineFormInputName2">
              Name
            </label>
            <input
              type="Password"
              className="form-control mb-2 border-0"
              id="inlineFormInputName2"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button type="submit" className="btn btn-danger mb-2 btn-basel">
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="flex-grow-1">
          <div className="row h-100 w-100 m-0">
            <div className="w-100 h-100 ">
              <div className="d-flex flex-column h-100">
                <ul
                  className="list-group flex-grow-1 mb-3 pb-3 test d-flex"
                  style={{ height: 0, overflowY: "scroll" }}
                >
                  {messages &&
                    messages.map((message) => (
                      <Message
                        key={message._id}
                        message={message}
                        channelId={_id}
                        socket={socket}
                        currentUserId={Data._id}
                        toggleEdit={toggleEdit}
                        editMode={editMode}
                      />
                    ))}
                  <li ref={messagesEndRef} />
                </ul>
                <form onSubmit={sendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control p-4"
                      placeholder="Enter message"
                      onChange={(e) => {
                        editMode.status
                          ? toggleEdit({
                              value: e.target.value,
                              status: editMode.status,
                              messageId: editMode.messageId
                            })
                          : setText(e.target.value);
                      }}
                      value={editMode.status ? editMode.value : text}
                    />
                    {editMode.status ? (
                      <button
                        className="btn btn-outline-success text-white btn-basel"
                        type="submit"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-outline-success text-white btn-basel"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChannelBody;
