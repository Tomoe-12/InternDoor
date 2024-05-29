import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Testimonial = () => {
  const slider = React.useRef(null)

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  }


  return (
    <div className=" max-w-screen-2xl  min-h-full overflow-x-hidden mx-auto xl:mt-0 mt-5 xl:px-2 mb-10  px-4  relative ">

      <div className="xl:w-full xl:py-10  ">
        <p className="text-xl font-medium text-blue-500 ">Testimonials</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl ">
          What students saying
        </h1>

        <Slider ref={slider} {...settings} className=' mb-10 xl:px-28 '>


          {/* 1st review */}
          <>
            <div className="relative w-full mt-8 md:flex md:items-center xl:mt-12  xl:px-10 px-2">
              <div className="absolute w-[95%] bg-blue-600  md:h-96 rounded-2xl -z-10 " />
              <div className="w-full p-6 bg-blue-600 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
                <img className="z-5 h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl" src="https://i.pinimg.com/originals/f8/7b/a0/f87ba05eaa6ca68341d90cb4f031512b.jpg" alt="client photo" />
                <div className="mt-2 md:mx-6">
                  <div>
                    <p className="text-xl font-medium tracking-tight text-white">Ryomen Sukuna</p>
                    <p className="text-blue-200 ">King of Curse (The Strongest in History) </p>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-white md:text-lg"> “Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quibusdam ducimus libero ad tempora doloribus expedita laborum saepe voluptas perferendis delectus assumenda”.</p>
                  <div className="flex items-center justify-between mt-6 md:justify-start">
                    <button onClick={() => slider?.current?.slickPrev()} title="left arrow" className=" p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button onClick={() => slider?.current?.slickNext()} title="right arrow" className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>

          {/* 2nd review */}
          <>
            <div className="relative w-full mt-8 md:flex md:items-center xl:mt-12 xl:px-10 px-2">
              <div className="absolute w-[95%] bg-blue-600  md:h-96 rounded-2xl -z-10 " />
              <div className="w-full p-6 bg-blue-600 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
                <img className="z-5 h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl" src="https://i.pinimg.com/564x/fd/46/39/fd4639206a5c8b48cd71fadc64f60ba1.jpg" alt="client photo" />
                <div className="mt-2 md:mx-6">
                  <div>
                    <p className="text-xl font-medium tracking-tight text-white">Gojo Satoru</p>
                    <p className="text-blue-200 ">Honored One (The Strongest of Today)</p>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-white md:text-lg"> “Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quibusdam ducimus libero ad tempora doloribus expedita laborum saepe voluptas perferendis delectus assumenda”.</p>
                  <div className="flex items-center justify-between mt-6 md:justify-start">
                    <button onClick={() => slider?.current?.slickPrev()} title="left arrow" className=" p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button onClick={() => slider?.current?.slickNext()} title="right arrow" className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
          {/* 3rd review */}
          <>
            <div className="relative w-full mt-8 md:flex md:items-center xl:mt-12  xl:px-10 px-2">
              <div className="absolute w-[95%] bg-blue-600  md:h-96 rounded-2xl -z-10 " />
              <div className="w-full p-6 bg-blue-600 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
                <img className="z-5 h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl" src="https://i.pinimg.com/736x/1d/72/d2/1d72d209ddf80b8dcf28fc2282b22b0a.jpg" alt="client photo" />
                <div className="mt-2 md:mx-6">
                  <div>
                    <p className="text-xl font-medium tracking-tight text-white">Toji Fushiguro</p>
                    <p className="text-blue-200 ">The man who left it all behind</p>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-white md:text-lg"> “Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quibusdam ducimus libero ad tempora doloribus expedita laborum saepe voluptas perferendis delectus assumenda”.</p>
                  <div className="flex items-center justify-between mt-6 md:justify-start">
                    <button onClick={() => slider?.current?.slickPrev()} title="left arrow" className=" p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button onClick={() => slider?.current?.slickNext()} title="right arrow" className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>





        </Slider>

      </div >

    </div >










  )
}

export default Testimonial