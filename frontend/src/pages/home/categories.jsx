import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import right from '../../assets/images/right.svg'
import left from '../../assets/images/left.svg'
import axios from 'axios';



// const SampleNextArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//         <div
//             className={className}
//             style={{ ...style, display: "block", background: "red" }}
//             onClick={onClick}
//         >
//             NEXT
//         </div>
//     );
// };

// const SamplePrevArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//         <div
//             className={className}
//             style={{ ...style, display: "block", background: "green" }}
//             onClick={onClick}
//         >
//             BACK
//         </div>
//     );
// };

const Categories = () => {

    let [jobCategory, setJobCategory] = useState([])

    useEffect(() => {
        let fetchData = async () => {
            fetch('../../../public/jobCategories.json')
            .then(response => response.json())
            .then(data => 
              setJobCategory(data.slice(0,10))
            )
        }
        fetchData()
    }, [])

    const slider = React.useRef(null)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    dots: true,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots: true,
                },
            },

            {
                breakpoint: 970,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: true,
                },
            },
            {
                breakpoint: 576,
                initialSlide: 1,
                settings: {

                    infinite: true,
                    speed: 700,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],

        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />,
    };

    return (
        <div className=' overflow-hidden'>
            <div className=" max-w-screen-2xl   container mx-auto xl:mt-0 mt-5 xl:px-2 mb-10  px-4  relative">
                <div className='md:text-left text-center'>
                    <h1 className='lg:text-4xl  md:text-4xl text-3xl font-bold md:leading-snug leading-snug'>Popular Categories</h1>
                    <p className="text-[#4A4A4A] xl:text-base lg:text-xl md:text-lg text-base">Search your opportunities with or categories</p>
                </div>
                <div className='hidden md:block  absolute right-0 top-3 mb-10 md:mr-24'>
                    <button onClick={() => slider?.current?.slickPrev()} className='btn p-2 rounded-full ml-5'><img className=" h-8 w-8 p-1" src={left} alt="" /></button>
                    <button onClick={() => slider?.current?.slickNext()} className='btn p-2 rounded-full ml-5 bg-gradient-to-br from-cyan to-violet'><img className=" h-8 w-8 p-1 " src={right} alt="" /></button>
                </div>



                <Slider ref={slider} {...settings} className="mt-5 min-h-96 max-h-96   justify-around items-center   ">

                    {!!jobCategory.length && jobCategory.map((item, i) => (
                        <div key={i} className='pt-10 pb-8 xl:pb-16  px-10 xl:px-4 '>
                            <div className="shadow-3xl card  bg-base-100 xl:space-y-6 space-y-0 min-h-72 max-h-72 ">
                                <figure className="px-5 xl:py-3 py-6 ">
                                    <div className='xl:h-16 xl:w-16 w-20 h-20 p-4  overflow-visible rounded-2xl bg-gradient-to-br from-cyan to-violet '>
                                        <img className=" overflow-auto icon-black" src={item.icon} alt={item.category} />
                                    </div>

                                </figure>
                                <div className=" items-center text-center xl:space-y-3 space-y-0 px-3 xl:px-2  h-44">
                                    <h4 className=' min-h-16 text-xl lg:text-lg font-semibold md:leading-snug leading-snug  '>{item.category}</h4>
                                    <p className='text-[#4A4A4A] xl:text-sm lg:text-xl md:text-lg text-sm px-5 md:px-0 '>If a dog chews shoes whose shoes does he choose?</p>

                                </div>
                            </div>
                        </div>
                    ))}

                </Slider>
            </div>
        </div>
    )
}

export default Categories