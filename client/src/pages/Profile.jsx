import { useSelector } from "react-redux"
import { MdFileUpload } from 'react-icons/md';
import { useRef, useState, useEffect} from "react";
import { getStorage, uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";
import { app } from "../firebase.js";
const Profile = () => {
  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [file,setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  console.log(formData);
  // firebase storage
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')
  useEffect(()=>{
    if(file)
    {
      handleFileUpload(file);
    }
  },[file]);
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
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4 relative">
        <div className="flex flex-col gap-2 justify-center profile_image_container cursor-pointer">
          <input onChange={(e) => setFile(e.target.files[0])}type="file" ref={fileRef} hidden accept="image/*" />
            <img src={formData.avatar || currentUser.avatar} alt="profile img" className=" rounded-full w-24 h-24 self-center cursor-pointer mt-2 object-cover profile_image " />
            <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
          <div onClick={() => fileRef.current.click()} className="image_upload">
            <MdFileUpload className="text-white w-8 h-8"/>
          </div>
        </div>
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