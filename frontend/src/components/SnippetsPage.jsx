import React, { useState, useEffect } from 'react';
import axios from 'axios';


function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/config');
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error('Error fetching config: ', error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/snippets');
        setSnippets(response.data);
      } catch (error) {
        console.error('Error fetching snippets: ', error);
      }
    };
    fetchSnippets();
  }, []);

  const fetchOutputWithToken = async (token) => {
    try {
      const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      if (response.data?.stdout !== undefined) {
        return response.data.stdout;
      } else if (response.data?.stderr !== undefined) {
        return response.data.stderr;
      } else {
        return 'No output or error message received';
      }
    } catch (error) {
      console.error('Error fetching output with token: ', error);
      return 'Error fetching output';
    }
  };

  const fetchOutput = async (sourceCode, language, stdin) => {
    try {
      var language_id;
      if (language === 'python') {
        language_id = 70
      }
      if (language === 'c') {
        language_id = 75
      }
      if (language === 'cpp') {
        language_id = 54
      }
      if (language === 'java') {
        language_id = 91
      }
      if (language === 'javascript') {
        language_id = 93
      }
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        source_code: sourceCode,
        language_id: language_id,
        stdin: stdin
      }, {
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      //   return response.data.stdout;
      console.log('Judge0 Response:', response); // Log the entire response object
      if (response.data?.token !== undefined) {
        const token = response.data.token;
        const output = await fetchOutputWithToken(token);
        return output;
      } else {
        return 'No token received';
      }
    } catch (error) {
      console.error('Error fetching output: ', error);
      return 'Error fetching output';
    }
  };

  return (
    <div className='bg-stone-300 h-full min-h-screen flex flex-col w-full'>
      <div> 
        <h1 className='text-center text-3xl p-3 font-serif'>Kode Results</h1>
      </div>
      <div className='flex justify-center items-center w-full mt-2 gap-4 p-3'>
        <table width={100} cellPadding={5} className='border-black border'>
          <thead className='border border-black'>
            <tr>
              <th>Username</th>
              <th>Language</th>
              <th>Standard Input</th>
              <th>Source Code Preview</th>
              <th>Output</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody className='border border-black'>
            {snippets.map((snippet, index) => (
              <tr key={index} className='border border-black'>
                <td>{snippet.username}</td>
                <td>{snippet.language}</td>
                <td>{snippet.stdin}</td>
                <td>{snippet.sourceCodePreview}</td>
                <td>
                  <button onClick={async () => {
                    const output = await fetchOutput(snippet.sourceCodePreview, snippet.language, snippet.stdin);
                    alert(output);
                  }}><span className="text-green-800">View Output</span></button>
                </td>
                <td>{snippet.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );  
}

export default SnippetsPage;

