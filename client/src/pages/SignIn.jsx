import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const SignIn = () => {
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
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit}className='flex flex-col gap-4 '>
        <input type="email" placeholder='Email'  className='bg-transparent focus:outline-none border p-3 rounded-lg ' id="email" onChange={handleChange}/>
        <input type="password" placeholder='Password'  className='bg-transparent focus:outline-none border p-3 rounded-lg ' id="password" onChange={handleChange}/>
        <button disabled={loading} className='uppercase bg-slate-500 text-white p-3 rounded-lg'>
          {loading ? 'Loading...' : 'Sign In'}
          </button>
      </form>
      <div className="flex items-center gap-4 py-4">
        <p>Dont have an account?</p>
      <Link to={"/sign-up"}>
        <span className="text-blue-700">Sign Up</span>
      </Link>
      </div> 
      {error && <p className="text-red-500 mt-5">{error}</p>} 
    </div>
  )
}

export default SignIn