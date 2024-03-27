import React from 'react'

const Partner = ({imgURL}) => {
  return (
    <div className='p-2 flex justify-center items-center'>
        <img 
            src={imgURL} 
            alt=""
            className='w-[150px]' 
        />
    </div>
  )
}

export default Partner