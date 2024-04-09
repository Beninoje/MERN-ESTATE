import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faList } from '@fortawesome/free-solid-svg-icons';
import { grid } from '../images';
import {
    FaMapMarkerAlt,
    FaShare,
  } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const LisitingImgView = ({listing, onClose}) => {
  return (
    <div className='h-[100vh] w-[100wh] fixed top-0 left-0 flex flex-col items-center justify-center bg-white'>
        <div className="flex items-center h-[70px] w-full px-[20px] bg-gray-100 border-b-[1px] justify-between">
            <div className="flex items-center">
                <FaMapMarkerAlt className='text-green-700' />
                <p className='font-semibold title-color pl-1 text-lg'>{listing.address}</p>
                <p className='font-semibold px-2 text-gray-400'> | </p>
                <p className='font-semibold text-gray-700 pl-1 text-lg' >
                    ${listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                </p>
                <p className='font-semibold px-2 text-gray-400'> | </p>
            </div>
            <div className="">
                <button onClick={onClose} className="title-color">
                    <FontAwesomeIcon icon={faTimes} className='w-[30px] h-[30px]' />
                </button>
            </div>
        </div>
        <div className="grid grid-cols-4 h-full w-full">
            <div className="col-span-1 grid grid-cols-1 gap-2 p-2 overflow-y-auto h-[800px]">
                {listing.imageUrls.length > 0 && listing.imageUrls.map((imageUrl, index) => (
                    <div key={index} className="col-span-1">
                        <img src={imageUrl} className='w-full h-full rounded-md object-cover ' alt={`Image ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className="col-span-3 grid grid-cols-1 gap-2 p-2 overflow-y-auto h-[800px]">
                {listing.imageUrls.length > 0 && listing.imageUrls.map((imageUrl, index) => (
                    <div key={index} className="col-span-1">
                        <img src={imageUrl} className='w-full h-full rounded-md object-cover ' alt={`Image ${index + 1}`} />
                    </div>
                ))}   
            </div>
        </div>
        <div className="flex items-center justify-end w-full h-[70px] border-t-[1px] px-9">
            <div className="flex items-center gap-[30px]">
                <button className='w-[25px] h-[25px]'>
                    <FontAwesomeIcon icon={faList} className='w-[25px] h-[25px] title-color' />
                </button>
                <button className='w-[25px] h-[25px]'>
                    <img src={grid} alt="" className='w-[25px] h-[25px]'/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default LisitingImgView