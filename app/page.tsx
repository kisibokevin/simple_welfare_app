'use client';

import { useState, useEffect } from 'react';

interface Member {
  id: number;
  fullName: string;
  number: number;
}

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (res.ok) {
        setMembers(data);
      } else {
        setError(data.error || 'Failed to fetch members');
      }
    } catch {
      setError('Failed to fetch members');
    }
  };

  const handlePickNumber = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName }),
      });
      const data = await res.json();

      if (res.ok) {
        setMembers([...members, data]);
        setFullName('');
      } else {
        setError(data.error || 'Failed to pick number');
      }
    } catch {
      setError('Failed to pick number');
    } finally {
      setLoading(false);
    }
  };

  // Generate number grid
  const allNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
  const pickedNumbers = new Set(members.map((m) => m.number));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Merry-Go-Round Welfare App</h1>
        <p className='text-lg text-center font-medium'>Please enter your full name and click "Pick a Number" to receive a number.</p>
        <p className='text-red-500 text-lg text-center font-medium'>!! Register Once Only !!</p>

        <div className="mb-4">
          <label htmlFor="fullName" className="block font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <button
          onClick={handlePickNumber}
          disabled={loading || !fullName.trim()}
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Picking...' : 'Pick a Number'}
        </button>

        {error && <p className="text-red-800 mt-2">{error}</p>}

        <div className="grid grid-cols-5 gap-2 mt-6">
          {allNumbers.map((num) => (
            <div
              key={num}
              className={`p-2 text-center border rounded-md ${
                pickedNumbers.has(num)
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-white text-black'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Assigned Numbers</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Number</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="border p-2">{member.fullName}</td>
                <td className="border p-2">{member.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}