import '../../assets/css/jobs.css'
import { useCallback, useEffect, useState } from 'react'
import axios from '../../helpers/axios'
import SearchBanner from '../../components/Search.jsx'
import JobContainer from '../../components/jobContainer.jsx'
import Pagination from '../../components/pagination.jsx'
import { useLocation } from 'react-router-dom'
// import FilterAndSort from '../../components/Filter&SortBy.jsx'
import { useMediaQuery } from 'react-responsive'
import SortByCategory from './sortByCategory.jsx'
const Jobs = () => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });


  let location = useLocation()
  let searchQuery = new URLSearchParams(location.search)
  const [obj, setObj] = useState({})
  const [sort, setSort] = useState({ sort: 'rating', order: 'desc' })
  const [filterCategory, setFilterCategory] = useState([])
  const [page, setPage] = useState(searchQuery.get('page') || 1)
  const [search, setSearch] = useState("")



  // let page = searchQuery.get('page') || 1



  let limit = 12;
  if (isMobile) {
    limit = 8;
  } else if (isTablet) {
    limit = 10;
  }



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:4003/api/jobs?`)
  //       setJobs(response.data)

  //     } catch (e) {
  //       console.error('Error fetching data : ', e);
  //     }
  //   }
  //   fetchData()
  // }, [])

  const getAllJobs = useCallback(async () => {
    try {

      const { data } = await axios(`/api/jobs?page=${page}&limit=${limit}&sort=${sort.sort},${sort.order}&category=${filterCategory.toString()}&search=${search}`)
      setObj(data)

    } catch (error) {
      console.error('error fetching data : ', error);
    }
  }, [sort, filterCategory, page, search, limit]);

  useEffect(() => {
    getAllJobs();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [getAllJobs, page]);


  return (

    <>
      {/* jobs banner and search bar */}
      <SearchBanner setSearch={(search) => setSearch(search)} />
      {/* <FilterAndSort sort={sort} setSort={(sort) => setSort(sort)} /> */}
      <section className="bg-white ">

        {/* filter (drawer) button and jobs count */}
        <div className='my-10 px-8 xl:px-0'>
          <div className="flex  justify-between  align-middle  xl:px-48 lg:px-10 ">
            <h3 className="text-xl font-semibold text-center text-gray-500 capitalize lg:text-2xl ">Showing <span className='text-black'>{limit}</span> jobs</h3>
            <label htmlFor="my-drawer-4" className="drawer-button ">
              <div className=' flex text-center items-center px-7 py-1 tracking-wide rounded-full gap-3  shadow-3xl'>
                {/* <img src={Filter} className='w-5 h-5' alt="" /> */}
                <h1 className='text-lg'>Filters</h1>
              </div>
            </label>

          </div>
          {/* drawer */}
          <>
            <div className="drawer drawer-end ">
              <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                {/* Page content here */}
              </div>
              <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="menu  md:w-[440px] w-full  min-h-full bg-base-200 text-base-content flex align-middle">

                  {/* filter by text and sidebar close btn */}
                  <div className="w-full px-5 flex  justify-between align-middle py-2  ">
                    <h3 className="text-lg font-semibold text-center text-gray-800  lg:text-xl uppercase">Filter By </h3>
                    <div className="w-9 h-9  " onClick={() => document.getElementById("my-drawer-4").checked = false} >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_SM"> <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g> </g></svg>
                    </div>
                  </div>
                  <hr className="my-4" />


                  {/* sort by  */}
                  <div className="w-full px-5 ">
                    <h3 className="text-xl font-semibold  capitalize lg:text-xl py-4">Sort By </h3>
                    <div className="grid grid-cols-2 gap-2 ">
                      <div className="form-control   h-fit xl:pr-16 md:pr-16 pr-10 ">
                        <label className="label  cursor-pointer  ">
                          <input type="radio" name="radio-10" className="  radio checked:bg-cyan" defaultChecked />
                          <span className="label-text text-sm ">Most Recent</span>
                        </label>
                      </div>
                      <div className="form-control   h-fit xl:pr-16 md:pr-16 pr-12 ">
                        <label className="label  cursor-pointer  ">
                          <input type="radio" name="radio-10" className=" radio checked:bg-cyan" />
                          <span className="label-text text-sm">Most Apply</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />

                  {/* category */}
                  <div className="w-full px-0 md:px-5 ">
                    <div className='flex justify-between items-center px-5 md:px-0'>
                      <h3 className="text-xl tracking-wider font-semibold  capitalize lg:text-xl py-4">Category</h3>
                      {/*  md:hover:outline outline-1 outline-red-500 */}
                      <p className='text-base text-red-500 font-semibold cursor-pointer  px-3 py-1 rounded-full hover:bg-red-500 hover:text-white' onClick={() => setFilterCategory([])}>Reset</p>
                    </div>
                    <SortByCategory filterCategory={filterCategory} category={obj.category ? obj.category : []} setFilterCategory={(category) => setFilterCategory(category)} />
                  </div>
                  <hr className="my-4" />
                </div>
              </div>
            </div>
          </>
        </div>

        {/* job show */}
        <JobContainer jobs={obj.resultJobs ? obj.resultJobs : []} />
        {/* pagination */}
        <Pagination page={parseInt(page)} limit={obj.limit ? obj.limit : 0} total={obj.total ? obj.total : 0} setPage={(page) => setPage(page)} />
      </section>
    </>
  )
}

export default Jobs