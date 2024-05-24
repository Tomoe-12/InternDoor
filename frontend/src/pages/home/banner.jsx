import { useNavigate } from 'react-router-dom'
import laptopGirl from '../../assets/images/HomeImg/banner.svg'
const Banner = () => {
    let navigate = useNavigate();
    return (

        < >
            <section className="bg-gray-50 ">
                <div className="mx-auto max-w-screen-xl px-4 pt-32 py-32 lg:flex  lg:items-center">
                    <div className="mx-auto max-w-xl text-center">
                        <h1 className="text-4xl font-extrabold md:text-5xl md:leading-snug leading-snug">
                            In Search Of Perfect <br />
                           <span  className="font-extrabold text-white bg-blue-500 inline px-4 py-1"> Internship </span>
                        </h1>

                        <p className="mt-4 sm:text-xl/relaxed">
                            When you are searching for a internship , there are a few things you can do to get the most out of your search
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button onClick={(e)=>{e.preventDefault();navigate('/jobs')}}
                                className="block w-full rounded bg-blue-500 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring sm:w-auto"
                                href="#"
                            >
                                Get Started
                            </button>

                           
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Banner