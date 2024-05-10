import laptopGirl from '../../assets/images/HomeImg/girl_laptop.png'
const banner = () => {
    return (

        < >
            <div className="overflow-hidden h-bannerHeight max-w-screen-2xl container mx-auto md:py-44 py-14 p-0 ">

                <div className='py-10 flex flex-col md:flex-row-reverse justify-center items-center gap-20 lg:gap-9 overflow-x-clip '>

                    {/* image */}
                    <div className="w-lvw md:w-1/2 flex align-middle justify-center  " >
                        <div className='image md:p-4 md:pt-12 pt-1  ' >

                            <img className='object-cover' src={laptopGirl} alt=""></img>

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
        </>

    )
}

export default banner