import { useState } from "react"
import { useCookies} from 'react-cookie'

const Auth = () => {
    const [cookies, setCookies, removeCookies] = useCookies(null)
    const [isLogIn, setIsLogin] = useState(true)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    console.log(cookies)

    const viewLogin = (status) => {
      setError(null)
      setIsLogin(status)
    }

    const handleSubmit = async (e, endpoint) => {
      e.preventDefault()
      if (!isLogIn && password !== confirmPassword){
          setError('Make sure passwords match!')
          return
      }
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, password})
      })
      const data = await response.json()
      
      if (data.detail) {
      setError(data.detail)
      } else {
        setCookies('Email', data.email)
        setCookies('AuthToken', data.token)

        window.location.reload()
      }
    }

    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form>
            <h2>{isLogIn ? 'Please log in' : 'Pleace sign up'}</h2>
            <input 
              type="email" 
              placeholder="email" 
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              />
            {!isLogIn && <input 
              type="password" 
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />}
            <input 
              type="submit" 
              className="create" 
              onClick={(e) => handleSubmit(e,isLogIn ? 'login' : 'signup')}
            />
            {error && <p className="error-tag">{error}</p>}
          </form>
          <div className="auth-options">
            <button 
              onClick={() => viewLogin(false)}
              className={!isLogIn ? "active-button" : "inactive-button"}
              >Sign Up
            </button>
            <button 
              onClick={() => viewLogin(true)}
              className={isLogIn ? "active-button" : "inactive-button"}
              >Login
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Auth
  