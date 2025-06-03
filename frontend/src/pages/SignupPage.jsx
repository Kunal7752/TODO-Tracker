import React from "react";
import { useState } from "react";
import useSignUp from "../hooks/UseSignUp.js";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isPending, isSuccess, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };
  console.log("Signup Data:", signupData);
  return (
    <div
      className="flex flex-col items-center justify-center h-screen "
      data-theme="dark"
    >
      <div className="card w-96 bg-base-100 shadow-xl border-x-fuchsia-50 border-y-fuchsia-50 border-2">
        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4 items-center mt-5 mb-5"
        >
          <span className="items-center">
            <h1 className="text-lg">Welcome to TaskMate</h1>
          </span>
          <input
            type="text"
            placeholder="Name"
            value={signupData.name}
            onChange={(e) =>
              setSignupData({ ...signupData, name: e.target.value })
            }
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="email"
            placeholder="Email"
            value={signupData.email}
            onChange={(e) =>
              setSignupData({ ...signupData, email: e.target.value })
            }
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
            className="input input-bordered w-full max-w-xs"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
        { isSuccess && (
          <div className="toast toast-top">
            <div className="alert alert-info">
              <span>Sign up successful.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
