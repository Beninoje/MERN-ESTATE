import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heartFull } from '../images/index.js'
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
import LisitingImgView from '../components/LisitingImgView.jsx';

const Favourite = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [listing, setListing] = useState([]);

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
      <h1>Your Favourites</h1>
      <div className="grid grid-cols-4 container gap-4  mx-auto">
        {listing.map((listing) => (
          <div key={listing._id} className="flex flex-col col-span-1 border rounded-md px-3 py-4">
            <div className="flex justify-end">
              <button>
                <img src={heartFull} alt="" className='h-[30px] w-[30px] ' />
              </button>
            </div>
            <div className=''>
              <img src={listing.imageUrls[0]} alt="" />
              
            </div>
            <div className="">
              <span>
                {listing.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favourite