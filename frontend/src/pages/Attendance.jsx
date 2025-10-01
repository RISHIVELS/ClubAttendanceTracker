import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import QrScanner from "qr-scanner";

const Attendance = () => {
  const { eventId } = useParams();
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    // Cleanup scanner when component unmounts
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScannerActive(true);
      setError("");
      setScanResult(null);

      // Wait for the next render cycle to ensure video element is mounted
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if video element exists
      if (!videoRef.current) {
        throw new Error("Video element not found. Please try again.");
      }

      // Stop any existing scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }

      // Initialize QR scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScanSuccess(result.data);
        },
        {
          onDecodeError: (error) => {
            // Ignore common non-error messages
            if (!error?.includes?.("No QR code found")) {
              console.warn("QR scan error:", error);
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        }
      );

      // Start the scanner
      await qrScannerRef.current.start();
    } catch (error) {
      console.error("Failed to start scanner:", error);
      setError(
        error.message.includes("Camera access")
          ? "Camera access was denied. Please allow camera permissions to scan QR codes."
          : error.message ||
              "Failed to start camera. Please check your camera permissions."
      );
      setIsScannerActive(false);
    }
  };

  const stopScanner = () => {
    setIsScannerActive(false);
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
  };

  const onScanSuccess = async (decodedText) => {
    try {
      // Stop scanner immediately after successful scan
      stopScanner();
      setIsLoading(true);

      // Parse QR code data
      const qrData = JSON.parse(decodedText);
      console.log("QR Code Data:", qrData);

      // Validate required fields
      if (!qrData.teamId || !qrData.eventId || !qrData.token) {
        throw new Error("Invalid QR code format");
      }

      // Send attendance data to backend
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(
        `${baseURL}/api/v1/attendance/scan/${eventId}`,
        qrData,
        {
          headers: {
            Authorization: `Bearer ${qrData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Attendance response:", response.data);
      setTeam(response.data.team);
      setScanResult({
        success: true,
        message: response.data.message || "Attendance marked successfully!",
        data: {
          teamId: qrData.teamId,
          eventId: qrData.eventId,
          ...response.data,
        },
      });
    } catch (error) {
      console.error("Scan error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to process QR code. Please try again."
      );
      // Restart scanner on error
      setTimeout(startScanner, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setScanResult(null);
    setError("");
  };

  const resetScanner = () => {
    closeModal();
    startScanner();
  };

  // Handle scanner stop when component unmounts or scanner becomes inactive
  useEffect(() => {
    if (!isScannerActive && qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
  }, [isScannerActive]);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
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
                <h2 className="text-3xl font-bold tracking-tight text-base-content">
                  Event Attendance
                </h2>
                <p className="mt-1 text-sm text-base-content/70">
                  Scan QR codes to mark attendance for your event.
                </p>
              </div>
            </div>
          </div>

          {/* Scanner Section */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-6 sm:p-8 text-center">
              {!isScannerActive ? (
                // Ready to scan state
                <>
                  <div className="flex justify-center items-center mb-6">
                    <div className="text-6xl text-primary">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-16 h-16"
                      >
                        <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-base-content">
                    Ready to Scan
                  </h3>
                  <p className="text-base-content/70 mt-2 mb-6 max-w-md mx-auto">
                    Click the button below to activate the scanner and start
                    checking in your members.
                  </p>
                  <button
                    onClick={startScanner}
                    className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Take Attendance
                  </button>
                </>
              ) : (
                // Active scanner state
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-base-content mb-4">
                      Scan QR Code
                    </h3>
                    <p className="text-base-content/70 mb-4">
                      Position the QR code within the camera view to scan
                    </p>
                  </div>

                  {/* Video Scanner Container */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-full max-w-md">
                      <video
                        ref={videoRef}
                        className="w-full h-64 sm:h-80 rounded-lg border-2 border-primary shadow-lg bg-base-200"
                        playsInline
                        muted
                      />
                      {/* Scanner overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-white  rounded-lg"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={stopScanner}
                      className="btn btn-outline btn-lg"
                    >
                      Cancel Scan
                    </button>
                  </div>
                </>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="text-base-content">
                      Processing attendance...
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 alert alert-error">
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
                  <span>{error}</span>
                  {error.includes("Camera access") && (
                    <div className="mt-2 text-sm">
                      <button
                        onClick={startScanner}
                        className="btn btn-sm btn-primary"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 card bg-base-200 border border-base-300">
            <div className="card-body">
              <h4 className="card-title text-base-content">How to use:</h4>
              <ul className="list-disc list-inside text-base-content/70 space-y-2">
                <li>Click "Take Attendance" to start the camera</li>
                <li>Allow camera permissions when prompted</li>
                <li>Position the QR code within the camera view</li>
                <li>
                  The scanner will automatically detect and process QR codes
                </li>
                <li>
                  Attendance will be automatically recorded upon successful scan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {scanResult && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-base-content mb-2">
                Attendance Successful!
              </h3>

              <p className="text-base-content/70 mb-6">{scanResult.message}</p>

              {scanResult.data && (
                <div className="bg-base-200 rounded-lg p-4 mb-6 w-full">
                  <h4 className="font-semibold text-base-content mb-2">
                    Scan Details:
                  </h4>
                  <div className="text-left text-sm">
                    <p className="mb-1">
                      <strong>Team ID:</strong> {scanResult.data.teamId}
                    </p>

                    <p className="mb-1">
                      <strong>Event ID:</strong> {scanResult.data.eventId}
                    </p>
                    <p className="mb-1">
                      <strong>Team LeaderName:</strong> {team.leaderName}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {team.email}
                    </p>
                    <p className="mb-2">
                      <strong>TeamName:</strong> {team.teamName}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span className="badge badge-success ml-1">Present</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="modal-action justify-center">
                <button onClick={resetScanner} className="btn btn-primary">
                  Scan Another
                </button>
                <Link to={`/events/${eventId}`} className="btn btn-outline">
                  Back to Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-base-100 border-t border-base-300 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-base-content/70">
          <p>© 2024 ClubHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Attendance;
