const chat = async (req, res) => {
  try {
    const { messages } = req.body

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You are a compassionate period health assistant. 
        Help users understand their menstrual cycle, symptoms, and health. 
        Keep responses concise, warm, and medically accurate. 
        Always remind users to consult a doctor for serious concerns.`,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    const data = await response.json()
    const reply = data.content[0].text

    res.json({ reply })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { chat }