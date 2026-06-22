export const getPhaseNumber = (cycleDay) => {
  if (!cycleDay) return null
  if (cycleDay <= 5) return 1 // Menstrual
  if (cycleDay <= 13) return 2 // Follicular
  if (cycleDay <= 16) return 3 // Ovulatory
  return 4 // Luteal
}

export const wellnessTips = {
  1: {
    phase: '🩸 Menstrual Phase',
    color: '#ec4899',
    tips: [
      { icon: '🛏️', title: 'Rest & Recovery', desc: 'Your body needs extra energy. Prioritize sleep and relaxation.' },
      { icon: '🍫', title: 'Nourish Well', desc: 'Eat iron-rich foods: spinach, beans, dark chocolate.' },
      { icon: '🧘', title: 'Gentle Movement', desc: 'Try yoga, walking, or stretching instead of intense workouts.' },
      { icon: '💧', title: 'Stay Hydrated', desc: 'Drink extra water to ease cramping and fatigue.' },
      { icon: '🌡️', title: 'Heat Therapy', desc: 'Use a heating pad for 15-20 mins to relieve cramps.' }
    ]
  },
  2: {
    phase: '🌿 Follicular Phase',
    color: '#7c3aed',
    tips: [
      { icon: '⚡', title: 'High Energy Days', desc: 'You\'re energized! Great time for intense workouts.' },
      { icon: '🎯', title: 'Start Projects', desc: 'Your creativity peaks. Begin new tasks or challenges.' },
      { icon: '🤝', title: 'Social Time', desc: 'You\'re more outgoing. Great for socializing & networking.' },
      { icon: '🥗', title: 'Light Foods', desc: 'Eat lighter meals with plenty of fresh fruits & veggies.' },
      { icon: '🧠', title: 'Peak Focus', desc: 'Your mental clarity is high. Tackle complex problems now.' }
    ]
  },
  3: {
    phase: '🌸 Ovulation Phase',
    color: '#f472b6',
    tips: [
      { icon: '🏃', title: 'Peak Performance', desc: 'Your strength & endurance are highest. Max out your workouts!' },
      { icon: '✨', title: 'Confidence Boost', desc: 'You feel most confident. Great for presentations & important talks.' },
      { icon: '🗣️', title: 'Speak Up', desc: 'Your communication is best right now. Share your ideas.' },
      { icon: '🥚', title: 'Protein Focus', desc: 'Eat protein-rich foods to support your energy levels.' },
      { icon: '💪', title: 'Challenge Yourself', desc: 'Push your limits physically & mentally during this peak window.' }
    ]
  },
  4: {
    phase: '🌙 Luteal Phase',
    color: '#a855f7',
    tips: [
      { icon: '📋', title: 'Plan & Organize', desc: 'Perfect time for planning, organizing, and wrapping up projects.' },
      { icon: '🍫', title: 'Satisfy Cravings', desc: 'Carbs & chocolate cravings peak. Eat mindfully but enjoy.' },
      { icon: '🤐', title: 'Reflect Inward', desc: 'You\'re more introspective. Great for journaling & self-reflection.' },
      { icon: '🧘‍♀️', title: 'Lower Intensity', desc: 'Reduce intense exercise. Opt for yoga, pilates, or walks.' },
      { icon: '🌙', title: 'Early Sleep', desc: 'Sleep needs increase. Aim for 8-9 hours. Prioritize rest.' }
    ]
  }
}