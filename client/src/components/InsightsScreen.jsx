function InsightsScreen({ cycles, onNav }) {

  const getAvgCycleLength = () => {
    if (cycles.length < 2) return '--'
    const lengths = []
    for (let i = 0; i < cycles.length - 1; i++) {
      const curr = new Date(cycles[i].startDate)
      const prev = new Date(cycles[i + 1].startDate)
      const diff = Math.floor((curr - prev) / (1000 * 60 * 60 * 24))
      if (diff > 0 && diff < 60) lengths.push(diff)
    }
    if (lengths.length === 0) return '--'
    return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
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

  const getDaysUntil = (date) => {
    if (!date) return '--'
    const today = new Date()
    const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const nextPeriod = getNextPeriod()
  const daysUntil = getDaysUntil(nextPeriod)
  const avgCycle = getAvgCycleLength()
  const avgPeriod = getAvgPeriodLength()

  // Build chart bars from last 7 cycles
  const chartData = cycles.slice(0, 7).reverse().map((c, i) => {
    const start = new Date(c.startDate)
    const end = c.endDate ? new Date(c.endDate) : start
    const len = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
    const month = start.toLocaleString('default', { month: 'short' })
    return { len, month, highlight: i === cycles.slice(0, 7).length - 1 }
  })

  const maxLen = Math.max(...chartData.map(d => d.len), 1)

  return (
    <div className='insights'>
      <div className='insights-header'>
        <div className='insights-title'>Your Insights</div>
        <div className='insights-sub'>
          Based on {cycles.length} logged {cycles.length === 1 ? 'cycle' : 'cycles'}
        </div>
      </div>

      <div className='insights-body'>

        {/* Prediction Card */}
        <div className='predict-card'>
          <div className='predict-label'>Next Period</div>
          <div className='predict-date'>
            {nextPeriod
              ? nextPeriod.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })
              : 'Log a cycle to predict'}
          </div>
          {nextPeriod && (
            <div className='predict-days'>
              {daysUntil > 0
                ? `In ${daysUntil} days`
                : daysUntil === 0
                ? 'Today!'
                : `${Math.abs(daysUntil)} days ago`}
            </div>
          )}
          <div className='predict-badge'>
            {cycles.length >= 2 ? '✦ High confidence' : '✦ Log more cycles for accuracy'}
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className='chart-card'>
            <div className='chart-card-header'>
              <div className='chart-title'>Period Duration History</div>
              <div className='chart-period'>Last {chartData.length} cycles</div>
            </div>
            <div className='chart-area'>
              {chartData.map((d, i) => (
                <div key={i} className='chart-bar-wrap'>
                  <div
                    className={`chart-bar ${d.highlight ? 'highlight' : ''}`}
                    style={{ height: `${(d.len / maxLen) * 100}%` }}
                  />
                  <div className='chart-bar-label'>{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className='stat-cards'>
          <div className='stat-card'>
            <div className='stat-icon'>🔄</div>
            <div className='stat-value'>{avgCycle}</div>
            <div className='stat-unit'>days avg</div>
            <div className='stat-label'>Cycle Length</div>
          </div>
          <div className='stat-card'>
            <div className='stat-icon'>🩸</div>
            <div className='stat-value'>{avgPeriod}</div>
            <div className='stat-unit'>days avg</div>
            <div className='stat-label'>Period Duration</div>
          </div>
        </div>

        {/* Recent Logs */}
        {cycles.length > 0 && (
          <div className='chart-card'>
            <div className='chart-card-header'>
              <div className='chart-title'>Recent Logs</div>
            </div>
            {cycles.slice(0, 5).map((c, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < 4 ? '1px solid #1e1630' : 'none'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#e8d5ff', fontWeight: 500 }}>
                    {new Date(c.startDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7a6990', marginTop: 2 }}>
                    {c.mood && `Mood: ${c.mood}`}
                    {c.symptoms?.length > 0 && ` · ${c.symptoms.slice(0, 2).join(', ')}`}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(236,72,153,0.15)',
                  color: '#f472b6',
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: 500
                }}>
                  {c.discharge || 'logged'}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default InsightsScreen