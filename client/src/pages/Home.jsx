import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import homeImage from '../images/homeImage.jpg';
import { FaSearch, FaMoneyBillAlt, FaRegBuilding } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const Home = () => {
  const navigate = useNavigate();
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
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
      {/* swiper
      <Swiper navigation>
        {
          homeImages.map((image,index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${image}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}
      

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