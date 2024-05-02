import aboutUsImg from '../../assets/images/HomeImg/aboutUs.svg'
import arrow from '../../assets/images/HomeImg/arrow.svg'
import arrowWhite from '../../assets/images/HomeImg/arrowWhite.svg'
import phone from '../../assets/images/phone.svg'
const aboutUs = () => {
    return (
        <div className=" h-bannerHeight max-w-screen-2xl container mx-auto md:py-44 py-14 p-0 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
            <div className='py-10 flex flex-col md:flex-row justify-center items-center gap-20 lg:gap-9 overflow-x-clip '>

                {/* image */}
                <div className="w-lvw md:w-1/2 flex align-middle justify-center  " >
                    <div className=' md:p-4 md:pt-12 pt-1  ' >
                        <img className='object-cover ' src={aboutUsImg} alt=""></img>
                    </div>
                </div>

                {/* text */}
                <div className=' md:w-1/2 px-4 space-y-2 md:text-start text-center '>
                    <h4 className='md:text-xl text-lg font-bold md:leading-snug leading-snug  inline '>About Our Website <img className='inline w-10 ml-5' src={arrow} alt="" />  </h4>
                    <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>Choose what you Desire  </h2>

                    <div className='textLeftDesign pl-5 py-2'>
                        <p className="text-[#4A4A4A] text-lg ">INTERNDOOR is to empower aspiring professionals by offering hands-on internships that bridge the gap between academic learning and real-world challenges. We strive to foster a culture of innovation, growth, and inclusivity.</p>
                    </div>
                    <br /><hr /><br />

                    {/* contact us btn and phone number*/}
                    <div className='flex md:flex-row flex-col gap-10 '>

                        <button className='font-semibold btn text-base border-none rounded-none  text-white px-8 py-2 btnHover bg-gradient-to-r from-cyan to-violet transition-all ease-in-out'>
                            Contact Us <img className='inline w-5 ml-1' src={arrowWhite} alt="" />
                        </button>

                        <div className=' flex  gap-3'>
                            <div className='w-12 h-12 p-1 rounded-full border'>
                                <img src={phone} alt="" />
                            </div>
                            <div className=' -space-y-1'>
                                <p className='text-xs text-[#4A4A4A] '>Call for help:</p>
                                <h1 className='md:text-3xl text-4xl font-bold md:leading-snug leading-snug'>09 778 998 789</h1>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default aboutUs