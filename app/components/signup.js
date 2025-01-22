'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { auth, db, googleProvider, githubProvider} from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); 

    if (password !== rePassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date().toISOString(),
      });

      router.push("/"); 
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else {
        setError("Signup error: " + err.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const { uid, email } = user;

      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date().toISOString(),
      });

      router.push("/"); 
    } catch (err) {
      if (err.code === "auth/user-cancelled") {
        setError("User denied permission");
      } else {
        setError("Signup error: " + err.message);
      }
    }
  };

  const handleGithubSignup = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const { uid, email } = user;

      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date().toISOString(),
      });

      router.push("/");
    } catch (err) {
      if (err.code === "auth/user-cancelled") {
        setError("User denied permission");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("Account exists with different credentials");
      } else {
        setError("Signup error: " + err.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Signup
          </button>
        </form>
        <div className="my-4 text-center">or</div>
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-red-500 text-white py-2 rounded-md mb-2"
        >
          Signup with Google
        </button>
        <button
          onClick={handleGithubSignup}
          className="w-full bg-gray-800 text-white py-2 rounded-md"
        >
          Signup with GitHub
        </button>
      </div>
    </div>
  );
};

export default Signup;
