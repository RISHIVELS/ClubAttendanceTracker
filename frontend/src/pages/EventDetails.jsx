import { Link, useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const loader = async ({ params }) => {
  try {
    const { eventId } = params;
    console.log("Fetching event details for:", eventId);

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await axios.get(`${baseURL}/api/v1/events/${eventId}`);
    console.log("Event details response:", res.data);

    return { event: res.data.event || res.data };
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw new Response("Event not found", { status: 404 });
  }
};

const EventDetails = () => {
  const { event } = useLoaderData();
  const { eventId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "TBA";
    return timeString;
  };

  // Navigation items
  const navItems = [
    {
      to: "/",
      label: "Events",
      icon: (
        <svg
          fill="currentColor"
          height="24"
          viewBox="0 0 256 256"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,184a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm56-8a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136a23.76,23.76,0,0,1-4.84,14.45L152,176ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z"></path>
        </svg>
      ),
      active: true,
    },
    {
      to: `/events/${eventId}/attendance`,
      label: "Attendance",
      icon: (
        <svg
          fill="currentColor"
          height="24"
          viewBox="0 0 256 256"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
      ),
    },
    {
      to: `/events/${eventId}/reports`,
      label: "Reports",
      icon: (
        <svg
          fill="currentColor"
          height="24"
          viewBox="0 0 256 256"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-square btn-primary"
        >
          {isSidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-base-100 p-4 flex flex-col justify-between border-r border-base-300
        transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col gap-4">
          {/* Navigation */}
          <nav className="mt-4 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Close button for mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-outline btn-sm w-full"
          >
            Close Menu
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
                Event Details
              </h2>
              <p className="text-base-content/70 mt-1">
                View details for {event.name || "the event"}.
              </p>
            </div>
          </header>

          <div className="space-y-6">
            {/* Event Description Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-xl text-base-content mb-4">
                  {event.name || "Event Name"}
                </h3>
                <p className="text-base-content/70">
                  {event.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Location */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Location
                  </h4>
                  <p className="text-lg font-semibold text-base-content">
                    {event.location || "Location TBA"}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Date
                  </h4>
                  <p className="text-lg font-semibold text-base-content">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              {/* Club Name */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Club
                  </h4>
                  <p className="text-lg font-semibold text-base-content">
                    {event.clubName || event.club || "No Club Specified"}
                  </p>
                </div>
              </div>

              {/* Event Head */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Event Head
                  </h4>
                  <p className="text-lg font-semibold text-base-content">
                    {event.eventHead || event.organizer || "TBA"}
                  </p>
                </div>
              </div>

              {/* Capacity/Status */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Status
                  </h4>
                  <div className="badge badge-primary badge-md font-semibold">
                    {new Date(event.date) > new Date()
                      ? "Upcoming"
                      : "Completed"}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to={`/events/${eventId}/attendance`}
                className="btn btn-primary btn-lg flex-1"
              >
                Manage Attendance
              </Link>
              <Link
                to={`/events/${eventId}/reports`}
                className="btn btn-outline btn-lg flex-1"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
