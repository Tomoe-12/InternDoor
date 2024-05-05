import serviceImg from '../../assets/images/HomeImg/service.svg'
import img1 from '../../assets/images/HomeImg/CustomizedMatching.svg'
import img2 from '../../assets/images/HomeImg/StreamlinedAppProcess.svg'
import img3 from '../../assets/images/HomeImg/diversecompanypartnerships.svg'
import img4 from '../../assets/images/HomeImg/industryinsightsandtrends.svg'

const service = () => {
    return (
        <div className="overflow-hidden max-w-screen-2xl container mx-auto md:py-3 py-14  p-0 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
            
            <div className='md:py-10 flex flex-col xl:flex-row-reverse justify-center items-center gap-20 xl:gap-9 overflow-x-clip '>

                {/* image */}
                <div className=" w-lvw xl:w-1/2 flex align-middle justify-center  " >
                    <div className=' md:p-4 md:pt-12 pt-1  ' >
                        <img src={serviceImg} alt="" />
                    </div>
                </div>

                {/* text */}
                <div className=' w-lvw xl:w-1/2 2xl:px-28 xl:px-8 lg:px-48 md:px-32 px-12 space-y-2  text-center'>

                    <div className='grid xl:grid-rows-2 xl:grid-cols-2 xl:gap-15  gap-20 justify-center text-center '>
                        <div className='serviceBox xl:rounded-tl-3xl rounded-xl '>
                            <div className='eachServiceIcon '>  <img src={img1} alt="" /></div>
                            <h1 className='header' >Customized Matching</h1>
                            <hr className='hrLine' />
                            <p className='serviceText'> Utilizing advanced algorithms to match students with internship opportunities that align with their skills, interests, and career goals.</p>
                        </div>
                        <div className='serviceBox xl:rounded-tr-3xl rounded-xl '>
                            <div className='eachServiceIcon'>  <img src={img2} alt="" /></div>
                            <h1 className='header'> Application Process</h1>
                            <hr className='hrLine' />
                            <p className='serviceText'>Simplifying the application process for students by providing a user-friendly platform where they can easily browse and apply for internships offered by various companies.</p>
                        </div>
                        <div className='serviceBox xl:rounded-bl-3xl rounded-xl '>
                            <div className='eachServiceIcon'>  <img src={img3} alt="" /></div>
                            <h1 className='header'>Diverse Company Partnerships</h1>
                            <hr className='hrLine' />
                            <p className='serviceText'>Building partnerships with a diverse range of companies across industries, offering students a wide array of internship opportunities to choose from.</p>
                        </div>
                        <div className='serviceBox xl:rounded-br-3xl rounded-xl '>
                            <div className='eachServiceIcon'>  <img src={img4} alt="" /></div>
                            <h1 className='header'>Industry Insights and Trends</h1>
                            <hr className='hrLine' />
                            <p className='serviceText'>Providing students with valuable insights into industry trends, company cultures, and internship experiences to help them make informed decisions.</p>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default service