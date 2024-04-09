import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/user.slice.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceAngry } from '@fortawesome/free-solid-svg-icons';
import { google } from '../images/index.js';
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with google: ', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='w-full bg-[#ffffff] title-color flex items-center justify-center p-3 rounded-lg uppercase transition-all ease-in duration-150 font-semibold hover:bg-[#E2BFB3] border-2 border-[#E2BFB3]'
    >
      <img src={google} alt="" className='w-[25px] h-[25px] mr-3' />
      Continue with google
    </button>
  );
}