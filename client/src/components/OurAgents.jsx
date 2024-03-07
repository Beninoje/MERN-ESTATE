const OurAgents = ({imgURL,name,job}) => {
  return (  
    <div className="flex flex-col justify-center items-center gap-2">
        <img 
            src={imgURL} 
            alt=""
            className='w-[175px] h-[175px] object-cover rounded-full border-2 border-[#bebebe]' />
        <h3 className='font-bold title-color text-xl'>{name}</h3>
        <span className='desc-color'>{job}</span>
    </div>
  )
}

export default OurAgents