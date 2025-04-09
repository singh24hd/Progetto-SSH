import { Link } from 'react-router-dom'
import './App.css' // se hai un CSS dedicato

function LoginPage() {
  return (
    <div className="log">
      <div className="log-form">
        <h2>Log in</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <div>

          <Link to="/homepage">
            <button className="button">Log in</button>
          </Link>
          
          <Link to="/signup">
            <button className="button">Sign Up</button>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
