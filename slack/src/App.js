import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
import axios from "axios";
import Body from "./Body/body";

function App() {
  const [auth, setAuth] = useLocalStorage("isAuth", false);
  const [loginInfo, setLoginInfo] = useLocalStorage({
    username: "",
    password: ""
  });
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage] = useState({});
  const [Data, setData] = useState("");

  const [toggleLoginPanel, setToggle] = useState(true);
  useEffect(() => {
    axios.get("/isAuth").then((res) => {
      setAuth(res.data.isAuthenticated || false);
      if (auth) {
        axios.post("/users/login", loginInfo).then((res) => {
          setData(res.data);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const login = () => {
    axios.post("/users/login", { username, password }).then((res) => {
      setData(res.data);
      setLoginInfo({ username, password });
      setUserName("");
      setPassword("");

      if (res.status === 200) {
        axios.get("/isAuth").then((res) => setAuth(res.data.isAuthenticated));
      }
    });
  };
  const register = () => {
    console.log(profileImage);
    axios
      .post("/users/register", {
        username,
        password,
        confirmPassword,
        name,
        profileImage
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setToggle(!toggleLoginPanel);
        }
      });
  };

  return auth ? (
    <div className=" h-100 flex-column d-flex justify-content-center align-items-center p-1">
      <Body Data={Data} setAuth={setAuth} setLoginInfo={setLoginInfo} />
    </div>
  ) : (
    <>
      <div className="login-reg-panel">
        <div className="login-info-box">
          <h2>Have an account?</h2>
          <label id="label-register" htmlFor="log-reg-show">
            Login
          </label>
          <input
            type="radio"
            name="active-log-panel"
            id="log-reg-show"
            checked={toggleLoginPanel}
            onChange={() => setToggle(!toggleLoginPanel)}
          />
        </div>

        <div className="register-info-box">
          <h2>Don't have an account?</h2>
          <label id="label-login" htmlFor="log-login-show">
            Register
          </label>
          <input
            type="radio"
            name="active-log-panel"
            id="log-login-show"
            checked={!toggleLoginPanel}
            onChange={() => setToggle(!toggleLoginPanel)}
          />
        </div>

        <div className={"white-panel " + (!toggleLoginPanel && "right-log")}>
          <div
            className={
              "register-show " + (toggleLoginPanel ? null : " show-log-panel")
            }
          >
            <h2>REGISTER</h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
              />
              <label className="custom-file-label" htmlFor="customFile">
                Choose file
              </label>
            </div>
            <input
              className="mt-4"
              type="button"
              value="Register"
              onClick={() => register()}
            />
          </div>

          <div
            className={
              "login-show " + (toggleLoginPanel ? " show-log-panel" : null)
            }
          >
            <h2>LOGIN</h2>
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="button" value="Login" onClick={() => login()} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
