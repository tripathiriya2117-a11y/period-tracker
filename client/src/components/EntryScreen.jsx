import BASE_URL from '../api'
import { useState } from 'react'
import axios from 'axios'

function EntryScreen({ selectedDate, onNav, onSave }) {
  const [startDate, setStartDate] = useState(
    selectedDate instanceof Date
      ? selectedDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState('')
  const [mood, setMood] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [cravings, setCravings] = useState([])
  const [discharge, setDischarge] = useState('')
  const [notes, setNotes] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const moods = [
    { key: 'happy', emoji: '😊', label: 'Happy' },
    { key: 'calm', emoji: '😌', label: 'Calm' },
    { key: 'tired', emoji: '😴', label: 'Tired' },
    { key: 'irritable', emoji: '😤', label: 'Irritable' },
    { key: 'sad', emoji: '😢', label: 'Sad' },
  ]

  const symptomOptions = ['cramps', 'headache', 'fatigue', 'bloating', 'backache', 'nausea', 'mood swings', 'spotting']
  const cravingOptions = ['chocolate', 'chips', 'sweets', 'spicy food', 'fast food', 'fruits']
  const dischargeOptions = ['none', 'spotting', 'light', 'moderate', 'heavy']

  const toggle = (item, list, setList) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item])
  }

  const handleSave = async () => {
    if (!startDate) { setError('Please select a start date'); return }
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${BASE_URL}/api/cycles`, {
        startDate,
        endDate: endDate || startDate,
        mood: mood || undefined,
        symptoms,
        cravings,
        discharge: discharge || undefined,
        notes: notes || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='entry'>
      <div className='entry-header'>
        <button className='back-btn' onClick={() => onNav('home')}>←</button>
        <div className='entry-title'>Log Period</div>
      </div>

      <div className='entry-body'>
        {error && <div className='error'>{error}</div>}

        {/* REQUIRED */}
        <div>
          <div className='entry-section-label'>Period Start Date ✳️</div>
          <input
            type='date'
            className='date-input'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <div className='entry-section-label'>Period End Date (optional)</div>
          <input
            type='date'
            className='date-input'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        {/* OPTIONAL TOGGLE */}
        <button
          onClick={() => setShowOptional(!showOptional)}
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#c9a6ff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Add more details</span>
          <span>{showOptional ? '▲' : '▼'}</span>
        </button>

        {showOptional && (
          <div className='entry-optional'>
            <div className='entry-section-label'>Mood</div>
            <div className='mood-grid'>
              {moods.map(item => (
                <button
                  key={item.key}
                  type='button'
                  className={`mood-btn ${mood === item.key ? 'selected' : ''}`}
                  onClick={() => setMood(item.key)}
                >
                  <span>{item.emoji}</span> {item.label}
                </button>
              ))}
            </div>

            <div className='entry-section-label'>Symptoms</div>
            <div className='checkbox-grid'>
              {symptomOptions.map(item => (
                <button
                  key={item}
                  type='button'
                  className={`option-btn ${symptoms.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggle(item, symptoms, setSymptoms)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className='entry-section-label'>Cravings</div>
            <div className='checkbox-grid'>
              {cravingOptions.map(item => (
                <button
                  key={item}
                  type='button'
                  className={`option-btn ${cravings.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggle(item, cravings, setCravings)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className='entry-section-label'>Discharge</div>
            <div className='checkbox-grid'>
              {dischargeOptions.map(item => (
                <button
                  key={item}
                  type='button'
                  className={`option-btn ${discharge === item ? 'selected' : ''}`}
                  onClick={() => setDischarge(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div>
              <div className='entry-section-label'>Notes</div>
              <textarea
                className='notes-input'
                rows='4'
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder='Add more details...'
              />
            </div>
          </div>
        )}

        <button
          className='save-btn'
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </div>
  )
}

export default EntryScreen
