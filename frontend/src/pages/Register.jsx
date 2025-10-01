import React from "react";
import { Form, Link, redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const res = await axios.post("/api/v1/coordinators/register", data);
    toast.success("Coordinator registered successfully.");
    return redirect("/login");
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
    return redirect("/register");
  }
};

const Register = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <Form className="p-10 bg-white" method="POST">
        <h2 className="text-center font-bold text-2xl mb-2">
          Coordinator Registration
        </h2>
        <span className="text-center block text-neutral-500 text-sm mb-3">
          Fill out the form below to register
        </span>
        <div className="form-control mb-3">
          <label className="label mb-1">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
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
        <div className="form-control mb-3">
          <label className="label mb-1">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="input input-bordered"
          />
        </div>
        <div className="form-control mb-3">
          <label className="label mb-1">
            <span className="label-text">Year</span>
          </label>
          <select
            name="year"
            className="select select-ghost border border-2 border-neutral-300"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="form-control mb-6">
          <label className="label mb-1">
            <span className="label-text">Department</span>
          </label>
          <input
            type="text"
            name="department"
            placeholder="Department"
            className="input input-bordered"
          />
        </div>

        <button className="btn btn-primary w-80 block mb-4" type="submit">
          Register
        </button>
        <Link className="btn btn-neutral-900 w-80" to="/login">
          Login
        </Link>
      </Form>
    </div>
  );
};

export default Register;
