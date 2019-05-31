import React, { useState } from "react";

const Message = ({
  channelId,
  socket,
  currentUserId,
  editMode,
  toggleEdit,
  message: { by, text, _id, date, userID, edited, Data }
}) => {
  edited && console.log(edited);
  const [info, toggleInfo] = useState(true);
  const deleteMessage = () => {
    socket.emit("delete.message", { channelId, _id });
  };
  return (
    <>
      <li
        className={
          "message-text list-group-item " +
          (currentUserId === userID && " align-self-end")
        }
        aria-disabled="true"
        onClick={() => toggleInfo(!info)}
      >
        <div
          className={
            " mb-2 mt-2 p-1 d-flex " +
            (currentUserId === userID && " flex-row-reverse  ")
          }
        >
          <div className="d-flex flex-column pt-4  bd-highlight">
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
              "d-flex justify-content-center align-items-center " +
              (currentUserId === userID ? " pr-4 " : "pl-4")
            }
          >
            {text}
          </div>
        </div>
        {false && (
          <>
            {edited && <p>edited</p>}
            <p>{by}</p>
            <p>{date}</p>
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
          </>
        )}
      </li>
    </>
  );
};

export default Message;
