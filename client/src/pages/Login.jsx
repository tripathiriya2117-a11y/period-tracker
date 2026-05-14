import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
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
      <div className='auth-left'>
        <div className='auth-brand'>
          <span className='brand-icon'>🌸</span>
          <h1>FloraCycle</h1>
          <p>Track your cycle, understand your body</p>
        </div>
        <div className='floating-circles'>
          <div className='circle c1'></div>
          <div className='circle c2'></div>
          <div className='circle c3'></div>
        </div>
      </div>

      <div className='auth-right'>
        <div className='auth-box'>
          <h2>Welcome back 💜</h2>
          <p className='auth-subtitle'>Sign in to your account</p>

          {error && <div className='error'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <HiMail className='input-icon' />
              <input
                type='email'
                placeholder='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='input-group'>
              <HiLockClosed className='input-icon' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className='eye-icon'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>

            <button type='submit' disabled={loading}>
              {loading ? (
                <span className='loading-spinner'>Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className='auth-switch'>
            Don't have an account?{' '}
            <Link to='/register'>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login