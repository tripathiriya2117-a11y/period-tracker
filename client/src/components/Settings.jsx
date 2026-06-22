import { useState, useEffect } from 'react'
import axios from 'axios'
import BASE_URL from '../api'

function Settings({ onNav }) {
  const [cycleLength, setCycleLength] = useState(28)
  const [hasPCOD, setHasPCOD] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setHasPCOD(user.hasPCOD || false)
    setCycleLength(user.cycleLength || 28)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/api/auth/profile`, {
        cycleLength,
        hasPCOD
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = JSON.parse(localStorage.getItem('user'))
      user.cycleLength = cycleLength
      user.hasPCOD = hasPCOD
      localStorage.setItem('user', JSON.stringify(user))
      alert('✅ Settings saved!')
    } catch (err) {
      alert('❌ Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Settings</h2>
        <p style={{ color: 'var(--text-tertiary)', margin: '0' }}>Customize your cycle tracking</p>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type='checkbox'
            checked={hasPCOD}
            onChange={(e) => setHasPCOD(e.target.checked)}
            style={{ marginRight: '12px', cursor: 'pointer', width: '18px', height: '18px' }}
          />
          <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
            I have PCOD/PCOS
          </span>
        </label>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', margin: '8px 0 0 30px' }}>
          Get cycle predictions tailored for irregular periods
        </p>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            Average Cycle Length
          </span>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', margin: '4px 0 0' }}>
            {hasPCOD ? 'PCOD cycles vary. Enter your average (21-90 days)' : 'Standard cycle is 28 days'}
          </p>
        </label>
        <input
          type='number'
          value={cycleLength}
          onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
          min={hasPCOD ? 21 : 25}
          max={hasPCOD ? 90 : 35}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '8px' }}>
          Your next period: ~{cycleLength} days from your last period
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          cursor: 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}

export default Settings