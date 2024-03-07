import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import homeImage from '../images/homeImage.jpg';
import cottage from '../images/cottage.jpg';
import townhouse from '../images/townhouse.jpg';
import hotel from '../images/hotel.jpg';
import bungalow from '../images/bungalow.jpeg';
import apartment from '../images/apartment.jpg';
import comprehensiveImg from '../images/comprehensive.png';
import profile1 from '../images/profile1.jpeg';
import profile2 from '../images/profile2.jpg';
import profile3 from '../images/profile3.jpg';
import videoImg1 from '../images/videoImg1.png';

import { FaSearch, FaMoneyBillAlt, FaRegBuilding } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VideoModal from '../components/VideoModal';
const Home = () => {
  const navigate = useNavigate();
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  SwiperCore.use([Navigation]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(()=>{
    const fetchOfferListings = async() =>{
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () =>{
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () =>{
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  },[])
  
  
  return (
    <div>
      {/* top */}
      <div className="flex flex-col lg:flex-row lg:gap-[40px] justify-between items-center container mx-auto pt-[100px] pb-[50px] ">
        <div className="order-2 lg:order-1">
            <h1 className='title-color text-6xl font-bold'>Discover Most Suitable Property</h1>
            <p className='desc-color text-xl py-[30px]'>Find a variety of properties that suit you very easily <br></br>& forget all difficulties in finding a residence for you</p>
            <form
              onSubmit={handleSubmit}
              className='rounded-lg flex items-center input-border-stroke w-[600px] p-3'
            >
            <FaSearch className='text-slate-600 absolute text-xl' />
            <input
                type='text'
                placeholder='Ex: Modern...'
                className='relative bg-transparent focus:outline-none w-[500px] rounded-lg pl-[40px] text-xl'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <button className='btn-color py-2 px-6 rounded-lg title-color font-semibold tracking-wider transition-all duration-200 '>
              Search
            </button>
          </form>
        </div>
        <div className="order-1 lg:order-2">
            <img 
            src={homeImage} 
            alt="home image"
            className='w-[500px] h-[600px] object-cover rounded-t-[300px] border-stroke  ' />
        </div>
        
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220"><path fill="#FEECE2" fill-opacity="1" d="M0,128L120,138.7C240,149,480,171,720,170.7C960,171,1200,149,1320,138.7L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
      <div className="primary-section py-[50px] flex flex-col items-center justify-center w-full">    
        <h2 className='title-color text-4xl font-bold text-center'>How it works?</h2>
        <div className="flex justify-center items-center container mx-auto flex-wrap mt-[50px]  gap-4">
          <div className="flex-1 flex flex-col items-center justify-center text-center py-[60px]">
              <div className="p-5 bg-slate-600 rounded-[20px]">
                <FaSearch className='text-slate-100 text-xl' />
              </div>
            <h2 className='title-color text-xl font-semibold pt-[30px]'>Search for your comfort</h2>
            <p className='desc-color'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quasi veniam cumque modi vitae harum.</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-[60px] px-5">
            <div className="p-5 bg-slate-600 rounded-[20px]">
              <FaMoneyBillAlt className='text-slate-100 text-xl' />
            </div>
            <h2 className='title-color text-xl font-semibold pt-[30px]'>Instant Valuation</h2>
            <p className='desc-color'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quasi veniam cumque modi vitae harum.</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-[60px]">
            <div className="p-5 bg-slate-600 rounded-[20px]">
              <FaRegBuilding className='text-slate-100 text-xl' />
            </div>
            <h2 className='title-color text-xl font-semibold pt-[30px]'>Track Property</h2>
            <p className='desc-color'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quasi veniam cumque modi vitae harum.</p>
          </div>
        </div>
      </div>
      {/* listings results for offer, sale, and rent */}
      <div className="flex flex-col justify-center items-center py-[100px]">
        <div className="py-[60px]">
          <h2 className='title-color text-4xl font-bold text-center'>Discover Our Featured Listings</h2>
          <p className='desc-color'>These featured listings contain exclusive real estate opportunities within the city</p>
        </div>  
        <div className="flex justify-between container mx-auto">
          <Swiper 
            className='swiper-container'
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            slidesPerView={3}
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className="flex justify-center">
                <ListingItem listing={listing} />
                </div>
                
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
      {/* Explore House Types */}
      <div className="py-[100px] primary-section">
        <div className="container mx-auto flex flex-col justify-center items-center">
            <div className="text-center py-[60px]">
              <h2 className='title-color text-4xl font-bold'>Explore House Types</h2>
              <p className='desc-color'>Explore all the different types of apartments so you can choose the best option for you</p>
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div class="row-span-3 relative">
                    <img 
                      src={hotel} 
                      alt=""
                      className='h-full w-[300px] object-cover block rounded-lg' />
                      <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.5)] flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 z-10">
                        <p class="text-center title-color text-3xl font-semibold">Hotel</p>
                      </div>
                </div>
                <div class="row-span-2 relative">
                    <img 
                      src={bungalow} 
                      alt=""
                      className='h-full w-[300px] object-cover block rounded-lg' />
                      <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.5)] flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 z-10">
                        <p class="text-center title-color text-3xl font-semibold">Bungalow</p>
                      </div>
                </div>
                <div class="col-span-2 relative">
                    <img 
                      src={townhouse} 
                      alt=""
                      className='h-[300px] w-full object-cover block rounded-lg' />
                      <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.5)] flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 z-10">
                        <p class="text-center title-color text-3xl font-semibold">Townhouse</p>
                      </div>
                </div>
                <div class="col-span-2 relative">
                    <img 
                      src={apartment} 
                      alt=""
                      className='h-[300px] w-full object-cover block rounded-lg' />
                      <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.5)] flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 z-10">
                        <p class="text-center title-color text-3xl font-semibold">Apartment</p>
                      </div>
                </div>
                <div class="col-span-3 relative">
                    <img 
                      src={cottage} 
                      alt=""
                      className='w-full h-[300px] object-cover block rounded-lg' />
                      <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.5)] flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 z-10">
                        <p class="text-center title-color text-3xl font-semibold">Cottage</p>
                      </div>
                </div>
            </div>
        </div>
          
      </div>

      {/* Comprehensive Suite */}
      <div className="py-[100px]">
          <div className="container mx-auto flex items-center justify-center gap-8">
            <div className="p-3 relative flex-0">
              <img 
                src={comprehensiveImg} 
                alt=""
                className='w-full block object-cover rounded-lg' />
                <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.3)] opacity-100">
                </div>
            </div>
            <div className="w-[700px] h-full flex flex-col items-start justify-start">
              <h2 className='title-color text-4xl font-bold'>Comprehensive Suite</h2>
              <p className='desc-color mt-[40px]'>Explore our comprehensive suite of social media marketing services designed to connect your brand with your target audience and achieve your business goals. Our mission is to turn your social media presence into a success story.</p>
              <div className="flex item-center gap-3 py-3 mt-[40px]">
                <svg className="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="#FFBE98"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#FFBE98"></path> </g></svg>
                <p className='desc-color'>Developing and executing data-driven strategies</p>
              </div>
              <div className="flex item-center gap-3 py-3">
                <svg className="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="#FFBE98"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#FFBE98"></path> </g></svg>
                <p className='desc-color'>Take your brand to new heights by creating compelling content</p>
              </div>
              <div className="flex item-center gap-3 py-3">
                <svg className="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="#FFBE98"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#FFBE98"></path> </g></svg>
                <p className='desc-color'>Designed to connect your brand with your target audience</p>
              </div>
              <div className="mt-[70px]">
                <a href="/about" className='btn-color rounded-3xl px-7 py-2 title-color font-semibold ' >
                  About Us
                </a>
              </div>
            </div>
          </div>
      </div>
      {/* Our Agents */}
      <div className="py-[100px] primary-section">
        <div className="container mx-auto flex flex-col justify-center items-center">
            <h2 className='title-color text-4xl font-bold'>Meet Our Best Agents</h2>
            <p className='desc-color'>Meet our team of professional agents, who will help you find your dream house</p>
            <div className="flex justify-evenly items-center  pt-[50px]  w-full gap-3">
              <div className="flex flex-col justify-center items-center gap-2">
                <img 
                  src={profile1} 
                  alt=""
                  className='w-[175px] h-[175px] object-cover rounded-full border-2 border-[#bebebe]' />
                <h3 className='font-bold title-color text-xl'>John Doe</h3>
                <span className='desc-color'>Real Trader</span>
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <img 
                  src={profile2} 
                  alt=""
                  className='w-[175px] h-[175px] object-cover rounded-full border-2 border-[#bebebe]' />
                <h3 className='font-bold title-color text-xl'>John Doe</h3>
                <span className='desc-color'>Real Trader</span>
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <img 
                  src={profile3} 
                  alt=""
                  className='w-[175px] h-[175px] object-cover rounded-full border-2 border-[#bebebe]' />
                <h3 className='font-bold title-color text-xl'>John Doe</h3>
                <span className='desc-color'>Real Trader</span>
              </div>
            </div>
        </div>     
      </div>
      {/* Our Agents */}
      <div className="py-[100px]">
          <div className="container mx-auto flex items-center justify-center gap-8">
            <div className="relative flex-0 order-1">
              <img 
                src={videoImg1} 
                alt=""
                className='w-full block object-cover rounded-lg relative' />
                <div class="absolute rounded-lg top-0 left-0 w-full h-full bg-[rgba(255,190,152,0.3)] opacity-100">
                </div>
                <VideoModal/>
                
            </div>
            <div className="w-[700px] h-full flex flex-col items-start justify-start">
              <h2 className='title-color text-4xl font-bold'>Comprehensive Suite</h2>
              <p className='desc-color mt-[40px]'>Explore our comprehensive suite of social media marketing services designed to connect your brand with your target audience and achieve your business goals. Our mission is to turn your social media presence into a success story.</p>
              <div className="flex item-center gap-3 py-3 mt-[40px]">
                <p className='desc-color'>Developing and executing data-driven strategies</p>
              </div>
              <div className="flex item-center gap-3 py-3">
                <p className='desc-color'>Take your brand to new heights by creating compelling content</p>
              </div>
              <div className="flex item-center gap-3 py-3">
                <p className='desc-color'>Designed to connect your brand with your target audience</p>
              </div>
              <div className="mt-[70px]">
                <a href="/about" className='btn-color rounded-3xl px-7 py-2 title-color font-semibold ' >
                  About Us
                </a>
              </div>
            </div>
          </div>
      </div>










      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home