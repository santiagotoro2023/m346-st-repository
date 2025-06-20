import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const endpoints = {
  '1': 'users',
  '2': 'courses',
  '3': 'course_assignment',
};

const API_BASE = 'https://jpm9l2v1be.execute-api.us-east-1.amazonaws.com/prod';

export default function App() {
  const [selected, setSelected] = useState('1');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFetch = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/${endpoints[selected]}`;
      if (query.startsWith('?')) url += query;
      const response = await axios.get(url);
      const result = Array.isArray(response.data) ? response.data : [response.data];
      setData(result);
    } catch (err) {
      console.error('API Error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        📊 API Query Dashboard
      </motion.h1>

      <Card className="bg-neutral-800 rounded-2xl shadow-lg max-w-3xl mx-auto p-6">
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-neutral-700 rounded-xl px-4 py-2 w-full"
            >
              <option value="1">👥 /users</option>
              <option value="2">📘 /courses</option>
              <option value="3">📝 /course_assignment</option>
            </select>
            <Input
              placeholder="Optional query string (e.g. ?firstname=Clara)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-neutral-700 text-white rounded-xl"
            />
            <Button onClick={handleFetch} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              🚀 Query
            </Button>
          </div>
          {loading ? (
            <p className="text-center animate-pulse">⏳ Loading data...</p>
          ) : (
            data.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-neutral-700">
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      {headers.map((h, idx) => (
                        <TableHead key={idx}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, i) => (
                      <TableRow key={i} className="hover:bg-neutral-700">
                        {headers.map((h, idx) => (
                          <TableCell key={idx}>{String(row[h])}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
          {!loading && data.length === 0 && <p className="text-center text-neutral-400">🔍 No data loaded yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
