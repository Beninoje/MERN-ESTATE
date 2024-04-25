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
import ReactFlagsSelect from "react-flags-select";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(eyeOpen);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isDeleteAccPopupOpen, setIsDeleteAccPopupOpen] = useState(false);
  const [isDeleteListingPopupOpen, setIsDeleteListingPopupOpen] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState('');
  const [toggleContent, setToggleContent] = useState(1);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showListings, setShowListings] = useState(false);
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
  const handleDeleteAccountPopup = () => {
    setIsDeleteAccPopupOpen(true);
  }

  const handleCancelDelete = () => {
    setIsDeleteAccPopupOpen(false);
  };

  const handleDeleteListingPopup = () => {
    setIsDeleteListingPopupOpen(true);
  }

  const handleCancelDeleteListing = () => {
    setIsDeleteListingPopupOpen(false);
  };
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
      if (!showListings) {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false)
      {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    }else{
      setUserListings([]);
    }
      setShowListings(prevState => !prevState);
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
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setPostalCode('');
    setPostalCodeError('');
  }
  const handlePostalCodeChange = (event) => {
    const code = event.target.value;

    setPostalCode(code);
    if(selectedCountry === 'Canada')
    {
      if(!/^([A-Za-z]\d[A-Za-z] \d[A-Za-z]\d)$/.test(code)) {
        setPostalCodeError('Postal code format for Canada should be "A1B 2C3"');
        setIsFormValid(false);
      } else {
        setPostalCodeError('');
        setIsFormValid(true);
      }
    }
    else if(selectedCountry === 'USA')
    {
      if (!/^(\d{5}-\d{4})|(\d{5})$/.test(code))
      {
        setPostalCodeError('Postal code format for USA should be "12345 or 12345-6789"');
        setIsFormValid(false);
      }
      else{
        setPostalCodeError('');
        setIsFormValid(true);
      }
    }
  }
  return (
    <div className='p-3 container mx-auto mt-[50px]'>
      <h1 className='text-3xl font-semibold text-left mt-[100px] text-[50px]'>Profile</h1>
      <div className="grid grid-cols-4 items-start w-full gap-4 mt-[100px]">
        <div className="grid grid-rows-3 col-span-1 items-start w-full border-[#d3d3d3] border-[1px] rounded-md">
          <div
          onClick={() => toggleContentTab(1)} 
          className={toggleContent === 1 ? "active-tabs p-3" : "tabs"}>
            <span>General</span>
          </div>
          <div
          onClick={() => toggleContentTab(2)} 
          className={toggleContent === 2 ? "active-tabs p-3" : "tabs"}>
            <span>Personal Details</span>
          </div>
          <div
          onClick={() => toggleContentTab(3)} 
          className={toggleContent === 3 ? "active-tabs p-3" : "tabs"}>
            <span>Manage Account</span>
          </div>
          <div
          onClick={() => toggleContentTab(4)}
          
          className={toggleContent === 4 ? "active-tabs p-3" : "tabs"}>
            <span>Listings</span>
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
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Full Name</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='text'
                    placeholder='Full Name'
                    defaultValue={currentUser.fullName}
                    id='fullName'
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Address</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='address'
                    placeholder='123 Example Drive'
                    id='address'
                    defaultValue={currentUser.address}
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Country</h2>
                </div>
                <div className="col-span-3 w-full relative">
                  <select
                    id="country"
                    className="border p-3 rounded-lg w-full outline-none"
                    defaultValue={currentUser.country}
                    //value={selectedCountry}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    <option value="Canada">Canada</option>
                    <option value="USA">USA</option>
                  </select>
              </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="col-span-1">
                  <h2 className='desc-color text-[20px]'>Postal Code</h2>
                </div>
                <div className="col-span-3 w-full">
                  <input
                    type='postalCode'
                    placeholder='Postal Code'
                    id='postalCode'
                    defaultValue={currentUser.postalCode}
                    //value={postalCode}
                    className='border p-3 rounded-lg w-full outline-none'
                    onChange={handleChange}
                    // pattern="[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d"
                    onKeyUp={handlePostalCodeChange}
                  />
                  {postalCodeError && <div className="text-red-500">{postalCodeError}</div>}
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
            <h2 className='title-color text-[30px] font-semibold'>Manage Account</h2>
          </div>
            <div className='flex flex-col  w-full'>
              <div className="flex justify-between items-center w-full border-b-[1px] border-[#d3d3d3] px-10 py-6">
                <div className="">
                  <h2 className='desc-color text-[20px]'>Delete Account</h2>
                </div>
                <div className="">
                    <button
                      className='alt-btn-color py-2 px-4 rounded-md font-semibold'
                      onClick={handleDeleteAccountPopup}
                    >
                      Delete Account 
                    </button>
                    {isDeleteAccPopupOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                        <div className="bg-white p-8 rounded-md shadow-md">
                          <p className="text-2xl mb-4 text-center">Are you sure you want to delete your account?</p>
                          <p className="text-md mb-4 text-center">Deleting your account will result deleting all your personal info and listings</p>
                          <div className="flex justify-evenly items-center mt-10">
                            <button
                              className="bg-red-500 transition-all duration-200 hover:opacity-70 text-white px-6 py-[7px] rounded-md"
                              onClick={handleDeleteUser}
                            >
                              Confirm
                            </button>
                            <button
                              className="bg-gray-500 transition-all duration-200 hover:opacity-70 text-white px-6 py-[7px] rounded-md"
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                  
              </div>
              <div className="flex justify-between items-center w-full  px-10 py-6">
                <div className="">
                  <h2 className='desc-color text-[20px]'>Sign Out</h2>
                </div>
                <div className="">
                    <button
                      className='alt-btn-color py-2 px-10 rounded-md font-semibold'
                      onClick={handleSignOutSubmit}
                      >
                      Sign Out 
                    </button>
                </div>
                  
              </div>
          </div>
        </div>
        <div className={toggleContent === 4 ? "active-content flex flex-col col-span-3 items-start justify-center w-full border-[#d3d3d3] border-[1px] rounded-md" :" content "}>
          <div className="w-full text-left border-b-[1px] border-[#d3d3d3] px-10 py-4">
            <h2 className='title-color text-[30px] font-semibold'>Listings</h2>
          </div>
            <div className='flex flex-col  w-full'>
              <div className="flex items-center justify-between px-10 py-6">
                <button className="alt-btn-color py-[7px] px-5 rounded-md font-semibold" onClick={handleShowListings}>
                  {userListings  && userListings.length > 0 ? 'Collapse Listings' : 'Show Listings'}
                </button>
                <Link
                  className='border-4 border-[#F7DED0] py-[7px] px-5 font-semibold rounded-md transition-all ease duration-200 hover:bg-[#F7DED0]'
                  to={'/create-listing'}
                >
                  Create Listing
                </Link>
              </div>
                <div className="">
                  {userListings && userListings.length > 0 &&
                  userListings.map((listing)=>(
                    <div 
                      key={listing._id}
                      className="py-3 px-5 flex justify-between items-center w-full border gap-3 rounded-md">
                        <Link to={`/listing/${listing._id}`}>
                          <img src={listing.imageUrls[0]} alt="listing image" className='h-[120px] w-[120px] object-contain'/>
                        </Link>
                        <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" 
                          to={`/listing/${listing._id}`}
                          >
                            <p className='text-xl ml-4'>{listing.name}</p>
                        </Link>

                        <div className="flex justify-end items-center gap-4">
                          <button 
                            // onClick={() => handleDeleteListing(listing._id)}
                            onClick={handleDeleteListingPopup}
                            className=' bg-[#F7DED0] uppercase border-4 border-[#F7DED0] p-2 rounded-md transition-all ease duration-200 hover:bg-transparent'
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 11V17" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11V17" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 7H20" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                          </button>
                          {isDeleteListingPopupOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                              <div className="bg-white p-8 rounded-md shadow-md">
                                <p className="text-2xl mb-4 text-center">Are you sure you want to delete your listing?</p>
                                <p className="text-md mb-4 text-center">Deleting your listing will result deleting all your listing's info</p>
                                <div className="flex justify-evenly items-center mt-10">
                                  <button
                                    className="bg-red-500 transition-all duration-200 hover:opacity-70 text-white px-6 py-[7px] rounded-md"
                                    onClick={() => handleDeleteListing(listing._id)}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    className="bg-gray-500 transition-all duration-200 hover:opacity-70 text-white px-6 py-[7px] rounded-md"
                                    onClick={handleCancelDeleteListing}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <Link to={`/update-listing/${listing._id}`}>
                            <button 
                            className='border-4 rounded-md border-[#F7DED0] uppercase p-2 transition-all ease duration-200 hover:bg-[#F7DED0]'
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 16V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H8" stroke="#212121" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12.5 15.8L22 6.2L17.8 2L8.3 11.5L8 16L12.5 15.8Z" stroke="#212121" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </button>
                          </Link>
                        </div>
                    </div>
                  ))
                }  
              </div>
          </div>
        </div>
      </div>
      
      <div className='flex justify-between mt-5'>
        
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <p className='text-red-700 text-xs'>{showListingsError ? 'Error showing listings' : ''}</p>
      <div className="flex flex-col items-center justify-center gap-6">
      
      </div>
      
    </div>
  );
}
