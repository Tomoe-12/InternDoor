import laptopGirl from '../assets/images/HomeImg/girl_laptop.png'
const banner = () => {
    return (
        <div className="overflow-x-visible  md:h-bannerHeight h-lvh max-w-screen-2xl container mx-auto py-14 p-0 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">

            <div className='baner'></div>
            <div className=' py-14 flex flex-col md:flex-row-reverse justify-center items-center md:gap-0 gap-16'>

                {/* image */}
                <div className="md:w-1/2 z-10 flex align-middle justify-center" >
                    <div className='image p-1'>

                        <img className='object-contain md:h-96 md:w-96 w-54 h-72' src={laptopGirl} alt=""></img>
                        
                    </div>


                </div>

                {/* text */}
                <div className=' md:w-1/2 px-4 space-y-7 md:text-start text-center'>
                    <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>Find The Perfect <span className='uppercase textDesign'>InternShip</span> For You</h2>
                    <p className="text-[#4A4A4A] text-xl">When you are searching for a internship , there are a few things you can do to get the most out of your search</p>
                    <button className='font-semibold btn text-base uppercase text-white px-8 py-2 rounded-full bg-primary'>
                        Browse All
                    </button>
                </div>
            </div>
           
        </div>

    )
}

export default banner