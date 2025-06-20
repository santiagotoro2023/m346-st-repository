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
        setError("⚠️ Query-String muss mit '?' starten!");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-3xl space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-white">
          🖥️ API Query WebGUI
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              Tabelle auswählen:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tables.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              Optional: Query-String eingeben (z.B. <code>?firstname=Clara</code>)
            </label>
            <input
              type="text"
              value={queryString}
              onChange={(e) => setQueryString(e.target.value)}
              placeholder="?filter=value"
              className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={fetchTableData}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "⏳ Lädt..." : "🔍 Daten abrufen"}
          </button>

          {error && (
            <div className="text-red-400 font-semibold">{error}</div>
          )}

          {data && (
            <div className="overflow-auto max-h-96">
              <table className="w-full text-left table-auto border border-gray-600">
                <thead className="bg-gray-700 sticky top-0 z-10">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="p-2 border border-gray-600 text-gray-300"
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
                      className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}
                    >
                      {Object.values(row).map((val, i) => (
                        <td
                          key={i}
                          className="p-2 border border-gray-700 text-gray-100"
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

        <p className="text-center text-gray-500 text-sm pt-4">
          Made with ❤️ by Santiago Toro
        </p>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
