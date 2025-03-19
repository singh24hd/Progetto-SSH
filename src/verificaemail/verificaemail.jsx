import './verificaemail.css'

function VerificaEmail() {
  return (
    <>
      <div className='log'>
          <div className='log-form'>
            <h2>Verify the Email</h2>
            <h5>abbiamo mandato una mail a:</h5>
            <input type="text" placeholder="OTP"></input>
            <div type='button'>
              <Link to="/login">
                <button className='button' >Verify</button>
              </Link>
            </div>
          </div>
      </div>
    </>
  )
}

export default VerificaEmail