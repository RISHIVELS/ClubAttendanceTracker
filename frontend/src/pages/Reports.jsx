import { useLoaderData, Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import jsPDF from "jspdf";

export const loader = async ({ params }) => {
  try {
    const { eventId } = params;
    console.log("Fetching reports for event:", eventId);

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await axios.get(`${baseURL}/api/v1/analytics/${eventId}`);
    console.log("Reports response:", res.data);

    return { reports: res.data };
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Response("Reports not found", { status: 404 });
  }
};

const Reports = () => {
  const { reports } = useLoaderData();
  const { eventId } = useParams();

  // Chart data for attendance distribution
  const attendanceData = [
    { name: "Present", value: reports.presentTeamsCount, color: "#4ade80" },
    { name: "Absent", value: reports.absentTeamsCount, color: "#f87171" },
  ];

  // Chart data for team details
  const teamData = reports.totalTeams.map((team) => ({
    name: team.teamName,
    present: team.isPresent ? 1 : 0,
    absent: team.isPresent ? 0 : 1,
    leader: team.leaderName,
  }));

  const COLORS = ["#4ade80", "#f87171"];

  // Function to export PDF
  const exportToPDF = async () => {
    try {
      // Show loading state
      const button = document.querySelector(".export-pdf-btn");
      const originalText = button.innerHTML;
      button.innerHTML = `
      <span class="loading loading-spinner loading-sm"></span>
      Generating PDF...
    `;
      button.disabled = true;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text(
        `Attendance Report - ${reports.event || "Event"}`,
        pageWidth / 2,
        20,
        { align: "center" }
      );

      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      // Add statistics section
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Attendance Summary", 20, 50);

      pdf.setFontSize(12);
      pdf.text(`Total Teams: ${reports.totalTeamsCount}`, 20, 65);
      pdf.text(`Present Teams: ${reports.presentTeamsCount}`, 20, 75);
      pdf.text(`Absent Teams: ${reports.absentTeamsCount}`, 20, 85);

      // Calculate percentages
      const presentPercentage =
        reports.totalTeamsCount > 0
          ? (
              (reports.presentTeamsCount / reports.totalTeamsCount) *
              100
            ).toFixed(1)
          : 0;
      const absentPercentage =
        reports.totalTeamsCount > 0
          ? (
              (reports.absentTeamsCount / reports.totalTeamsCount) *
              100
            ).toFixed(1)
          : 0;

      pdf.text(`Present Rate: ${presentPercentage}%`, 100, 65);
      pdf.text(`Absent Rate: ${absentPercentage}%`, 100, 75);

      // Add team details table header
      let yPosition = 110;
      pdf.setFontSize(14);
      pdf.text("Team Attendance Details", 20, yPosition);
      yPosition += 10;

      // FIXED: Adjusted column positions to prevent overlapping
      const columnPositions = {
        teamName: 25,
        leader: 70,
        email: 100,
        dept: 140,
        year: 165,
        status: pageWidth - 25, // Status at the far right
      };

      // Table headers
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(59, 130, 246);
      pdf.rect(20, yPosition, pageWidth - 40, 8, "F");

      pdf.text("Team Name", columnPositions.teamName, yPosition + 6);
      pdf.text("Leader", columnPositions.leader, yPosition + 6);
      pdf.text("Email", columnPositions.email, yPosition + 6);
      pdf.text("Dept", columnPositions.dept, yPosition + 6);
      pdf.text("Year", columnPositions.year, yPosition + 6);
      pdf.text("Status", columnPositions.status, yPosition + 6, {
        align: "right",
      });

      yPosition += 8;

      // Team data
      pdf.setTextColor(0, 0, 0);
      reports.totalTeams.forEach((team, index) => {
        if (yPosition > 270) {
          // Add new page if needed
          pdf.addPage();
          yPosition = 20;

          // Redraw table header on new page
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          pdf.setFillColor(59, 130, 246);
          pdf.rect(20, yPosition, pageWidth - 40, 8, "F");

          pdf.text("Team Name", columnPositions.teamName, yPosition + 6);
          pdf.text("Leader", columnPositions.leader, yPosition + 6);
          pdf.text("Email", columnPositions.email, yPosition + 6);
          pdf.text("Dept", columnPositions.dept, yPosition + 6);
          pdf.text("Year", columnPositions.year, yPosition + 6);
          pdf.text("Status", columnPositions.status, yPosition + 6, {
            align: "right",
          });

          yPosition += 8;
          pdf.setTextColor(0, 0, 0);
        }

        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(20, yPosition, pageWidth - 40, 8, "F");
        }

        // FIXED: Use consistent column positions for data
        pdf.text(
          team.teamName.substring(0, 18),
          columnPositions.teamName,
          yPosition + 6
        );
        pdf.text(
          team.leaderName.substring(0, 12),
          columnPositions.leader,
          yPosition + 6
        );
        pdf.text(
          team.email.substring(0, 40),
          columnPositions.email,
          yPosition + 6
        );
        pdf.text(
          team.department.substring(0, 6),
          columnPositions.dept,
          yPosition + 6
        );
        pdf.text(team.year, columnPositions.year, yPosition + 6);

        // Status with color
        if (team.isPresent) {
          pdf.setTextColor(34, 197, 94);
          pdf.text("Present", columnPositions.status, yPosition + 6, {
            align: "right",
          });
        } else {
          pdf.setTextColor(239, 68, 68);
          pdf.text("Absent", columnPositions.status, yPosition + 6, {
            align: "right",
          });
        }

        pdf.setTextColor(0, 0, 0);
        yPosition += 8;
      });

      // Add footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, {
          align: "center",
        });
        pdf.text("Generated by ClubHub", pageWidth - 20, 290, {
          align: "right",
        });
      }

      // Save PDF
      const fileName = `attendance-report-${reports.event || "event"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      // Restore button state
      button.innerHTML = originalText;
      button.disabled = false;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");

      // Restore button state on error
      const button = document.querySelector(".export-pdf-btn");
      button.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    `;
      button.disabled = false;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <main className="flex-1 overflow-y-auto">
        <div
          id="reports-content"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to={`/events/${eventId}`}
                className="btn btn-ghost btn-circle"
              >
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-base-content">
                  Attendance Reports
                </h1>
                <p className="mt-1 text-sm text-base-content/70">
                  View attendance reports for {reports.event || "the event"}.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base-content/70">Total Teams</h3>
                <p className="text-3xl font-bold text-base-content">
                  {reports.totalTeamsCount}
                </p>
              </div>
            </div>
            <div className="card bg-success/20 border border-success/30">
              <div className="card-body">
                <h3 className="card-title text-success">Present</h3>
                <p className="text-3xl font-bold text-success">
                  {reports.presentTeamsCount}
                </p>
              </div>
            </div>
            <div className="card bg-error/20 border border-error/30">
              <div className="card-body">
                <h3 className="card-title text-error">Absent</h3>
                <p className="text-3xl font-bold text-error">
                  {reports.absentTeamsCount}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">
                  Attendance Distribution
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) =>
                          `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">
                  Team Attendance Overview
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="#4ade80" />
                      <Bar dataKey="absent" name="Absent" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300">
                <h2 className="card-title text-base-content">
                  Team Attendance Details
                </h2>
                <p className="text-base-content/70">
                  Detailed view of all teams and their attendance status
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Team Name
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Leader
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Email
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Department
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Year
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">
                        Attendance Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.totalTeams.map((team) => (
                      <tr key={team._id} className="hover">
                        <td className="font-medium text-base-content">
                          {team.teamName}
                        </td>
                        <td className="text-base-content/70">
                          {team.leaderName}
                        </td>
                        <td className="text-base-content/70">{team.email}</td>
                        <td className="text-base-content/70">
                          {team.department}
                        </td>
                        <td className="text-base-content/70">{team.year}</td>
                        <td>
                          {team.isPresent ? (
                            <span className="badge badge-success badge-lg">
                              Present
                            </span>
                          ) : (
                            <span className="badge badge-error badge-lg">
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {reports.totalTeams.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-base-content/30">📊</div>
                  <h3 className="text-lg font-medium text-base-content mb-2">
                    No Teams Registered
                  </h3>
                  <p className="text-base-content/70">
                    No teams have registered for this event yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={exportToPDF}
              className="export-pdf-btn btn btn-primary"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
