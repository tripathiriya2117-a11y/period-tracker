import { useState } from 'react'
import WellnessTips from './WellnessTips'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function HomeScreen({ user, cycles, selectedDate, setSelectedDate, onNav }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const isPeriodDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return cycles.some(c => {
      const start = new Date(c.startDate).toISOString().split('T')[0]
      const end = c.endDate
        ? new Date(c.endDate).toISOString().split('T')[0]
        : start
      return dateStr >= start && dateStr <= end
    })
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      days.push(date)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const today = new Date()
  const cycleDay = cycles.length > 0 ? Math.floor((today - new Date(cycles[0].startDate)) / (1000 * 60 * 60 * 24)) + 1 : null
  const circumference = 2 * Math.PI * 54
  const progress = cycleDay ? cycleDay / 28 : 0
  const offset = circumference * (1 - progress)

  const getPhase = (day) => {
    if (!day) return 'No data yet'
    if (day <= 5) return '🩸 Menstrual Phase'
    if (day <= 13) return '🌿 Follicular Phase'
    if (day <= 16) return '🌸 Ovulation Phase'
    return '🌙 Luteal Phase'
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date)
      onNav('entry')
    }
  }

  return (
    <div className='home'>
      <div className='home-bg-orb' />

      <div className='home-header'>
        <div className='home-greeting'>Good morning</div>
        <div className='home-name'>Hey, {user?.name} 🌙</div>
        <div className='home-cycle-tag'>
          {cycleDay ? `Cycle Day ${cycleDay}` : 'No cycle logged yet'}
        </div>
      </div>

      {/* Circle Progress */}
      <div className='circle-wrap'>
        <svg width='160' height='160' className='circle-svg'>
          <defs>
            <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#7c3aed' />
              <stop offset='100%' stopColor='#ec4899' />
            </linearGradient>
          </defs>
          <circle className='circle-bg' cx='80' cy='80' r='54' />
          <circle
            className='circle-prog'
            cx='80' cy='80' r='54'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className='circle-inner'>
          <div className='circle-day'>{cycleDay || '--'}</div>
          <div className='circle-label'>of 28 days</div>
          <div className='circle-phase'>{getPhase(cycleDay)}</div>
        </div>
      </div>

      <WellnessTips cycleDay={cycleDay} />

      {/* Calendar */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: '#1a1425',
              border: '1px solid #2a1f3d',
              color: '#c9a6ff',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Prev
          </button>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#e8d5ff'
          }}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={handleNextMonth}
            style={{
              background: '#1a1425',
              border: '1px solid #2a1f3d',
              color: '#c9a6ff',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Next →
          </button>
        </div>

        {/* Day headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {DAYS.map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#7a6990',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px'
        }}>
          {calendarDays.map((date, i) => {
            const isSelected = date && date.toDateString() === selectedDate.toDateString()
            const isPeriod = date && isPeriodDay(date)
            const isToday = date && date.toDateString() === today.toDateString()

            return (
              <div
                key={i}
                onClick={() => handleDateClick(date)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : isPeriod
                    ? 'rgba(236, 72, 153, 0.2)'
                    : '#1a1425',
                  border: isSelected
                    ? '1px solid #a855f7'
                    : isPeriod
                    ? '1px solid #ec4899'
                    : '1px solid #2a1f3d',
                  color: date ? '#c9a6ff' : 'transparent',
                  textAlign: 'center',
                  cursor: date ? 'pointer' : 'default',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: isToday ? '0 0 8px rgba(168,85,247,0.5)' : 'none'
                }}
              >
                {date ? date.getDate() : ''}
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div className='action-cards'>
        <div className='action-card' onClick={() => onNav('entry')}>
          <div className='action-card-icon pink'>🩸</div>
          <div className='action-card-title'>Log Period</div>
          <div className='action-card-sub'>Track your cycle</div>
        </div>
        <div className='action-card' onClick={() => onNav('insights')}>
          <div className='action-card-icon purple'>📊</div>
          <div className='action-card-title'>View Insights</div>
          <div className='action-card-sub'>See your trends</div>
        </div>
      </div>

      <button className='fab' onClick={() => onNav('entry')}>+</button>
    </div>
  )
}

export default HomeScreen