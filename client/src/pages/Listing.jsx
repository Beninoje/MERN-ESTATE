import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='mt-[70px]'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        
        <div>
          <div className="flex justify-center items-center px-4 py-3">
            <div className="w-full">
              <h2 className='text-center text-3xl title-color font-semibold'>
                {listing.name}
              </h2>
            </div>
            <div 
              className="relative hover:cursor-pointer flex items-center gap-2 rounded-full secondary-section hover:opacity-70 transition-all duration-300 py-1 px-4"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <FaShare className='desc-color'/>
                <span className='text-lg font-semibold desc-color'>Share</span>
            </div>
          </div>
          <div className="flex justify-center container mx-auto gap-3 ">
              {listing.imageUrls.length > 0 && (
                <div className="w-full flex-1">
                    <img src={listing.imageUrls[0]} alt="" className='w-full h-full rounded-md' />
                </div> 
              )}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {listing.imageUrls.length > 0 && (
                  <div className="w-full">
                      <img src={listing.imageUrls[1]} className='w-full rounded-md' alt="" />
                  </div> 
                )}
                {listing.imageUrls.length > 0 && (
                  <div className="w-full">
                      <img src={listing.imageUrls[2]} className='w-full rounded-md' alt="" />
                  </div> 
                )}
                {listing.imageUrls.length > 0 && (
                  <div className="w-full">
                      <img src={listing.imageUrls[3]} className='w-full rounded-md' alt="" />
                  </div> 
                )}
                {listing.imageUrls.length > 0 && (
                  <div className="w-full">
                      <img src={listing.imageUrls[4]} className='w-full rounded-md' alt="" />
                  </div> 
                )}
              </div>
              
          </div>
            
            
          {copied && (
            <p className='absolute top-0 right-0 z-1 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='grid grid-cols-2 container mx-auto my-7 gap-4'>
            <div className="flex justify-between items-center rounded-md listing-border-stroke px-4 py-9">
              <div className="">
                <h2 className='text-3xl font-semibold title-color pb-4'>
                  ${listing.offer
                    ? listing.discountPrice.toLocaleString('en-US')
                    : listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && ' / month'}
                </h2>
                    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </p>
                    {listing.offer && (
                      <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        ${+listing.regularPrice - +listing.discountPrice} OFF
                      </p>
                    )}
                <p className='flex items-center mt-6 gap-2 desc-color text-md'>
                  <FaMapMarkerAlt className='text-green-700' />
                  {listing.address}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center flex-col gap-2 ml-[150px]">
                  <button className='text-center'>
                  <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_121_39)">
                    <path d="M55.1537 8.52248C52.0118 5.38065 47.8524 3.66347 43.4132 3.66347C38.9739 3.66347 34.8018 5.39337 31.66 8.53519L30.0191 10.1761L28.3528 8.50976C25.211 5.36793 21.0261 3.62531 16.5868 3.62531C12.1603 3.62531 7.98818 5.35521 4.85908 8.48431C1.71726 11.6261 -0.0126503 15.7983 6.96507e-05 20.2375C6.96507e-05 24.6768 1.7427 28.8362 4.88452 31.978L28.7725 55.866C29.1033 56.1967 29.5484 56.3748 29.9809 56.3748C30.4134 56.3748 30.8586 56.2095 31.1893 55.8787L55.1282 32.0289C58.27 28.8871 59.9999 24.7149 59.9999 20.2757C60.0127 15.8364 58.2955 11.6643 55.1537 8.52248ZM52.7114 29.5994L29.9809 52.2408L7.3013 29.5612C4.8082 27.0681 3.43445 23.7609 3.43445 20.2375C3.43445 16.7141 4.79548 13.4069 7.28858 10.9265C9.76897 8.44616 13.0761 7.0724 16.5868 7.0724C20.1103 7.0724 23.4302 8.44616 25.9233 10.9393L28.798 13.814C29.4721 14.4881 30.5533 14.4881 31.2275 13.814L34.0767 10.9647C36.5698 8.47159 39.8897 7.09784 43.4004 7.09784C46.9111 7.09784 50.2183 8.4716 52.7114 10.952C55.2045 13.4451 56.5656 16.7523 56.5656 20.2757C56.5783 23.7991 55.2045 27.1063 52.7114 29.5994Z" fill="#D0191D"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_121_39">
                    <rect width="60" height="60" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
                  </button>
                  <span className='title-color'>
                    Favourites
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className='flex flex-col items-center gap-1'>
                    <div className="flex items-center gap-1">
                      <span className='text-[30px] title-color'>
                        {listing.bedrooms}
                      </span>
                      <FaBed className='text-[25px] title-color' />
                    </div>
                    <div className="ml-9 mt-[-10px]">
                      <p className='desc-color'>
                        {listing.bedrooms > 1
                        ? `Bedrooms `
                        : `Bedroom `}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <div className="flex items-center gap-1">
                        <span className='text-[30px] title-color'>
                          {listing.bathrooms}
                        </span>
                        <FaBath className='text-[25px] title-color' />
                    </div>
                    <div className="ml-9 mt-[-10px]">
                      <p className='desc-color'>
                        {listing.bathrooms > 1
                        ? `Bathrooms `
                        : `Bathroom `}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="">
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                >
                  Contact landlord
                </button>
              )}
              {contact && <Contact listing={listing} />}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            
          </div>
        </div>
      )}
    </main>
  );
}