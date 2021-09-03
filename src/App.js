import Amplify, { Auth } from "aws-amplify";
import React, { useState } from "react";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

const DATA_FIELDS = {
  USERNAME: "username",
  EMAIL: "email",
  PASSWORD: "password",
  PHONE_NUMBER: "phoneNumber",
  CODE: "code",
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);

  const onChange = (e) => {
    switch (e.target.name) {
      case DATA_FIELDS.USERNAME:
        setUsername(e.target.value);
        break;
      case DATA_FIELDS.PASSWORD:
        setPassword(e.target.value);
        break;
      case DATA_FIELDS.EMAIL:
        setEmail(e.target.value);
        break;
      case DATA_FIELDS.PHONE_NUMBER:
        setPhoneNumber(e.target.value);
        break;
      case DATA_FIELDS.CODE:
        setCode(e.target.value);
        break;

      default:
        break;
    }
  };

  const signUp = async () => {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
          phone_number: phoneNumber, // optional - E.164 number convention
          // other custom attributes
        },
      });
      console.log(user);
      if (user) {
        await resendConfirmationCode();
        setStep(1);
      }
    } catch (error) {
      console.log("error signing up:", error);
    }
  };

  const resendConfirmationCode = async () => {
    try {
      await Auth.resendSignUp(username);
      console.log("code resent successfully");
    } catch (err) {
      console.log("error resending code: ", err);
    }
  };

  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(username, code);
      setStep(2);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  };

  const signIn = async () => {
    try {
      const user = await Auth.signIn(username, password);
      console.log("Sign In Success: ", user);
      setStep(3);
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <div>
      <h1>Authentication flow</h1>
      {step === 3 && <div onClick={signOut}>Sign out</div>}
      {step === 2 && (
        <>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          <button type="button" onClick={signIn}>
            Sign In
          </button>
        </>
      )}
      {step === 1 && (
        <>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
          />
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Code"
            value={code}
            onChange={onChange}
          />
          <button type="button" onClick={confirmSignUp}>
            Confirm signup
          </button>
        </>
      )}
      {step === 0 && (
        <>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={onChange}
          />
          <input
            type="text"
            id="phoneNumber"
            placeholder="Phone number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
          />
          <button type="button" onClick={signUp}>
            Sign up
          </button>
        </>
      )}
    </div>
  );
};

export default App;
