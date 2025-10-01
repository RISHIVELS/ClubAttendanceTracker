import axios from "axios";
import React from "react";
import { Form, Link, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "../store";
import { setUser } from "../feature/user/userSlice";

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const res = await axios.post("/api/v1/coordinators/login", data);
    localStorage.setItem("user", JSON.stringify(res.data.coordinator));
    store.dispatch(setUser(res.data.coordinator));
    toast.success("Login successful.");
    return redirect("/");
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
    redirect("/login");
  }
};

const Login = () => {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <Form className="p-10 bg-white" method="POST">
          <h2 className="text-center font-bold text-2xl mb-2">
            Coordinator Login
          </h2>
          <span className="text-center block text-neutral-500 text-sm mb-3">
            Fill out the form below to login
          </span>

          <div className="form-control mb-3">
            <label className="label mb-1">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Username"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-3">
            <label className="label mb-1">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-6">
            <label className="label mb-1">
              <span className="label-text">Secretkey</span>
            </label>
            <input
              type="password"
              name="secretKey"
              placeholder="secretkey"
              className="input input-bordered"
            />
          </div>

          <button className="btn btn-primary w-80 block mb-4" type="submit">
            Login
          </button>
          <Link className="btn btn-neutral-900 w-80" to="/register">
            Register
          </Link>
        </Form>
      </div>
    </>
  );
};

export default Login;
