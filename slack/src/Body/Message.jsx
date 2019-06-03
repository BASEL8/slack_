import React, { useState } from "react";

const Message = ({
  bgColor,
  channelId,
  socket,
  currentUserId,
  editMode,
  toggleEdit,
  message: { by, text, _id, date, userID, edited, Data, color }
}) => {
  console.log(color);
  const [info, toggleInfo] = useState(true);
  const deleteMessage = () => {
    socket.emit("delete.message", { channelId, _id });
  };
  return (
    <>
      <li
        className={
          "message-text list-group-item  " +
          (currentUserId === userID ? " align-self-end" : "")
        }
        aria-disabled="true"
        onClick={() => toggleInfo(!info)}
      >
        <div
          className={
            " mb-2 mt-2 p-1 d-flex justify-content-center align-items-center " +
            (currentUserId === userID ? " flex-row-reverse  " : "")
          }
        >
          <div className="d-flex flex-column pt-4 bd-highlight">
            <div className="img_cont">
              <img alt="" className="rounded-circle user_img" />
              <span />
            </div>
            <div className="user_info m-0">
              <span>{by}</span>
            </div>
          </div>
          <div
            className={
              "d-flex justify-content-start align-items-center w-100 rounded-pill h-100 p-2  shadow " +
              (currentUserId === userID ? " pl-4 mr-3 " : "pl-4 ml-3 ")
            }
            style={{ background: color }}
          >
            {text}
          </div>
        </div>
        {true && (
          <div
            className={
              "d-flex justify-content-between align-items-center w- " +
              (currentUserId !== userID ? "float-right" : "float-left")
            }
          >
            {currentUserId === userID && (
              <div>
                <button
                  className="btn btn-sm bg-danger"
                  onClick={() => deleteMessage()}
                >
                  d
                </button>
                <button
                  className="btn btn-sm bg-primary"
                  onClick={() =>
                    toggleEdit({
                      value: text,
                      status: !editMode.status,
                      messageId: _id
                    })
                  }
                >
                  e
                </button>
              </div>
            )}
            {edited && <p className="m-0 mr-5 ml-4">Edited</p>}
            <p className="m-0">{date}</p>
          </div>
        )}
      </li>
    </>
  );
};

export default Message;
