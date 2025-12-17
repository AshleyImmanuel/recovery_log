"use client";

import { useState } from "react";

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([]);

  async function checkStatus() {
    const res = await fetch(`/api/status?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Check Payment Status</h2>

      <input
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", padding: 12 }}
      />

      <button onClick={checkStatus} style={{ marginTop: 10 }}>
        Check
      </button>

      {results.map(r => (
        <div key={r.id} style={{ marginTop: 20 }}>
          <p><b>Course:</b> {r.course}</p>
          <p><b>Status:</b> {r.status}</p>
        </div>
      ))}
    </main>
  );
}
