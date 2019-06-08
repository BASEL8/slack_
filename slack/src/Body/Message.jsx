import React, { useState } from "react";
import Moment from "react-moment";
import "../../node_modules/bootstrap/dist/css/fa.css";
const Message = ({
  bgColor,
  channelId,
  socket,
  currentUserId,
  editMode,
  toggleEdit,
  message: { by, text, _id, date, userID, edited }
}) => {
  const [info, toggleInfo] = useState(false);
  const [tools, toggleTools] = useState(false);
  const deleteMessage = () => {
    socket.emit("delete.message", { channelId, _id });
  };
  console.log(new Date(date).toLocaleString());
  return (
    <>
      <li
        className={
          "message-text list-group-item position-relative " +
          (currentUserId === userID ? " align-self-end" : "")
        }
        aria-disabled="true"
        onMouseOver={() => toggleInfo(true)}
        onMouseLeave={() => {
          toggleInfo(false);
          toggleTools(false);
        }}
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
              "d-flex justify-content-start align-items-center w-100 rounded-pill h-100 p-2 position-relative shadow " +
              (currentUserId === userID ? " pl-4 mr-3 " : "pl-4 ml-3 ")
            }
            style={{ background: "#272727" }}
          >
            {text}

            {info && (
              <>
                <div
                  className="m-0 position-absolute"
                  style={{
                    top: -25,
                    right: currentUserId === userID ? "15px" : "unset",
                    left: currentUserId !== userID ? "15px" : "unset"
                  }}
                >
                  <Moment fromNow={true}>{date}</Moment>
                </div>
                <p
                  className="m-0 basel-info position-absolute border rounded-circle border-success"
                  style={{
                    width: 15,
                    height: 15,
                    fontSize: 10,
                    textAlign: "center",
                    top: 11,
                    right: currentUserId !== userID ? "-19px" : "unset",
                    left: currentUserId === userID ? "-19px" : "unset"
                  }}
                  onClick={() => toggleTools(true)}
                >
                  i
                </p>
              </>
            )}
          </div>
        </div>
        {tools && (
          <div
            className={
              "d-flex justify-content-start align-items-center w-50 position-absolute " +
              (currentUserId !== userID ? "float-right" : "float-left")
            }
            style={{ top: 75, left: 25 }}
          >
            {currentUserId === userID && (
              <>
                <i
                  className="mr-2 tools delete"
                  onClick={() => deleteMessage()}
                >
                  Delete
                </i>
                <i
                  className="mr-2 tools"
                  onClick={() =>
                    toggleEdit({
                      value: text,
                      status: !editMode.status,
                      messageId: _id
                    })
                  }
                >
                  Edit
                </i>
              </>
            )}
            {edited && (
              <p className="m-0 mr-5 ml-5">
                <span className="text-success">&#10003; </span> Edited
              </p>
            )}
          </div>
        )}
      </li>
    </>
  );
};

export default Message;
