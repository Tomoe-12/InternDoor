import Banner from './banner.jsx'
import '../../assets/css/home.css'
import AboutUs from './aboutUs.jsx'
import Service from './service.jsx'
import Categories from './categories.jsx'
const Home = () => {
  return (
    <div  >

      <Banner />
      <Categories />
      <AboutUs />
      <Service />
    </div>
  )
}

export default Home