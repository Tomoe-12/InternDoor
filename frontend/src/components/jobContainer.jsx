
import '../assets/css/jobs.css'
import location from '../assets/images/jobImg&icon/location.svg'
const jobContainer = ({ jobs }) => {
    // console.log(jobs);

    // const { title, requireStudent, category, description, skills, deadline, receiveApplicantEmail } = jobs
    return (
        // <>
        // <div className="job-card">
        //     <div className="xl:px-8 px-5 h-full pb-2  rounded-2xl overflow-hidden shadow-3xl">
        //         {/* category */}
        //         <div className="w-full h-24  flex  items-center">
        //             <div className="flex gap-3  w-fit p-3 py-1 rounded-xl bg-blue-100">
        //                 <svg className="w-5" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M5,13.9V22a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14.618L15.553,16.9A1,1,0,0,0,17,16V2a1,1,0,0,0-1.447-.895L9.764,4H6a5,5,0,0,0-1,9.9ZM9,21H7V14H9ZM6,6h4a1,1,0,0,0,.447-.105L15,3.618V14.382l-4.552-2.277c-.009,0-.02,0-.029-.006a.983.983,0,0,0-.412-.1H6A3,3,0,0,1,6,6ZM23,9a4,4,0,0,1-4,4,1,1,0,0,1,0-2,2,2,0,0,0,0-4,1,1,0,0,1,0-2A4,4,0,0,1,23,9Z" /></g></svg>
        //                 <h3 className=" text-gray-700">{category}</h3>
        //             </div>
        //         </div>
        //         {/* job title */}
        //         <div className="w-full h-24  flex  items-center ">
        //             <h3 className="font-semibold  capitalize text-2xl textDesign w-fit ">{title}</h3>
        //         </div>
        //         {/* location */}
        //         <div className="w-full h-24  flex  items-center ">
        //             <img src={location} className='w-7 h-7 ' alt="" />
        //             <div className='h-full w-full  flex items-center pl-2 py-1'>
        //                 <h1 className='font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit</h1>
        //             </div>
        //         </div>
        //         {/* company name ,logo and upload time*/}
        //         <div className="w-full h-24  flex justify-between">
        //             {/* date and com name */}
        //             <div className=' w-full flex flex-col  justify-center gap-1 '>
        //                 <p className='text-gray-500 text-sm xl:text-base'>1 day ago</p>
        //                 <h1 className='font-semibold'>First Greenhill Logistics Ltd</h1>
        //             </div>
        //             {/* logo */}
        //             <div className=' w-40 p-2'>
        //                 <img src={location} className='w-full h-full ' alt="" />
        //             </div>
        //         </div>
        //     </div>
        // </div>
        // </>
        <>
            <div className='my-12 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-fit mx-auto lg:gap-10 md:gap-7 gap-8 justify-center '>

                {jobs.map((job) => (
                   
                    <div className='' key={job._id}>

                        {/* <img src={location} alt="" className='w-10 h-10 ' />
                        <p>{job.title}</p>
                        <div>
                            {job.category}
                        </div> */}

                        <div className="job-card">
                            <div className="xl:px-8 px-5 h-full pb-2  rounded-2xl overflow-hidden shadow-3xl">
                                {/* category */}
                                <div className="w-full h-24  flex  items-center">
                                    <div className="flex gap-3  w-fit p-3 py-1 rounded-xl bg-blue-100">
                                        <svg className="w-5" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M5,13.9V22a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14.618L15.553,16.9A1,1,0,0,0,17,16V2a1,1,0,0,0-1.447-.895L9.764,4H6a5,5,0,0,0-1,9.9ZM9,21H7V14H9ZM6,6h4a1,1,0,0,0,.447-.105L15,3.618V14.382l-4.552-2.277c-.009,0-.02,0-.029-.006a.983.983,0,0,0-.412-.1H6A3,3,0,0,1,6,6ZM23,9a4,4,0,0,1-4,4,1,1,0,0,1,0-2,2,2,0,0,0,0-4,1,1,0,0,1,0-2A4,4,0,0,1,23,9Z" /></g></svg>
                                        <h3 className=" text-gray-700">{job.category}</h3>
                                    </div>
                                </div>
                                {/* job title */}
                                <div className="w-full h-24  flex  items-center ">
                                    <h3 className="font-semibold  capitalize text-2xl textDesign w-fit ">{job.title}</h3>
                                </div>
                                {/* location */}
                                <div className="w-full h-24  flex  items-center ">
                                    <img src={location} className='w-7 h-7 ' alt="" />
                                    <div className='h-full w-full  flex items-center pl-2 py-1'>
                                        <h1 className='font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit</h1>
                                    </div>
                                </div>
                                {/* company name ,logo and upload time*/}
                                <div className="w-full h-24  flex justify-between">
                                    {/* date and com name */}
                                    <div className=' w-full flex flex-col  justify-center gap-1 '>
                                        <p className='text-gray-500 text-sm xl:text-base'>1 day ago</p>
                                        <h1 className='font-semibold'>First Greenhill Logistics Ltd</h1>
                                    </div>
                                    {/* logo */}
                                    <div className=' w-40 p-2'>
                                        <img src={location} className='w-full h-full ' alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>













                    </div>


                ))}
            </div>
        </>
    )
}

export default jobContainer