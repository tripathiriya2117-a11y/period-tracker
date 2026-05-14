import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function HomeScreen({ user, cycles, selectedDate, setSelectedDate, onNav }) {
  const today = new Date()

  const calDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 7 + i)
    return d
  })

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

  const getCycleDay = () => {
    if (cycles.length === 0) return null
    const lastCycle = cycles[0]
    const start = new Date(lastCycle.startDate)
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    return diff + 1
  }

  const getPhase = (day) => {
    if (!day) return 'No data yet'
    if (day <= 5) return '🩸 Menstrual Phase'
    if (day <= 13) return '🌿 Follicular Phase'
    if (day <= 16) return '🌸 Ovulation Phase'
    return '🌙 Luteal Phase'
  }

  const cycleDay = getCycleDay()
  const circumference = 2 * Math.PI * 54
  const progress = cycleDay ? cycleDay / 28 : 0
  const offset = circumference * (1 - progress)

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

      {/* Calendar Strip */}
      <div className='cal-strip-label'>Calendar</div>
      <div className='cal-strip'>
        {calDays.map((d, i) => {
          const isSelected = d.toDateString() === selectedDate.toDateString()
          const isPeriod = isPeriodDay(d)
          return (
            <div
              key={i}
              className={`cal-day ${isSelected ? 'selected' : ''} ${isPeriod ? 'period-day' : ''}`}
              onClick={() => { setSelectedDate(d); onNav('entry') }}
            >
              <div className='cal-dow'>{DAYS[d.getDay()]}</div>
              <div className='cal-num'>{d.getDate()}</div>
              {isPeriod && <div className='cal-dot' />}
            </div>
          )
        })}
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