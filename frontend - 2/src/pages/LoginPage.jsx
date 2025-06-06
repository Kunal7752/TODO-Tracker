import React from "react";
import { login } from "../lib/api";
import useLogin from "../hooks/UseLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const { isPending, isSuccess, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  console.log("Login Data:", loginData);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen "
      data-theme="dark"
    >
      <div className="card w-96 bg-base-100 shadow-xl border-x-fuchsia-50 border-y-fuchsia-50 border-2">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 items-center mt-5 mb-5"
        >
          <span className="items-center">
            <h1 className="text-lg">Login</h1>
          </span>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="input input-bordered w-full max-w-xs"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
        {isSuccess && (
          <div className="toast toast-top">
            <div className="alert alert-info">
              <span>Login successful.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
