import React from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form className="form" action="#">
        <h1 className="form-title">Log in</h1>
        <input
          className="form-input"
          type="text"
          placeholder="Email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="text" onClick={signIn}>
          Sign In
        </button>
        <button className="btn" type="text" onClick={signInWithGoogle}>
          Sign with Google
        </button>
        <button className="btn logout" type="text" onClick={logout}>
          Logout
        </button>
      </form>
    </div>
  );
}

export default Auth;
