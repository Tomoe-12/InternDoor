import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import right from '../../assets/images/right.svg'
import left from '../../assets/images/left.svg'
import image1 from '../../assets/images/JobCategoriesIcons/SoftwareDevelopment.svg'
import image2 from '../../assets/images/JobCategoriesIcons/DataScienceAndAnalytics.svg'
import image3 from '../../assets/images/JobCategoriesIcons/Cybersecurity.svg'
import image4 from '../../assets/images/JobCategoriesIcons/ITSupportAndInfrastructure.svg'
import image5 from '../../assets/images/JobCategoriesIcons/SoftwareTestingAndQualityAssurance.svg'
import image6 from '../../assets/images/JobCategoriesIcons/Database:Management.svg'
import image7 from '../../assets/images/JobCategoriesIcons/ComputerNetworking.svg'
import image8 from '../../assets/images/JobCategoriesIcons/GameDevelopment.svg'
import image9 from '../../assets/images/JobCategoriesIcons/UIUXDesign.svg'
import image10 from '../../assets/images/JobCategoriesIcons/ResearchAndDevelopment.svg'

const categoryItems = [
    { id: 1, title: 'Software Development', description: '', img: image1 },
    { id: 2, title: 'Data Science and Analytics', description: '', img: image2 },
    { id: 3, title: 'Cybersecurity', description: '', img: image3 },
    { id: 4, title: 'IT Support and Infrastructure', description: '', img: image4 },
    { id: 5, title: 'Software Testing and Qualith Assurance', description: '', img: image5 },
    { id: 6, title: 'Database Management', description: '', img: image6 },
    { id: 7, title: 'Computer Networking', description: '', img: image7 },
    { id: 8, title: 'Game Development', description: '', img: image8 },
    { id: 9, title: 'UI/UX Design', description: '', img: image9 },
    { id: 10, title: 'Research and Development', description: '', img: image10 },
]

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
    const slider = React.useRef(null)

    const settings = {
        dots: true,
        infinite: false,
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
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 576,
                settings: {
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
                    <button onClick={() => slider?.current?.slickNext()} className='btn p-2 rounded-full ml-5 bg-gradient-to-br from-cyan to-violet'><img className=" h-8 w-8 p-1" src={right} alt="" /></button>
                </div>



                <Slider ref={slider} {...settings} className="mt-5 min-h-96 max-h-96   justify-around items-center   ">

                    {categoryItems.map((item, i) => (
                        <div key={i} className='pt-10 pb-8 xl:pb-16  px-10 xl:px-4 '>
                            <div className="shadow-3xl card  bg-base-100 xl:space-y-6 space-y-0 min-h-72 max-h-72 ">
                                <figure className="px-5 xl:py-3 py-6 ">
                                    <div className='xl:h-16 xl:w-16 w-20 h-20 p-4  overflow-visible rounded-2xl bg-gradient-to-br from-cyan to-violet '>
                                        <img className=" overflow-auto " src={item.img} alt={item.title} />
                                    </div>

                                </figure>
                                <div className=" items-center text-center xl:space-y-3 space-y-0 px-3 xl:px-2  h-44">
                                    <h4 className=' min-h-16 text-xl lg:text-lg font-semibold md:leading-snug leading-snug  '>{item.title}</h4>
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