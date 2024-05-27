import Banner from './banner.jsx'
import '../../assets/css/home.css'
import AboutUs from './aboutUs.jsx'
import Service from './service.jsx'
import Categories from './categories.jsx'
import Testimonial from './testimonial.jsx'
const Home = () => {
  // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  return (
    <div  >
      <Banner />
      <Categories />
      <Testimonial/>
      <AboutUs />
      <Service />
    </div>
  )
}

export default Home