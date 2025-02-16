import { useState, useEffect, useCallback } from "react";

export default function Playground() {
  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [correctedCode, setCorrectedCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch suggestions (debounced)
  const fetchSuggestions = useCallback(() => {
    if (code.length > 1) {
      setLoading(true);
      fetch("http://localhost:8000/autocomplete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch((error) => console.error("Error fetching suggestions:", error))
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [code]);

  // Debounce API calls
  useEffect(() => {
    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [code, fetchSuggestions]);

  // Function to fetch corrected code
  const fetchCorrection = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/correct/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setCorrectedCode(data.corrected_code || "No correction available");
    } catch (error) {
      console.error("Error fetching correction:", error);
      setCorrectedCode("Error fetching correction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/ Left Side: Code Editor /}
      <div className="w-2/3 p-4 border-r border-gray-700">
        <h1 className="text-xl mb-4 text-center">Darion Playground</h1>
        <textarea
          className="w-full p-2 bg-gray-800 text-white rounded-lg min-h-[300px] resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Start typing Darion code..."
        />
        <div className="mt-2">
          {loading && <p className="text-yellow-400">Loading...</p>}
          {suggestions.length > 0 && (
            <div className="p-2 bg-gray-700 rounded-md">
              <strong>Suggestions:</strong> {suggestions.join(", ")}
            </div>
          )}
        </div>
        <button
          onClick={fetchCorrection}
          className={`mt-4 p-2 rounded-md w-full ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Correct Code"}
        </button>
      </div>

      {/ Right Side: Output Preview /}
      <div className="w-1/3 p-4 flex items-center justify-center">
        <div className="bg-gray-800 p-4 rounded-lg w-full text-center border border-gray-600">
          <h2 className="text-lg font-semibold text-green-400">Corrected Code</h2>
          <div className="mt-2 p-2 bg-gray-900 rounded-md min-h-[100px] border border-green-500">
            {correctedCode || "No corrections yet"}
          </div>
        </div>
      </div>
    </div>
  );
}