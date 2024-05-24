import { useNavigate } from 'react-router-dom'
import aboutUsImg from '../../assets/images/HomeImg/aboutUs.svg'
import arrow from '../../assets/images/HomeImg/arrow.svg'
import arrowWhite from '../../assets/images/HomeImg/arrowWhite.svg'
import phone from '../../assets/images/phone.svg'
const AboutUs = () => {
    let navigate = useNavigate()
    return (
        <div className="overflow-hidden max-w-screen-2xl container  mx-auto xl:py-44 md:py-3  py-14 p-0 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">

            <div className='md:py-10  flex flex-col-reverse xl:flex-row-reverse justify-center items-center   gap-20 lg:gap-9 overflow-x-clip '>


                {/* text */}
                <div className='w-lw xl:w-1/2  md:px-28 px-8 space-y-2 md:text-start text-center '>
                    <h4 className='lg:text-2xl md:text-xl text-lg font-bold md:leading-snug leading-snug  inline '>About Our Website <img className='inline md:w-10 w-7 md:ml-5 ml-3' src={arrow} alt="" />  </h4>
                    <h2 className='lg:text-5xl  md:text-4xl text-3xl font-bold md:leading-snug leading-snug'>Choose what you Desire  </h2>

                    <div className='textLeftDesign pl-5 py-2'>
                        <p className="text-[#4A4A4A] xl:text-base lg:text-xl md:text-lg text-base md:p-0 px-2 ">INTERNDOOR is to empower aspiring professionals by offering hands-on internships that bridge the gap between academic learning and real-world challenges. We strive to foster a culture of innovation, growth, and inclusivity.</p>
                    </div>
                    <br /><hr /><br />

                    {/* contact us btn and phone number*/}
                    <div className='flex lg:flex-row flex-col gap-10 '>

                        <button onClick={(e) => { e.preventDefault(); navigate('/contactUs') }} className='font-extrabold lg:font-semibold btn text-xl lg:text-base border-none  rounded-full text-white px-8 lg:py-2 btnHover bg-blue-500 hover:bg-blue-400 transition-color ease-in-out duration-300 transform'>
                            Contact Us <img className='inline w-5 ml-1 ' src={arrowWhite} alt="" />
                        </button>

                        <div className=' flex gap-7 lg:gap-3  justify-center'>
                            <div className='w-14 h-14 lg:w-12 lg:h-12 lg:p-1 p-0 rounded-full border'>
                                <img src={phone} className='icon-blue' alt="" />
                            </div>
                            <div className=' -space-y-1'>
                                <p className='text-lg md:text-xl lg:text-xs text-[#4A4A4A] '>Call for help:</p>
                                <h1 className='text-xl md:text-3xl font-bold md:leading-snug leading-snug'>09 778 998 789</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* image */}
                <div className=" w-lvw xl:w-1/2 flex align-middle justify-center  " >
                    <div className=' md:p-4 md:pt-12 pt-1  ' >
                        <img className='object-cover ' src={aboutUsImg} alt=""></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs