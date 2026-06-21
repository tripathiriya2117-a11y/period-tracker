import { useState } from 'react'
import axios from 'axios'
import BASE_URL from '../api'

function InsightsScreen({ cycles, onNav }) {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const moods = ['happy', 'calm', 'tired', 'irritable', 'sad']
  const symptoms = ['cramps', 'headache', 'fatigue', 'bloating', 'backache', 'nausea', 'mood swings', 'spotting']

  const handleEdit = (cycle) => {
    setEditingId(cycle._id)
    setEditData({
      startDate: cycle.startDate.split('T')[0],
      endDate: cycle.endDate ? cycle.endDate.split('T')[0] : '',
      mood: cycle.mood || '',
      symptoms: cycle.symptoms || [],
      discharge: cycle.discharge || '',
      notes: cycle.notes || ''
    })
  }

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/api/cycles/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEditingId(null)
      setRefreshKey(k => k + 1)
      alert('✅ Cycle updated!')
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to update'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete this cycle log.')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/api/cycles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRefreshKey(k => k + 1)
      alert('✅ Cycle deleted!')
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to delete'))
    }
  }

  const toggleSymptom = (s) => {
    setEditData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s]
    }))
  }

  const getAvgCycleLength = () => {
    if (cycles.length < 2) return '--'
    const lengths = []
    for (let i = 0; i < cycles.length - 1; i++) {
      const curr = new Date(cycles[i].startDate)
      const prev = new Date(cycles[i + 1].startDate)
      const diff = Math.floor((curr - prev) / (1000 * 60 * 60 * 24))
      if (diff > 0 && diff < 60) lengths.push(diff)
    }
    return lengths.length === 0 ? '--' : Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
  }

  const getAvgPeriodLength = () => {
    const withEnd = cycles.filter(c => c.endDate)
    if (withEnd.length === 0) return '--'
    const lengths = withEnd.map(c => {
      const start = new Date(c.startDate)
      const end = new Date(c.endDate)
      return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
    })
    return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
  }

  const getNextPeriod = () => {
    if (cycles.length === 0) return null
    const lastStart = new Date(cycles[0].startDate)
    const avgLength = getAvgCycleLength()
    const length = avgLength === '--' ? 28 : avgLength
    const next = new Date(lastStart)
    next.setDate(next.getDate() + length)
    return next
  }

  const nextPeriod = getNextPeriod()

  return (
    <div className='insights'>
      <div className='insights-header'>
        <div className='insights-title'>Your Insights</div>
        <div className='insights-sub'>Based on {cycles.length} logged cycles</div>
      </div>

      <div className='insights-body'>
        {/* Prediction Card */}
        <div className='predict-card'>
          <div className='predict-label'>Next Period</div>
          <div className='predict-date'>
            {nextPeriod ? nextPeriod.toLocaleDateString('default', { month: 'long', day: 'numeric' }) : 'Log cycles to predict'}
          </div>
          <div className='predict-badge'>✦ High confidence</div>
        </div>

        {/* Stats */}
        <div className='stat-cards'>
          <div className='stat-card'>
            <div className='stat-icon'>🔄</div>
            <div className='stat-value'>{getAvgCycleLength()}</div>
            <div className='stat-unit'>days avg</div>
            <div className='stat-label'>Cycle Length</div>
          </div>
          <div className='stat-card'>
            <div className='stat-icon'>🩸</div>
            <div className='stat-value'>{getAvgPeriodLength()}</div>
            <div className='stat-unit'>days avg</div>
            <div className='stat-label'>Period Duration</div>
          </div>
        </div>

        {/* Recent Logs with Edit/Delete */}
        <div className='chart-card'>
          <div className='chart-card-header'>
            <div className='chart-title'>Recent Cycles</div>
          </div>
          {cycles.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#7a6990' }}>
              No cycles logged yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cycles.map(cycle => (
                <div key={cycle._id} style={{
                  background: '#120e1c',
                  border: '1px solid #2a1f3d',
                  borderRadius: '12px',
                  padding: '14px',
                  display: editingId === cycle._id ? 'block' : 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {editingId === cycle._id ? (
                    // EDIT MODE
                    <div style={{ width: '100%' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#7a6990' }}>Start Date</label>
                        <input
                          type='date'
                          value={editData.startDate}
                          onChange={e => setEditData({ ...editData, startDate: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#1a1425',
                            border: '1px solid #2a1f3d',
                            borderRadius: '8px',
                            color: '#f0e6ff',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#7a6990' }}>Mood</label>
                        <select
                          value={editData.mood}
                          onChange={e => setEditData({ ...editData, mood: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#1a1425',
                            border: '1px solid #2a1f3d',
                            borderRadius: '8px',
                            color: '#f0e6ff',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value=''>Select mood</option>
                          {moods.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#7a6990' }}>Symptoms</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                          {symptoms.map(s => (
                            <button
                              key={s}
                              onClick={() => toggleSymptom(s)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: editData.symptoms.includes(s) ? '1px solid #ec4899' : '1px solid #2a1f3d',
                                background: editData.symptoms.includes(s) ? 'rgba(236,72,153,0.15)' : '#1a1425',
                                color: editData.symptoms.includes(s) ? '#f472b6' : '#7a6990',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Save ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#1a1425',
                            border: '1px solid #2a1f3d',
                            borderRadius: '8px',
                            color: '#c9a6ff',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#e8d5ff', fontWeight: '600' }}>
                          {new Date(cycle.startDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#7a6990', marginTop: '4px' }}>
                          {cycle.mood && `Mood: ${cycle.mood}`}
                          {cycle.symptoms?.length > 0 && ` · ${cycle.symptoms.slice(0, 2).join(', ')}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(cycle)}
                          style={{
                            padding: '6px 12px',
                            background: '#1a1425',
                            border: '1px solid #2a1f3d',
                            borderRadius: '8px',
                            color: '#c9a6ff',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cycle._id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(236,72,153,0.15)',
                            border: '1px solid #ec4899',
                            borderRadius: '8px',
                            color: '#f472b6',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsightsScreen