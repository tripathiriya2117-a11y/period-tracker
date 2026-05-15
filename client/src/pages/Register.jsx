import BASE_URL from '../api'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('${BASE_URL}api/auth/register', {
        name,
        email,
        password
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))

      navigate('/dashboard')

    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <h1>🌸 Period Tracker</h1>
        <h2>Create Account</h2>

        {error && <div className='error'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password (min 6 characters)'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register