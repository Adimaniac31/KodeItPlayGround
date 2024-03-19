import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [stdin, setStdin] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/submit', { username, language, stdin, sourceCode });
      navigate('/snippets');
    } catch (error) {
      console.error('Error submitting snippet: ', error);
    }
  };

  return (
    <div className='bg-stone-300'>
      <h1 className='text-center text-3xl p-3 font-serif'>Kode It Playground</h1>
      <form onSubmit={handleSubmit} className='flex flex-row gap-4 w-full'>
        <div className='flex flex-col w-full h-auto gap-4 p-3'>
          <input type="text" placeholder="Username" className="p-3 border rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-3 border rounded-lg">
            <option value="">Select Language</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <input type="text" placeholder="Standard Input" className="p-3 border rounded-lg" value={stdin} onChange={(e) => setStdin(e.target.value)} />
        </div>
        <div className='w-full min-h-screen flex flex-col'>
          <textarea className="h-full bg-black text-white p-2" placeholder="Source Code" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)}></textarea>
          <button type="submit" className='text-xl p-4 border rounded-lg border-black m-2 hover:bg-black hover:opacity-80 hover:text-cyan-100'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default HomePage;

