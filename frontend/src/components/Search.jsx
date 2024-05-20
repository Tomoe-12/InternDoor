import SearchBannerImg from '../assets/images/jobImg&icon/searchBanner.svg'

const Search = ({ setSearch }) => {
    return (
        <>

            <div className="max-w-screen-2xl   container mx-auto xl:px-24 px-4 pb-14 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
                <div className="pt-28 flex flex-row  items-center justify-center">

                    {/* text */}
                    <div className='w-lw xl:w-1/2 md:px-8 md:text-start text-center  '>
                        <h1 className='md:text-5xl text-3xl font-semibold md:leading-snug leading-snug'>Search <span className='textDesign uppercase'>Internships</span></h1>
                        <p className="text-[#4A4A4A] text-sm md:text-lg  mb-6">Search your career opportunity through InternDoor</p>
                        <label className="input rounded-full input-bordered flex items-center gap-2 md:max-w-96 md:min-w-[500px] min-w-80">
                            <input type="text" className="grow " placeholder="Search" onChange={({ currentTarget: input }) => setSearch(input.value.trim())} />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70 "><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </div>

                    {/* image */}
                    <div className=" w-lvw xl:w-1/2 hidden xl:flex align-middle justify-center  " >
                        <div className=' md:p-4    ' >
                            {/* md:pt-12 pt-1*/}
                            <img className='object-cover  ' src={SearchBannerImg} alt=""></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search