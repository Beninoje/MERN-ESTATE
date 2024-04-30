import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heartFull } from '../images/index.js'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Link } from 'react-router-dom';
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
import LisitingImgView from '../components/LisitingImgView.jsx';

const Favourite = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [listing, setListing] = useState([]);

  const handleRemoveFromFavourites = async (listingId) => {
      try {
          const res = await fetch(`/api/user/${currentUser._id}/favourites/${listingId}`, {
              method: 'DELETE', 
          });
          console.log("Data processing");
          const data = await res.json();
          console.log("Deleted?");
          if (data.success === false) {
              console.log("Error: " + data.message);
              return;
          }
          console.log("Navigating to favourites");
          window.location.reload();
      } catch (error) {
          console.log("Error:", error.message);
      }
  };


  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}/favourites`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setListing(data);
      } catch (error) {
      }
    };
    fetchFavourites();
  }, [currentUser._id]);

  return (
    <div className='mt-20 text-3xl'>
      <div className="w-full py-10 flex justify-center items-center gap-2">
      <img src={heartFull} alt="" className='h-[30px] w-[30px]' />
        <h1 className='text-4xl'>My Favourites</h1>
      </div>
      <div className="grid grid-cols-4 container gap-4  mx-auto">
      
        {listing.map((listing) => (
            <div key={listing._id} className="flex flex-col col-span-1 border rounded-md px-3 py-4">
                <div className="flex justify-end py-3">
                  <button onClick={() => handleRemoveFromFavourites(listing._id)}>
                    <img src={heartFull} alt="" className='h-[30px] w-[30px] ' />
                  </button>
                </div>
              <Link to={`/listing/${listing._id}`}>
                <div className=''>
                  <img src={listing.imageUrls[0]} alt="" />
                </div>
                
                <div className="">
                  <span className='text-2xl font-semibold '>
                    {listing.name}
                  </span>
                </div>
                <div className="">
                  <span className='text-lg '>
                    ${listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                      {listing.type === 'rent' && ' / month'}
                  </span>
                </div>
                <div className="">
                  <span className='text-xl text-[#c59484]'>
                    {listing.address}
                  </span>
                </div>
                <div className="flex gap-3 items-center py-3">
                      <div className='flex flex-col items-center gap-1'>
                        <div className="flex items-center gap-1">
                          <span className='text-[20px] title-color'>
                            {listing.bedrooms}
                          </span>
                          <FaBed className='text-[18px] title-color' />
                        </div>
                        <div className="mt-[-10px]">
                          <p className='desc-color text-[15px]'>
                            {listing.bedrooms > 1
                            ? `Bedrooms `
                            : `Bedroom `}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col items-center gap-1'>
                        <div className="flex items-center gap-1">
                            <span className='text-[20px] title-color'>
                              {listing.bathrooms}
                            </span>
                            <FaBath className='text-[18px] title-color' />
                        </div>
                        <div className="mt-[-10px]">
                          <p className='desc-color text-[15px]'>
                            {listing.bathrooms > 1
                            ? `Bathrooms `
                            : `Bathroom `}
                          </p>
                        </div>
                      </div>
                </div>
                </Link>
              </div>
          
          
        ))}
      </div>
    </div>
  )
}

export default Favourite