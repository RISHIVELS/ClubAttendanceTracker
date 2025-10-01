import { Form, redirect, useActionData } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();

    const eventData = {
      name: formData.get("name"),
      eventHead: formData.get("eventHead"),
      email: formData.get("email"),
      clubName: formData.get("clubName"),
      location: formData.get("location"),
      description: formData.get("description"),
      date: formData.get("date"),
    };

    const res = await axios.post("/api/v1/events", eventData);

    toast.success("Event created successfully!");
    return redirect("/");
  } catch (error) {
    console.error("Event creation error:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Event creation failed. Please try again.";
    toast.error(errorMessage);
    return { error: errorMessage };
  }
};

const EventRegister = () => {
  const actionData = useActionData();

  return (
    <div className="min-h-screen bg-base-200 dark:bg-base-300 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-base-content">
                Create New Event
              </h2>
              <p className="mt-2 text-base-content/70">
                Fill out the form below to create a new event.
              </p>
            </div>

            {actionData?.error && (
              <div className="alert alert-error mb-6">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{actionData.error}</span>
              </div>
            )}

            <Form method="POST" className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Event Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Tech Talk: AI in Business"
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Event Head *
                  </span>
                </label>
                <input
                  type="text"
                  name="eventHead"
                  placeholder="e.g., John Doe"
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Contact Email *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="event-coordinator@example.com"
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Club Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="clubName"
                    placeholder="e.g., Google Developers Community"
                    className="input input-bordered w-full focus:input-primary"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Location *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Main Auditorium"
                    className="input input-bordered w-full focus:input-primary"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Event Date *
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered w-full focus:input-primary"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Event Description *
                  </span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your event... e.g., A classy coding competition for developers to showcase their skills."
                  className="textarea textarea-bordered w-full focus:textarea-primary h-24"
                  required
                />
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full hover:bg-blue-400 hover:border-blue-400 transition-colors"
                >
                  Create Event
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegister;
