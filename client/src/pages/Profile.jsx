import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { eyeOpen, eyeCrosses } from '../images/index.js';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/user/user.slice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(eyeOpen);
  const [toggleContent, setToggleContent] = useState(1);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase 
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handleSignOutSubmit = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false)
      {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setEyeIcon(passwordVisible ? eyeOpen: eyeCrosses);
  }
  const toggleContentTab = (index) => {
    setToggleContent(index)
  }
  return (
    <div className='p-3 container mx-auto mt-[50px]'>
      <h1 className='text-3xl font-semibold text-left mt-[100px] text-[50px]'>Profile</h1>
      <div className="grid grid-cols-4 items-start gap-4 mt-[100px]">
        <div className="grid grid-rows-3 col-span-1 items-start justify-between w-full  border-[#d3d3d3] border-[1px] rounded-md">
          <div
          onClick={() => toggleContentTab(1)} 
          className={toggleContent === 1 ? "active-tabs p-3" : "row-span-1 cursor-pointer p-3 w-full"}>
            <span>General</span>
          </div>
          <div
          onClick={() => toggleContentTab(2)} 
          className={toggleContent === 2 ? "active-tabs p-3" : "row-span-1 cursor-pointer p-3 w-full"}>
            <span>Personal Details</span>
          </div>
          <div
          onClick={() => toggleContentTab(3)} 
          className={toggleContent === 3 ? "active-tabs p-3" : "row-span-1 cursor-pointer p-3 w-full"}>
            <span>About Me</span>
          </div>
        </div>
        <div className={toggleContent === 1 ? "active-content flex flex-col col-span-3 items-start justify-center w-full border-[#d3d3d3] border-[1px] rounded-md" :" content "}>
          <div className="w-full text-left border-b-[1px] border-[#d3d3d3] px-10 py-4">
            <h2 className='title-color text-[30px] font-semibold'>General</h2>
          </div>
            <form onSubmit={handleSubmit} className='flex flex-col  w-full'>
              <div className="grid grid-cols-6 items-center w-full border-b-[1px] border-[#d3d3d3] px-10 py-4">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'> Profile Picture</h2>
                </div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                  />
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile picture'
                  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />
                </div>
                <div className="cursor-pointer col-span-1 btn-color text-center title-color rounded-full font-bold py-2" onClick={() => fileRef.current.click()}>
                  <span>Upload New</span>
                </div>
                <p className='text-sm self-center'>
                  {fileUploadError ? (
                    <span className='text-red-700'>
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className='text-green-700'>Image successfully uploaded!</span>
                  ) : (
                    ''
                  )}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Username</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='text'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    id='username'
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Email</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='email'
                    placeholder='email'
                    id='email'
                    defaultValue={currentUser.email}
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
              <div className="col-span-1">
                <h2 className='desc-color text-[20px]'>Password</h2>
              </div>
              <div className="col-span-3 w-full relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder='password'
                  onChange={handleChange}
                  id='password'
                  className='border p-3 rounded-lg w-full outline-none'
                />
                <div onClick={togglePasswordVisibility} className="absolute cursor-pointer top-1/2 transform -translate-y-1/2 right-[10px] ">
                  <img src={eyeIcon} alt="" className='w-[25px] h-[25px]'/>
                </div>
              </div>
            </div>
           <div className="my-[30px] w-full flex justify-center">
              <button
                  disabled={loading}
                  className='btn-color title-color font-semibold rounded-lg text-center py-3 px-7 uppercase '
                >
                {loading ? 'Loading...' : 'update account'}
              </button>
            </div> 
            
            
          </form>
        </div>
        <div className={toggleContent === 2 ? "active-content flex flex-col col-span-3 items-start justify-center w-full border-[#d3d3d3] border-[1px] rounded-md" :" content "}>
          <div className="w-full text-left border-b-[1px] border-[#d3d3d3] px-10 py-4">
            <h2 className='title-color text-[30px] font-semibold'>Personal Details</h2>
          </div>
            <form onSubmit={handleSubmit} className='flex flex-col  w-full'>
              <div className="grid grid-cols-6 items-center w-full border-b-[1px] border-[#d3d3d3] px-10 py-4">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'> Profile Picture</h2>
                </div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                  />
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile picture'
                  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />
                </div>
                <div className="cursor-pointer col-span-1 btn-color text-center title-color rounded-full font-bold py-2" onClick={() => fileRef.current.click()}>
                  <span>Upload New</span>
                </div>
                <p className='text-sm self-center'>
                  {fileUploadError ? (
                    <span className='text-red-700'>
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className='text-green-700'>Image successfully uploaded!</span>
                  ) : (
                    ''
                  )}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Username</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='text'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    id='username'
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Email</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='email'
                    placeholder='email'
                    id='email'
                    defaultValue={currentUser.email}
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
              <div className="col-span-1">
                <h2 className='desc-color text-[20px]'>Password</h2>
              </div>
              <div className="col-span-3 w-full relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder='password'
                  onChange={handleChange}
                  id='password'
                  className='border p-3 rounded-lg w-full outline-none'
                />
                <div onClick={togglePasswordVisibility} className="absolute cursor-pointer top-1/2 transform -translate-y-1/2 right-[10px] ">
                  <img src={eyeIcon} alt="" className='w-[25px] h-[25px]'/>
                </div>
              </div>
            </div>
           <div className="my-[30px] w-full flex justify-center">
              <button
                  disabled={loading}
                  className='btn-color title-color font-semibold rounded-lg text-center py-3 px-7 uppercase '
                >
                {loading ? 'Loading...' : 'update account'}
              </button>
            </div> 
            
            
          </form>
        </div>
        <div className={toggleContent === 3 ? "active-content flex flex-col col-span-3 items-start justify-center w-full border-[#d3d3d3] border-[1px] rounded-md" :" content "}>
          <div className="w-full text-left border-b-[1px] border-[#d3d3d3] px-10 py-4">
            <h2 className='title-color text-[30px] font-semibold'>About Me</h2>
          </div>
            <form onSubmit={handleSubmit} className='flex flex-col  w-full'>
              <div className="grid grid-cols-6 items-center w-full border-b-[1px] border-[#d3d3d3] px-10 py-4">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'> Profile Picture</h2>
                </div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                  />
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile picture'
                  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />
                </div>
                <div className="cursor-pointer col-span-1 btn-color text-center title-color rounded-full font-bold py-2" onClick={() => fileRef.current.click()}>
                  <span>Upload New</span>
                </div>
                <p className='text-sm self-center'>
                  {fileUploadError ? (
                    <span className='text-red-700'>
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className='text-green-700'>Image successfully uploaded!</span>
                  ) : (
                    ''
                  )}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Username</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='text'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    id='username'
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Email</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='email'
                    placeholder='email'
                    id='email'
                    defaultValue={currentUser.email}
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
              <div className="col-span-1">
                <h2 className='desc-color text-[20px]'>Password</h2>
              </div>
              <div className="col-span-3 w-full relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder='password'
                  onChange={handleChange}
                  id='password'
                  className='border p-3 rounded-lg w-full outline-none'
                />
                <div onClick={togglePasswordVisibility} className="absolute cursor-pointer top-1/2 transform -translate-y-1/2 right-[10px] ">
                  <img src={eyeIcon} alt="" className='w-[25px] h-[25px]'/>
                </div>
              </div>
            </div>
           <div className="my-[30px] w-full flex justify-center">
              <button
                  disabled={loading}
                  className='btn-color title-color font-semibold rounded-lg text-center py-3 px-7 uppercase '
                >
                {loading ? 'Loading...' : 'update account'}
              </button>
            </div> 
            
            
          </form>
        </div>
      </div>
      
      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <Link
            className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
            to={'/create-listing'}
          >
            Create Listing
          </Link>
        <span 
        className='text-red-700 cursor-pointer'
        onClick={handleSignOutSubmit}>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 text-xs'>{showListingsError ? 'Error showing listings' : ''}</p>
      <div className="flex flex-col items-center justify-center gap-6">
      {userListings && userListings.length > 0 &&
        userListings.map((listing)=>(
          <div 
            key={listing._id}
            className="p-3 flex justify-between items-center w-full border rounded-md">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing image" className='h-20 w-20 object-contain'/>
              </Link>
              <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" 
                to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center gap-2">
                <button 
                onClick={() => handleDeleteListing(listing._id)}
                className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button 
                  className='text-green-700 uppercase'
                  >
                    Edit
                  </button>
                </Link>
              </div>
          </div>
        ))
      
      }
      </div>
      
    </div>
  );
}
