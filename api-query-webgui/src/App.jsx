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
    <div className="app-container">
      <div className="gui-box">
        <h1>🖥️ API Query WebGUI</h1>

        <label>
          Tabelle auswählen:
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            {tables.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Optional: Query-String (z.B. <code>?firstname=Clara</code>)
          <input
            type="text"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            placeholder="?filter=value"
          />
        </label>

        <button onClick={fetchTableData} disabled={loading}>
          {loading ? "⏳ Lädt..." : "🔍 Daten abrufen"}
        </button>

        {error && <div className="error">{error}</div>}

        {data && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>
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

        <p className="footer">Made with ❤️ by Santiago Toro</p>
      </div>

      <style>{`
        body, html, .app-container {
          height: 100%;
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .gui-box {
          background: #2a2a2a;
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(0,0,0,0.5);
          padding: 32px;
          max-width: 1000px;
          width: 100%;
          animation: fadeIn 0.6s ease-in-out;
        }

        h1 {
          text-align: center;
          margin-bottom: 24px;
          font-size: 2rem;
        }

        label {
          display: block;
          margin-bottom: 16px;
          font-weight: 600;
        }

        select, input {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: none;
          border-radius: 8px;
          background: #3a3a3a;
          color: #fff;
        }

        input::placeholder {
          color: #aaa;
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: #4338ca;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-top: 12px;
          color: #ff6b6b;
          font-weight: bold;
        }

        .table-wrapper {
          overflow-x: auto;
          max-height: 400px;
          margin-top: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #1e1e1e;
          border: 1px solid #444;
        }

        th, td {
          padding: 10px;
          border: 1px solid #444;
          text-align: left;
        }

        th {
          background-color: #333;
          position: sticky;
          top: 0;
        }

        tr:nth-child(even) {
          background-color: #2a2a2a;
        }

        tr:nth-child(odd) {
          background-color: #1f1f1f;
        }

        .footer {
          text-align: center;
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 24px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
