'use client';
import { useRouter } from "next/navigation"; 
import { auth, db, googleProvider, githubProvider } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
    rePassword: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Re-entering password is required"),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const { uid } = userCredential.user;

      await setDoc(doc(db, "users", uid), {
        email: values.email,
        createdAt: new Date().toISOString(),
      });

      toast.success("Signup successful!");
      router.push("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please use a different email.");
      } else {
        toast.error("Signup error: " + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthSignup = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { uid, email } = user;

      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date().toISOString(),
      });

      toast.success("Signup successful!");
      router.push("/");
    } catch (err) {
      toast.error("OAuth signup error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer /> 
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
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
              <div>
                <Field
                  type="password"
                  name="rePassword"
                  placeholder="Re-enter Password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="rePassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                {isSubmitting ? "Signing up..." : "Signup"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="my-4 text-center">or</div>
        <button
          onClick={() => handleOAuthSignup(googleProvider)}
          className="w-full bg-red-500 text-white py-2 rounded-md mb-2"
        >
          Signup with Google
        </button>
        <button
          onClick={() => handleOAuthSignup(githubProvider)}
          className="w-full bg-gray-800 text-white py-2 rounded-md"
        >
          Signup with GitHub
        </button>
      </div>
    </div>
  );
};

export default Signup;
