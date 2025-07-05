'use client';

import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState(null);

  const handleSend = async () => {
    const res = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Amandeep Singh',
        role: 'SDE Intern'
      })
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🔥 Next.js API Test</h1>
      <button onClick={handleSend} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Hit API
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">✅ Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}