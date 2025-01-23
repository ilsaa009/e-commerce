'use client';
import { useRouter } from "next/navigation"; 
import { auth } from "./firebase"; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const Login = () => {
  const router = useRouter();

  const handleLogin = async (values, { setSubmitting }) => {
    const { email, password } = values;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid Credentials. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email. Please check the email or sign up.");
      } else {
        toast.error("Login error: " + err.message);
      }
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in with Google:", result.user);
      toast.success("Logged in with Google!");
      router.push("/"); 
    } catch (err) {
      if (err.code === "auth/unauthorized-domain") {
        toast.error("Invalid domain");
      }else {
      toast.error("Google Login error: " + err.message);
      }
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("User logged in with GitHub:", result.user);
      toast.success("Logged in with GitHub!");
      router.push("/");
    } catch (err) {
      toast.error("GitHub Login error: " + err.message);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                {isSubmitting ? "Logging in..." : "Login with Email"}
              </button>
            </Form>
          )}
        </Formik>
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
      <ToastContainer />
    </div>
  );
};

export default Login;
