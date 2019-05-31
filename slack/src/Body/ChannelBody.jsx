import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
const ChannelBody = ({
  Data,
  userName,
  socket,
  activeChannel: { users, _id, channelName, messages }
}) => {
  console.log(messages);
  const [text, setText] = useState("");
  const [editMode, toggleEdit] = useState({
    status: false,
    value: "",
    messageId: "id"
  });
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
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    socket && socket.emit("reset.unread.messages", { _id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  return (
    <>
      <h1 className="text-white">{channelName.toUpperCase()}</h1>
      <div className="flex-grow-1">
        <div className="row h-100">
          <div className="w-100 h-100">
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
    </>
  );
};

export default ChannelBody;
