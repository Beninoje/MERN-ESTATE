import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";
import {
  comprehensiveImg, 
  homeImage, 
  cottage,
  apartment,
  townhouse,
  hotel,
  bungalow,
  videoImg1,
  getStarted
} from '../images/index.js'
const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData(
      {
        ...formData,
        [e.target.id] : e.target.value,
      }
    )
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
  }
  return (
    <div className="flex flex-col md:flex-row h-screen items-center">
        <div className="hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          <img src={homeImage} alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
              flex items-center justify-center">
          <div className="w-full h-100">
            <h1 className="md:text-3xl font-bold title-color leading-tight mt-12">
              Create Your Account
            </h1>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div clclassNameass="mt-4">
                  <label class="block text-gray-700">Username</label>
                  <input
                    type='text'
                    placeholder='Username'
                    className='border-2 p-3 rounded-lg w-full focus:border-[#E2BFB3] focus:border-2 focus:outline-none mt-2'
                    id='username'
                    onChange={handleChange}
                    required
                  />
                </div>
              <div className="mt-4">
                <label className="block text-gray-700">Email Address</label>
                <input
                  type='email'
                  placeholder='Email'
                  className='border-2 p-3 rounded-lg w-full focus:border-[#E2BFB3] focus:border-2 focus:outline-none mt-2'
                  id='email'
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type='password'
                  placeholder='Password'
                  className='border-2 p-3 rounded-lg w-full focus:border-[#E2BFB3] focus:border-2 focus:outline-none mt-2'
                  id='password'
                  onChange={handleChange}
                  required
                />
                {error && <p className='text-red-500 mt-5'>{error}</p>}
              </div>

              <button 
                className="w-full block bg-[#E2BFB3] uppercase hover:opacity-80 transition-all ease-in duration-150 text-gray-900 text-lg font-semibold rounded-lg px-4 py-3 mt-6"
                disabled={loading}>
                  {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
            <hr class="my-6 border-gray-300 w-full"/>

            <OAuth/>

            <p className="mt-8 flex item-center">Have an account? 
              <Link to={'/sign-in'}>
                <p className="text-gray-900 hover:underline font-semibold pl-2">Sign In</p>
              </Link>
            </p>
          </div>
          
        </div>
        
    </div>
    
  )
}

export default SignUp