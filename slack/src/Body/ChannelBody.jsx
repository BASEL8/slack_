import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import Moment from "react-moment";

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
    allowed,
    typing,
    by,
    date
  }
}) => {
  const [text, setText] = useState("");
  const [editMode, toggleEdit] = useState({
    status: false,
    value: "",
    messageId: "id"
  });
  //join room test start
  useEffect(() => {
    socket.emit("joinRoom", channelName, (newNumbersOfMembers) => {
      console.log(newNumbersOfMembers);
    });
  }, [channelName, socket]);
  //join room test end
  const mainInput = useRef();
  const [password, setPassword] = useState("");
  useEffect(() => {
    mainInput.current.focus();
  }, [editMode.status]);
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
  useEffect(() => {
    if (text.length > 0) {
      socket.emit("user writing", {
        name: Data.name,
        id: Data._id,
        channelId: _id
      });
    } else {
      socket.emit("user not writing", {
        name: Data.name,
        id: Data._id,
        channelId: _id
      });
    }
  }, [Data._id, Data.name, _id, socket, text]);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket &&
      socket.emit("channel.open", {
        _id,
        password,
        userId: Data._id,
        channelId: _id
      });
  };
  const usersTyping =
    typing.filter((u) => u.id !== Data._id).length !== 0
      ? typing.map((t) => t.name + " ") + " typing ..."
      : null;
  return (
    <>
      <h1 className="text-white border-bottom border-success d-flex justify-content-between">
        {channelName.toUpperCase()}{" "}
        <span className="basel-by">
          created by : {by} ,<Moment fromNow>{date}</Moment>
        </span>
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
        <div className="flex-grow-1 h-75">
          <div className="row h-100 w-100 m-0">
            <div className="w-100 h-100 ">
              <div className="d-flex flex-column h-100">
                <ul
                  className="list-group flex-grow-1 mb-3 pb-3 test d-flex"
                  style={{ overflowY: "scroll", height: 0 }}
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
                        bgColor={Data.color}
                      />
                    ))}
                  <li ref={messagesEndRef} />
                </ul>
                <i style={{ color: "lightgray", height: 30 }}>{usersTyping}</i>
                <form onSubmit={sendMessage}>
                  <div className="input-group shadow">
                    <input
                      ref={mainInput}
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
