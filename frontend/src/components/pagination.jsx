import { useEffect, useState } from "react"


const Pagination = ({ page, total, limit, setPage }) => {
    const [currentPage, setCurrentPage] = useState(page)

    useEffect(() => {
        setCurrentPage(page)
    }, [page])

    const handlePageChange = (newPage) => {

        setPage(newPage)
        setCurrentPage(newPage)
    }
    const totalPages = Math.ceil(total / limit)
    // console.log(totalPages);



    // next page btn
    let NextPage = (e) => {
        e.preventDefault()
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    // preview page btn
    let PreviewPage = (e) => {
        e.preventDefault()
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    }


    return (
        <>
            <div className="max-w-screen overflow-y-hidden flex items-center justify-center p-0 my-20 ` ">



                <div className="inline-flex items-center justify-center gap-3">
                    <div onClick={(e) => PreviewPage(e)} className={`${currentPage === 1 ? 'opacity-30 ' : ''}  arrowBtnContainer  group `}>
                        <div className={`${currentPage === 1 ? 'group-hover:bg-white text-black' : 'md:group-hover:bg-transparent'} arrowBtn`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentcolor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            <span className=" capitalize">
                                pre
                            </span>
                        </div>
                    </div>

                    {/* medium and larger size button style */}
                    <div className="md:flex mx-7 hidden gap-5">
                        {totalPages > 0 && [...Array(totalPages)].map((val, index) => (
                            <button className={currentPage === index + 1 ? `page_btn active` : `page_btn`} key={index} onClick={(e) => { e.preventDefault(); handlePageChange(index + 1) }}>
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


                    <div onClick={(e) => NextPage(e)} className={`${currentPage === totalPages ? 'opacity-30' : ''}  arrowBtnContainer  group`}>
                        <div className={`${currentPage === totalPages ? 'group-hover:bg-white text-black' : 'md:group-hover:bg-transparent'} arrowBtn`}>
                            <span className="capitalize">
                                Next
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentcolor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>



            </div>
        </>
    )
}

export default Pagination