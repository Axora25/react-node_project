import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api')
        const data = await response.json()
        setBackendMessage(data.message)
      } catch (error) {
        setBackendMessage('Backend not connected. Make sure the server is running on port 5000.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          React + Node.js Full-Stack Project
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Backend Connection Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Backend Connection</h2>
            {loading ? (
              <p className="text-gray-600">Connecting...</p>
            ) : (
              <p className={`${backendMessage.includes('not connected') ? 'text-red-600' : 'text-green-600'} font-medium`}>
                {backendMessage}
              </p>
            )}
          </div>

          {/* Counter Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-4">
              Your React + Node.js project is set up and ready to go.
            </p>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Count is {count}
            </button>
          </div>

          {/* Tech Stack Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>React - Frontend Framework</li>
              <li>Node.js + Express - Backend Server</li>
              <li>Tailwind CSS - Styling</li>
              <li>Bootstrap - UI Components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

