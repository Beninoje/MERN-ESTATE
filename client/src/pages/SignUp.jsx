import { Link } from "react-router-dom"

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 '>
        <input type="text" placeholder='Username' className='bg-transparent focus:outline-none border p-3 rounded-lg ' id="username"/>
        <input type="email" placeholder='Email' className='bg-transparent focus:outline-none border p-3 rounded-lg ' id="username"/>
        <input type="password" placeholder='Password' className='bg-transparent focus:outline-none border p-3 rounded-lg ' id="username"/>
        <button className='uppercase bg-slate-500 text-white p-3 rounded-lg'>Sign Up</button>
      </form>
      <div className="flex items-center gap-4 py-4">
        <p>Have an account?</p>
      <Link to={"/sign-in"}>
        <span className="text-blue-700">Sign In</span>
      </Link>
      </div>  
    </div>
    
  )
}

export default SignUp