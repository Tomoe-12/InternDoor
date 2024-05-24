import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Pagination = ({ page, total, limit, setPage }) => {

    let navigate = useNavigate()
    const location = useLocation()
    const [currentPage, setCurrentPage] = useState(page)


    useEffect(() => {
        const currentUrlPage = parseInt(location.search.split("page=")[1])
        if (currentUrlPage) {
            setCurrentPage(currentUrlPage)
        }
        // setCurrentPage(page)
    }, [location])

    const handlePageChange = (newPage) => {

        setPage(newPage)
        setCurrentPage(newPage)
    }
    const totalPages = Math.ceil(total / limit) || 1
    // console.log(totalPages);



    // next page btn
    let NextPage = (e) => {
        e.preventDefault()
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
            navigate(`?page=${currentPage + 1}`)
        }
    }

    // preview page btn
    let PreviewPage = (e) => {
        e.preventDefault()
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
            navigate(`?page=${currentPage - 1}`)
        }
    }



    return (
        <>
            <div className="max-w-screen overflow-y-hidden flex items-center justify-center p-0 my-20 ` ">
                <div className="inline-flex items-center justify-center gap-3">
                    <div onClick={(e) => PreviewPage(e)} className={`${currentPage === 1 ? 'opacity-30 ' : ''}  arrowBtnContainer  group `}>


                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-1 " viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>

                        <span className=" capitalize">
                            prev
                        </span>

                    </div>

                    {/* medium and larger size button style */}
                    <div className="md:flex mx-7 hidden gap-5">
                        {totalPages > 0 && [...Array(totalPages)].map((val, index) => (
                            <button className={currentPage == index + 1 ? `page_btn active` : `page_btn`} key={index} onClick={(e) => { e.preventDefault(); handlePageChange(index + 1); navigate(`?page=${index + 1}`) }}>
                                <p >
                                    {index + 1}
                                </p>
                            </button>
                        ))}
                    </div>
                    {/* small screen size */}
                    <div className="md:hidden ">
                        <p className="mx-5 outline-none text-base font-semibold  w-9 h-9 flex items-center justify-center  cursor-pointer bg-white ">
                            {currentPage}
                            <span className="mx-0.25">&nbsp;/&nbsp;</span>
                            {totalPages}
                        </p>
                    </div>


                    <div onClick={(e) => NextPage(e)} className={`${currentPage === totalPages ? 'opacity-30' : ''}  arrowBtnContainer  `}>
                        <span className="capitalize">
                            Next
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>



            </div>
        </>
    )
}

export default Pagination