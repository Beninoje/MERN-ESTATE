import { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';

const Contact = ({listing,onClose }) => {
  const [landlord, setLandlord] = useState(null);
  const { currentUser} = useSelector((state) => state.user);
  const [isContactOpen, setIsContactOpen] = useState(false);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  const handleRecaptchaChange = (value) => {
    console.log("reCAPTCHA value: ", value);
  };

  return (
    <>
    {landlord &&(
      <div className="fixed modal top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 py-7">
        <div className="w-full sm:w-3/4 md:w-1/2 h-full contact-color-section  rounded-md">
          <div className="flex justify-between items-center bg-[#fdf3ed] py-4 px-3 border-b border-gray-200">
            <p className='text-xl text-color'>Contact <span className='font-bold uppercase pl-2'>{landlord.username}</span></p>
            <button onClick={onClose}>
              <svg className='w-[30px] h-[30px]' viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z" fill="black"/>
              </svg>
            </button>
          </div>
          <div className="">
          <div class="w-full px-3 pt-9">
              <form>
                <div class="mb-5">
                  <label
                    for="name"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Full Name
                    <span className='text-red-600 pl-1'>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Full Name"
                    defaultValue={currentUser.username}
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#F7DED0] focus:shadow-md"
                    required
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="email"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Email Address
                    <span className='text-red-600 pl-1'>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@domain.com"
                    defaultValue={currentUser.email}
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#F7DED0] focus:shadow-md"
                    required
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="subject"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Subject
                    <span className='text-red-600 pl-1'>*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="Enter your subject"
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#F7DED0] focus:shadow-md"
                    required
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="message"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Message
                    <span className='text-red-600 pl-1'>*</span>
                  </label>
                  <textarea
                    rows="4"
                    name="message"
                    id="message"
                    placeholder="Type your message"
                    class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#F7DED0] focus:shadow-md"
                    required
                  ></textarea>
                </div>
                <div className="mb-5">
                    <ReCAPTCHA
                      sitekey="6Le4oqEpAAAAAKKV6eAyJpbbnuJSvL0Ih_M6Vl1M"
                      onChange={handleRecaptchaChange}
                      required
                    />
                  </div>
                <div>
                  <button
                    class="hover:shadow-form rounded-md bg-[#e29f88] transition-all ease-in duration-200 hover:opacity-80 py-3 px-8 text-base font-semibold text-white outline-none"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        
      </div>
    )}
    
    </>
  )
}

export default Contact