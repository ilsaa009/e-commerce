'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { auth } from "./firebase"; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      router.push("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email. Please check the email or sign up.");
      } else {
        setError("Login error: " + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User logged in with Google:", user);
      router.push("/"); 
    } catch (err) {
      setError("Google Login error: " + err.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log("User logged in with GitHub:", user);
      router.push("/");
    } catch (err) {
      setError("GitHub Login error: " + err.message);
    }
  };
  
  const user = auth.currentUser;
if (user) {
  console.log("User is logged in:", user);
} else {
  console.log("User is not logged in.");
}

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Login with Email
          </button>
          </form>
          <div className="my-4 text-center">or</div>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-md mb-2"
        >
          Login with Google
        </button>
        <button
          onClick={handleGithubLogin}
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
