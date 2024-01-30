import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js';
import {useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/user/user.slice.js';

const OAuth = () => {
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try{
           const provider = new GoogleAuthProvider();
           const auth = getAuth(app);

           const result = await signInWithPopup(auth, provider);
           const res = await fetch('/api/auth/google',{
            hethod:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
           });
           const data = await res.json();
           dispatch(signInSuccess(data))
        }catch(error){
            console.log(error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type="button" className='bg-red-600 text-white p-3 rounded-lg uppercase'>Continue with google</button>
  )
}

export default OAuth