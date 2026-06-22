import { getPhaseNumber, wellnessTips } from '../utils/wellnessTips'

function WellnessTips({ cycleDay }) {
  const phaseNum = getPhaseNumber(cycleDay)
  
  if (!phaseNum) {
    return (
      <div style={{
        background: '#1a1425',
        border: '1px solid #2a1f3d',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        color: '#7a6990'
      }}>
        Log a cycle to get personalized wellness tips for your phase
      </div>
    )
  }

  const phase = wellnessTips[phaseNum]

  return (
    <div style={{
      background: `linear-gradient(135deg, ${phase.color}15, ${phase.color}08)`,
      border: `1px solid ${phase.color}40`,
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#e8d5ff',
        marginBottom: '12px'
      }}>
        {phase.phase} Tips
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {phase.tips.map((tip, i) => (
          <div key={i} style={{
            background: 'rgba(26,20,37,0.8)',
            border: `1px solid ${phase.color}30`,
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            hover: { transform: 'translateY(-2px)' }
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{tip.icon}</div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#e8d5ff',
              marginBottom: '4px'
            }}>
              {tip.title}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#9b8ab0',
              lineHeight: '1.3'
            }}>
              {tip.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WellnessTips