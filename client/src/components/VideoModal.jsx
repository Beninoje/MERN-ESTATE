import React, { useState, useEffect } from 'react'
import videoImg2 from '../images/videoImg.png';
import videoHouse from '../videos/house_tour.mp4';

const VideoModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    //useEffect(()=>{
    // const handleClickOutSideModal = (e) =>{
    //   if(isModalOpen && !e.target.closest('.modal'))
    //   {
    //     setIsModalOpen(false);
    //   }
    //   document.addEventListener('click', handleClickOutSideModal);

    //   return () =>{
    //     document.removeEventListener('click', handleClickOutSideModal);
    //   }
    // };
  //},[isModalOpen]);
  
  const handleVideo = () =>{
    setIsModalOpen(true);
  }
  return (
    <div>
                <div 
                className="
                  absolute 
                  xl:bottom-[-20px] 
                  xl:right-[-20px]
                  lg:bottom-[-20px] 
                  lg:right-[-20px]
                  md:bottom-[-30px] 
                  md:right-[0px]
                  sm:bottom-[-10px] 
                  sm:right-[-10px]"
                >
                  <img 
                    src={videoImg2} 
                    alt=""
                    className='
                    lg:w-[200px] 
                    lg:h-[200px] 
                    md:w-[200px] 
                    md:h-[200px] 
                    sm:w-[150px] 
                    sm:h-[150px]
                    rounded-lg 
                    relative 
                    border-[3px] 
                    border-[#FFBE98]' 
                  />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                        <button className='cursor-pointer z-10 lg:w-[100px] md:w-[90px] sm:w-[90px]' onClick={handleVideo}>
                          <svg viewBox="0 0 129 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M64.5 112.75C94.185 112.75 118.25 89.8043 118.25 61.5C118.25 33.1954 94.185 10.25 64.5 10.25C34.8147 10.25 10.75 33.1954 10.75 61.5C10.75 89.8043 34.8147 112.75 64.5 112.75Z" fill="#333333"/>
                            <path d="M82.8486 66.9274L57.4776 81.2097C53.3937 83.5088 48.375 80.5163 48.375 75.7824V47.2174C48.375 42.4835 53.3937 39.4913 57.4776 41.7902L82.8486 56.0726C87.0503 58.4383 87.0503 64.5617 82.8486 66.9274Z" fill="#333333"/>
                          </svg>
                        </button>
                        
                      </div>
                      {/* <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.3)] opacity-100 z-[9]">
                      </div> */}
                </div>
        {isModalOpen &&(
                          <div className="fixed modal top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                            <div className="modal shadow-lg">
                              {/* Video Player */}
                              <video controls autoPlay className="w-full rounded-lg">
                                <source src={videoHouse} type="video/mp4" />
                              </video>
                  
                              {/* Close Button */}
                              <button className="absolute top-[20px] right-[20px] p-2" onClick={() => setIsModalOpen(false)}>
                              <svg className='w-[40px] h-[40px]' viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z" fill="white"/>
                              </svg>
                              </button>
                            </div>
                          </div>
        )}
    </div>
  )
}

export default VideoModal