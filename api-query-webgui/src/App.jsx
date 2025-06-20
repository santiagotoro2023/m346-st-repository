import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/query?sql=${encodeURIComponent(query)}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("❌ Fehler beim Abrufen der Daten.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runQuery();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-4 py-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">📊 API Query GUI</h1>

        <div className="rounded-2xl bg-zinc-800 p-6 shadow-xl space-y-4 transition hover:shadow-2xl">
          <label htmlFor="query" className="block text-sm font-semibold mb-1">🧠 SQL Query</label>
          <textarea
            id="query"
            className="w-full p-3 rounded-xl bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows="4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold transition-transform active:scale-95"
            onClick={runQuery}
            disabled={loading}
          >
            {loading ? "⏳ Abfrage läuft..." : "🚀 Abfrage ausführen"}
          </button>
        </div>

        <div className="rounded-2xl bg-zinc-800 p-6 shadow-xl overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">📥 Ergebnisse</h2>
          {error && <p className="text-red-400">{error}</p>}
          {!error && data && data.length === 0 && (
            <p className="text-gray-400">Keine Daten gefunden.</p>
          )}
          {!error && data && data.length > 0 && (
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="border-b border-zinc-600 px-4 py-2 font-semibold text-zinc-300">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-zinc-700 transition">
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="border-b border-zinc-700 px-4 py-2">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
