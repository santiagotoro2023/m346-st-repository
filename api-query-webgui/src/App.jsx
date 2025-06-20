import React, { useState } from "react";

const endpoints = {
  users: "users",
  courses: "courses",
  course_assignment: "course_assignment",
};

const tables = [
  { value: "users", label: "👥 Users" },
  { value: "courses", label: "📘 Courses" },
  { value: "course_assignment", label: "📝 Course Assignment" },
];

const BASE_URL =
  "https://jpm9l2v1be.execute-api.us-east-1.amazonaws.com/prod";

export default function App() {
  const [selectedTable, setSelectedTable] = useState("users");
  const [queryString, setQueryString] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchTableData() {
    setLoading(true);
    setError(null);
    setData(null);

    let url = `${BASE_URL}/${endpoints[selectedTable]}`;

    if (queryString.trim() !== "") {
      if (!queryString.startsWith("?")) {
        setLoading(false);
        setError("⚠️ Query string muss mit '?' starten!");
        return;
      }
      url += queryString;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();

      let tableData = json;
      if (typeof json === "object" && !Array.isArray(json)) {
        // Einzelobjekt in Array umwandeln
        tableData = [json];
      }
      if (!Array.isArray(tableData)) {
        setError("⚠️ Unerwartetes Datenformat von API");
        setLoading(false);
        return;
      }
      if (tableData.length === 0) {
        setError("🔍 Keine Daten gefunden.");
        setLoading(false);
        return;
      }
      setData(tableData);
    } catch (e) {
      setError(`❗ Fehler bei der API-Anfrage: ${e.message}`);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-8 font-sans">
      <h1 className="text-4xl mb-8 font-bold tracking-wide select-none">
        🖥️ API Query WebGUI
      </h1>

      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg transition-shadow hover:shadow-2xl">
        <label
          htmlFor="table-select"
          className="block mb-3 font-semibold text-gray-300"
        >
          Tabelle auswählen:
        </label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full rounded-lg bg-gray-700 text-gray-200 p-3 mb-4 appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
        >
          {tables.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label
          htmlFor="query-string"
          className="block mb-3 font-semibold text-gray-300"
        >
          Optional: Query-String eingeben (z.B. <code>?firstname=Clara</code>)
        </label>
        <input
          id="query-string"
          type="text"
          placeholder="?filter=value"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          className="w-full rounded-lg bg-gray-700 text-gray-200 p-3 mb-6 placeholder-gray-400 border border-gray-600 focus:border-indigo-500 outline-none transition"
        />

        <button
          onClick={fetchTableData}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl py-3 font-semibold text-white hover:brightness-110 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              ⏳ Daten laden
              <span className="spinner-border animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            </span>
          ) : (
            "Daten abrufen"
          )}
        </button>

        {error && (
          <div className="mt-6 text-red-400 font-semibold select-text">{error}</div>
        )}

        {data && (
          <div
            className="mt-6 bg-gray-700 rounded-xl p-4 overflow-auto max-h-96"
            style={{ fontFamily: "monospace" }}
          >
            <table className="w-full table-auto border-collapse border border-gray-600">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-600 px-3 py-1 text-left text-gray-300 bg-gray-800 sticky top-0"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                  >
                    {Object.values(row).map((val, i) => (
                      <td
                        key={i}
                        className="border border-gray-600 px-3 py-1 text-gray-200"
                      >
                        {typeof val === "object"
                          ? JSON.stringify(val)
                          : val?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="mt-12 text-gray-500 text-xs select-none">
        Made with ❤️ by Santiago Toro
      </footer>

      {/* Spinner CSS */}
      <style>{`
        .spinner-border {
          border-top-color: transparent;
          border-right-color: transparent;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
