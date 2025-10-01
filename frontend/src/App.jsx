import {
  createBrowserRouter,
  Link,
  Router,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Landing from "./pages/Landing";
import EventDetails from "./pages/EventDetails";
import EventRegister from "./pages/EventRegister";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Error from "./pages/Error";
import { store } from "./store";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as eventRegisterAction } from "./pages/EventRegister";
import { loader as eventLoader } from "./pages/Landing";
import { loader as eventDetailsLoader } from "./pages/EventDetails";
import { loader as eventReportLoader } from "./pages/Reports";

import { Provider } from "react-redux";

import About from "./pages/About";
import Attendance from "./pages/Attendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    hydrateFallbackElement: (
      <>
        <div>Loading...</div>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        ),
        loader: eventLoader,
      },
      {
        path: "events/:eventId",
        element: (
          <ProtectedRoute>
            <EventDetails />,
          </ProtectedRoute>
        ),
        loader: eventDetailsLoader,
      },
      {
        path: "events/register",
        element: (
          <ProtectedRoute>
            {" "}
            <EventRegister />
          </ProtectedRoute>
        ),
        action: eventRegisterAction,
      },
      {
        path: "about",
        element: (
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        ),
      },
      {
        path: "events/:eventId/reports",
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        ),
        loader: eventReportLoader,
      },
      {
        path: "events/:eventId/attendance",
        element: (
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
    errorElement: (
      <div className="font-bold text-4xl grid place-content-center min-h-screen">
        <h1>There was an error</h1>
        <Link to="/login" className="btn  btn-primary mt-5 font-xl">
          Go back to Login
        </Link>
      </div>
    ),
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: (
      <div className="font-bold text-4xl grid place-content-center min-h-screen">
        <h1>There was an error</h1>
        <Link to="/login" className="btn  btn-primary mt-5 font-xl">
          Go back to Login
        </Link>
      </div>
    ),
    action: loginAction,
  },
]);

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
