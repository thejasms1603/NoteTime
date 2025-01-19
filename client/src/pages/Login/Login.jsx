import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/input/PasswordInput'
import { validationEmail } from '../../utils/helper'

const Login = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ error, setError] = useState(null);


    const handleLogin = async (e) =>{
        e.preventDefault();
        if(!validationEmail(email)){
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
          setError("Please enter a valid password.");
          return;
        }
    setError("");

    // Login API Call
    }



  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>

            <input
              className='input-box'
              type='text'
              placeholder='enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>
              {" "}
              Login
            </button>

            <p className='text-sm text-center mt-4'>
              Not Registered Yet?{" "}
              <Link to='/signup' className='font-medium text-primary underline'>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login