import BASE_URL from '../api'
import { useState } from 'react'
import axios from 'axios'

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your period health assistant 🌸 Ask me anything about your cycle, symptoms, or health!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('${BASE_URL}/api/chat', {
        messages: [...messages, userMsg]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(13,10,20,0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '420px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 24px 16px',
        borderBottom: '1px solid #1e1630',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#f0e6ff' }}>
            Health Assistant 🌸
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7a6990', marginTop: 2 }}>
            Ask me about your cycle
          </div>
        </div>
        <button onClick={onClose} style={{
          background: '#1a1425', border: '1px solid #2a1f3d',
          color: '#c9a6ff', width: 36, height: 36,
          borderRadius: '12px', cursor: 'pointer', fontSize: '1rem'
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                : '#1a1425',
              border: m.role === 'assistant' ? '1px solid #2a1f3d' : 'none',
              color: '#f0e6ff',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
              background: '#1a1425', border: '1px solid #2a1f3d',
              color: '#7a6990', fontSize: '0.875rem'
            }}>
              Thinking... 🌸
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px 32px',
        borderTop: '1px solid #1e1630',
        display: 'flex', gap: '10px'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder='Ask anything...'
          style={{
            flex: 1, background: '#1a1425',
            border: '1px solid #2a1f3d', borderRadius: '12px',
            padding: '12px 16px', color: '#f0e6ff',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button onClick={send} style={{
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          border: 'none', borderRadius: '12px',
          padding: '12px 16px', color: 'white',
          cursor: 'pointer', fontSize: '1rem'
        }}>→</button>
      </div>
    </div>
  )
}

export default ChatBot