import { useState } from "react";
import axios from "axios";


// Circular Progress Component
const ScoreRing = ({ score }) => {
  const size = 100;
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (score) => {
    if (score < 40) return "red";
    if (score <= 80) return "orange";
    return "green";
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#ddd"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={getColor(score)}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Score Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="32px"
        fontWeight="bold"
        fill={getColor(score)}
      >
        {Math.round(score)}
        
      </text>
      <text>performance</text>
    </svg>
  );
};

// Main Component
export default function LightScoreChecker() {
  const [url, setUrl] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckScore = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    setScore(null);

    try {
      const response = await axios.post("http://localhost:3000/get-light-score", { url });
      setScore(response.data.categories.performance.score * 100);
    } catch (err) {
      setError("Failed to fetch the Lighthouse score");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className=" max-w-md mx-auto bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">Lighthouse Simulator</h2>
      <input
        type="text"
        placeholder="Enter website URL"
        className="w-full p-2 border rounded mb-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={handleCheckScore}
        disabled={loading}
      >
        {loading ? "Checking..." : "Get Score"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {score !== null && (
        <div className="mt-4 flex justify-center">
          <ScoreRing score={score} />
        </div>
      )}
    </div>
  );
}

