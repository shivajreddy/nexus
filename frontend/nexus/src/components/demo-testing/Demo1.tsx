import { useRef, useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/redux/hooks";
import { setAuthState } from "@/features/auth/authSlice";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/features/api/api";

function Demo1() {
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("shiva2@eagleofva.com");
  const [pwd, setPwd] = useState("secret");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      console.log("making login with", user, pwd);

      const formData = new FormData();
      formData.append("username", user);
      formData.append("password", pwd);
      console.log("🔥this is the form data", formData);

      const userData = await login(formData).unwrap();
      // const userData = await login({ user, pwd }).unwrap();
      dispatch(setAuthState({ ...userData, user }));
      setUser("");
      setPwd("");
      navigate("/");
    } catch (error) {
      if (!error?.originalStatus) {
        setErrMsg("No server response");
      } else if (error.originalStatus?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (error.originalStatus?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleAxios = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", user);
    formData.append("password", pwd);

    const resp = axios({
      method: "POST",
      url: BASE_URL + "/auth/login",
      data: formData,
      // headers: { "Content-Type": "multipart/form-data" },
      headers: { "Content-Type": "application/json" },
    });

    console.log("resp from axios", resp);
  };

  const handleUserInput = (e) => setUser(e.target.value);
  const handlePwdInput = (e) => setPwd(e.target.value);

  return (
    <div className="border-4">
      <p className="text-4xl">Demo</p>

      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-label
      ></p>
      <h1> Login </h1>
      <form onSubmit={handleSumbit}>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          value={user}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={handlePwdInput}
          value={pwd}
          required
        />
        <button type="submit">sign in</button>
        <button onClick={handleAxios}>axios sign in</button>
      </form>
    </div>
  );
}

export default Demo1;
