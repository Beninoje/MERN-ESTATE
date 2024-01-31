import { useSelector } from "react-redux"

const Profile = () => {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <img src={currentUser.avatar} alt="profile img" className="rounded-full w-24 h-24 self-center cursor-pointer mt-2 object-cover" />
        <input
          type='type'
          placeholder={currentUser.username}
          className='border p-3 rounded-lg'
          id='username'
          
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
        />
        <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Update
        </button>
        <button
          className='bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            create listing
        </button>
        <div className="flex justify-between item-center mt-2">
          <span className="text-red-500 cursor-pointer">Delete Account</span>
          <span className="text-red-500 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  )
}

export default Profile