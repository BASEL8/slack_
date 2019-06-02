import React from "react";
import "./users.css";
const Users = ({ users, currentUser, activeChannelUsers }) => {
  return (
    <div className="card-body contacts_body h-100">
      <h4 className="text-white">Users</h4>
      <ul className="contacts h-100 border-top border-success  pt-2">
        {activeChannelUsers &&
          activeChannelUsers.users
            .sort(function(x, y) {
              return x.status === y.status ? 0 : x ? -1 : 1;
            })
            .map((user) => {
              if (user._id !== currentUser) {
                return users.map((u) => {
                  if (user._id === u._id) {
                    return (
                      <li key={user._id}>
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              alt=""
                              src={user.img}
                              className="rounded-circle user_img"
                            />
                            <span
                              className={
                                "online_icon " +
                                (u.status ? " online" : " offline")
                              }
                            />
                          </div>
                          <div className="user_info">
                            <span>{user.name}</span>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  return null;
                });
              }
              return null;
            })}
      </ul>
    </div>
  );
};

export default Users;
/*
(
                  <li key={user._id}>
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <img
                          alt=""
                          src={user.img}
                          className="rounded-circle user_img"
                        />
                        <span
                          className={
                            "online_icon " +
                            (user.status ? " online" : " offline")
                          }
                        />
                      </div>
                      <div className="user_info">
                        <span>{user.name}</span>
                        <p>Sahar left 7 mins ago</p>
                      </div>
                    </div>
                  </li>
                );
*/
