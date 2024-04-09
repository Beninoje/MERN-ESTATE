import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux';
import {signInStart, signInSuccess, signInFailure } from '../redux/user/user.slice.js'
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

import OAuth from "../components/OAuth.jsx";
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div class="flex flex-col md:flex-row h-screen items-center">
        <div class="hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          <img src={homeImage} alt="" class="w-full h-full object-cover"/>
        </div>
        <div class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
              flex items-center justify-center">
          <div class="w-full h-100">
            <h1 class="text-xl md:text-2xl font-bold title-color leading-tight mt-12">Log In To Your Account</h1>
            <form class="mt-6" onSubmit={handleSubmit}>
              <div>
                <label class="block text-gray-700">Email Address</label>
                <input
                  type='email'
                  placeholder='Email'
                  className='border-2 p-3 rounded-lg w-full focus:border-[#E2BFB3] focus:border-2 focus:outline-none mt-2'
                  id='email'
                  onChange={handleChange}
                  required
                />
              </div>

              <div class="mt-4">
                <label class="block text-gray-700">Password</label>
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
                class="w-full block bg-[#E2BFB3] uppercase hover:opacity-80 transition-all ease-in duration-150 text-gray-900 text-lg font-semibold rounded-lg px-4 py-3 mt-6"
                disabled={loading}>
                  {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>
            <hr class="my-6 border-gray-300 w-full"/>

            <OAuth/>

            <p class="mt-8">Need an account? 
              <Link to={'/sign-up'}>
                <a href="#" class="text-gray-900 hover:underline font-semibold pl-2">Create an account</a>
              </Link>
            </p>
          </div>
          
        </div>
        
    </div>
  );
}

export default SignIn