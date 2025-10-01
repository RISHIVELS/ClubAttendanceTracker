import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="h-screen flex flex-col gap-3 justify-center items-center ">
      <h1 className="font-bold text-3xl "> Something went wrong</h1>
      <Link className="btn btn-ghost" to="/">
        Go Back
      </Link>
    </div>
  );
};

export default Error;
