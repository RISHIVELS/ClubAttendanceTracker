import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";

export const loader = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await axios.get(`${baseURL}/api/v1/events`);

    if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
      throw new Error(
        "Server returned HTML instead of JSON. Backend might be down."
      );
    }

    return { events: res.data.events || [], error: null };
  } catch (error) {
    console.error("Error fetching events:", error);

    let errorMessage = "Failed to load events";

    if (error.response) {
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage =
        "No response from server. Please check if backend is running.";
    } else {
      errorMessage = error.message || "Unknown error occurred";
    }

    return { events: [], error: errorMessage };
  }
};

const Landing = () => {
  const { events, error } = useLoaderData();

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "TBA";
    return timeString;
  };

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div
          className="hero min-h-[60vh] rounded-xl mb-12"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuArAx-Qjt1hTdOSBOW2U8MdsfbbrC-84_Cx34uMDVEqDSlYJoj4iwi2Im5JnOxdyLRK-S0456lZtR3Fq2YnlRFADdypq-rKpiX60InHO2V8csBiZHgYBGaNRjfmpVdil-5zzS6_nPX-niS0UNyu8zr_Gm4u_NLqE8pfiyoBsANxuw0aKOrIkBk8MDpOCnfFshNIe65ynaQaQGz1J4bKRVn2OquIbwT6KM8QNNNNBTwAzT_RLx53uZ9tbtatjJYXs4kMe6vCe3lYoLM")`,
          }}
        >
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-2xl">
              <h1 className="mb-5 text-4xl md:text-5xl lg:text-6xl font-bold">
                Welcome to Club Hub
              </h1>
              <p className="mb-8 text-lg md:text-xl opacity-90">
                Your go-to platform for managing club events and registrations.
                Join us and be part of a vibrant community!
              </p>
              <Link
                to="/events/register"
                className="btn btn-primary btn-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Register for an Event
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Events
            </h2>
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              Track Your Club Events and manage the Participants Records
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-error/20 rounded-lg max-w-md mx-auto">
                <p className="text-error-content text-sm font-medium">
                  {error}
                </p>
                <p className="text-error-content/70 text-xs mt-2">
                  Please make sure your backend server is running on port 5000.
                </p>
              </div>
            )}

            {/* No Events Message */}
            {!error && events.length === 0 && (
              <div className="mt-4 p-4 bg-warning/20 rounded-lg max-w-md mx-auto">
                <p className="text-warning-content text-sm">
                  No events found. Events will appear here once they are
                  created.
                </p>
              </div>
            )}
          </div>

          {events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id || event.id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 border border-base-300 group"
                >
                  <div className="card-body p-6">
                    {/* Event Name - Large and Bold */}
                    <h3 className="card-title text-xl font-bold text-base-content mb-3 leading-tight">
                      {event.eventName || event.name || "Untitled Event"}
                    </h3>

                    {/* Event Details Grid */}
                    <div className="space-y-3 mb-4">
                      {/* Club Name */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-base-content"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content">
                            Club
                          </p>
                          <p className="text-sm text-base-content/70">
                            {event.clubName ||
                              event.club ||
                              "No Club Specified"}
                          </p>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-base-content"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content">
                            Date & Time
                          </p>
                          <p className="text-sm text-base-content/70">
                            {formatDate(event.date || event.eventDate)} •{" "}
                            {formatTime(event.time || event.eventTime)}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-base-content"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content">
                            Location
                          </p>
                          <p className="text-sm text-base-content/70">
                            {event.location || event.venue || "Location TBA"}
                          </p>
                        </div>
                      </div>

                      {/* Event Head */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-base-content"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content">
                            Event Head
                          </p>
                          <p className="text-sm text-base-content/70">
                            {event.eventHead ||
                              event.organizer ||
                              event.coordinator ||
                              "TBA"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-base-content/70 text-sm leading-relaxed">
                        {event.description ||
                          event.eventDescription ||
                          "No description available."}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <div className="card-actions">
                      <Link
                        to={`/events/${event._id || event.id}`}
                        className="btn btn-primary btn-sm w-full hover:bg-blue-400 hover:border-blue-400 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="text-center py-6 border-t border-base-300">
          <div className="flex flex-col items-center gap-2">
            <p className="text-base-content/70 text-sm">
              © {new Date().getFullYear()} Club Hub. All rights reserved.
            </p>
            <p className="text-base-content/50 text-xs">
              Designed and developed by{" "}
              <span className="font-medium text-base-content/70">
                RISHIVEL S
              </span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Landing;
