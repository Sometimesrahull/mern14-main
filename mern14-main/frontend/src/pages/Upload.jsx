import React, { useState } from "react";
import "./upload.css";

const Upload = () => {
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Example: check for authentication (replace with your logic)
  const isAuthenticated = true; // Replace with actual auth check

  const handleFileChange = (e) => {
    setAudio(e.target.files[0]);
    setSuccess("");
    setError("");
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!audio) {
      setError("Please select an audio file.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    const formData = new FormData();
    formData.append("audio", audio);

    try {
      const response = await fetch("http://localhost:3000/rahul", {
        method: "POST",
        body: formData,
        // If you need to send auth token:
        // headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess("Audio uploaded successfully!");
        setAudio(null);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="upload-container">
        <div className="upload-title">Please log in to upload audio.</div>
      </div>
    );
  }

  return (<div className="upload-wrapper">
    <div className="upload-container">
      <div className="upload-title">Upload Audio</div>
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept="audio/*"
          className="upload-input"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="upload-btn"
          disabled={loading || !audio}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <div className="upload-progress">
          <div
            className="upload-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {success && <div className="upload-success">{success}</div>}
        {error && <div className="upload-error">{error}</div>}
      </form>
    </div>
    </div>
  );
};

export default Upload;