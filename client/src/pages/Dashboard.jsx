import BASE_URL from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import HomeScreen from '../components/HomeScreen'
import EntryScreen from '../components/EntryScreen'
import InsightsScreen from '../components/InsightsScreen'
import ChatBot from '../components/ChatBot'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [screen, setScreen] = useState('home')
  const [cycles, setCycles] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchCycles()
  }, [])

  const fetchCycles = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/api/cycles`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCycles(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className='dashboard'>
      {screen === 'home' && (
        <HomeScreen
          user={user}
          cycles={cycles}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onNav={setScreen}
          onLogout={handleLogout}
        />
      )}
      {screen === 'entry' && (
        <EntryScreen
          selectedDate={selectedDate}
          onNav={setScreen}
          onSave={() => { fetchCycles(); setScreen('home') }}
        />
      )}
      {screen === 'insights' && (
        <InsightsScreen cycles={cycles} onNav={setScreen} />
      )}

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

      {/* Bottom Nav */}
      <nav className='bottom-nav'>
        <button className={`nav-btn ${screen === 'home' ? 'active' : ''}`} onClick={() => setScreen('home')}>
          <span className='nav-btn-icon'>🏠</span>
          <span className='nav-btn-label'>Home</span>
        </button>
        <button className={`nav-btn ${screen === 'entry' ? 'active' : ''}`} onClick={() => setScreen('entry')}>
          <span className='nav-btn-icon'>✏️</span>
          <span className='nav-btn-label'>Log</span>
        </button>
        <button className={`nav-btn ${screen === 'insights' ? 'active' : ''}`} onClick={() => setScreen('insights')}>
          <span className='nav-btn-icon'>📊</span>
          <span className='nav-btn-label'>Insights</span>
        </button>
        <button className='nav-btn' onClick={() => setShowChat(true)}>
          <span className='nav-btn-icon'>💬</span>
          <span className='nav-btn-label'>Chat</span>
        </button>
      </nav>
    </div>
  )
}

export default Dashboard