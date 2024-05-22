import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'


const Navbar = () => {
    let navigate = useNavigate()

    let clickHandler = () => {
        navigate('/')
        console.log('click')
    }

    const navItems = <>

        {/* <li className="sm:hidden flex">
            {/* <label className="input input-bordered flex items-center max-w-48 max-h-11">
                <input type="text" className="grow w-36" placeholder="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label> 
            <SearchBar />
        </li> */}
        <li>
            <Link to='/home'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home

            </Link>
        </li>
        <li>
            <Link to='/jobs'>
                <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <defs> <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:#000000;}.cls-2{fill:#000000;}" }} /> </defs> <g data-name="35. Find" id="_35._Find"> <path className="cls-1" d="M13,26a12.994,12.994,0,1,1,12.588-9.748,1,1,0,0,1-1.936-.5A10.894,10.894,0,0,0,24,13,11,11,0,1,0,13,24a10.869,10.869,0,0,0,6.275-1.969,10.652,10.652,0,0,0,2.749-2.747,1,1,0,0,1,1.651,1.131,12.681,12.681,0,0,1-3.256,3.257A12.861,12.861,0,0,1,13,26Z" /> <path className="cls-1" d="M28.879,32a3.142,3.142,0,0,1-2.207-.914l-7.529-7.529a1,1,0,0,1,1.414-1.414l7.529,7.529a1.121,1.121,0,0,0,1.586-1.586l-7.529-7.529a1,1,0,0,1,1.414-1.414l7.529,7.529A3.121,3.121,0,0,1,28.879,32Z" /> <path className="cls-2" d="M19,15H7a2,2,0,0,1-2-2V10A1,1,0,0,1,6,9H20a1,1,0,0,1,1,1v3A2,2,0,0,1,19,15ZM7,11v2H19V11Z" /> <path className="cls-2" d="M17,21H9a3,3,0,0,1-3-3V14a1,1,0,0,1,1-1H19a1,1,0,0,1,1,1v4A3,3,0,0,1,17,21ZM8,15v3a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V15Z" /> <path className="cls-2" d="M17,11H9a1,1,0,0,1-1-1V8a3,3,0,0,1,3-3h4a3,3,0,0,1,3,3v2A1,1,0,0,1,17,11ZM10,9h6V8a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1Z" /> </g> </g></svg>
                jobs
                {/* <span className="badge badge-sm badge-warning">NEW</span> */}
                <span className="badge badge-sm badge-warning">NEW</span>
            </Link>
        </li>
        <li>
            <Link to='/contactUs'>
                <svg version="1.1" className="w-5 h-5" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve" fill="#000000" stroke="#000000" strokeWidth="0.44800000000000006"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <style type="text/css" dangerouslySetInnerHTML={{ __html: " .blueprint_een{fill:#000000;} " }} /> <path className="blueprint_een" d="M30,1L5.118,1c-1.451,0-2.784,0.978-3.06,2.402C1.686,5.317,3.15,7,5,7v2c-1.654,0-3,1.346-3,3 s1.346,3,3,3v2c-1.654,0-3,1.346-3,3s1.346,3,3,3v2c-1.85,0-3.314,1.683-2.942,3.598C2.335,30.022,3.667,31,5.118,31H30 c0.552,0,1-0.448,1-1V2C31,1.448,30.552,1,30,1z M9,4c0,0.551-0.449,1-1,1H5C4.449,5,4,4.551,4,4s0.449-1,1-1h3C8.551,3,9,3.449,9,4 z M8,29H5c-0.551,0-1-0.449-1-1s0.449-1,1-1h3c0.551,0,1,0.449,1,1S8.551,29,8,29z M4,20c0-0.551,0.449-1,1-1h3c0.551,0,1,0.449,1,1 s-0.449,1-1,1H5C4.449,21,4,20.551,4,20z M4,12c0-0.551,0.449-1,1-1h3c0.551,0,1,0.449,1,1s-0.449,1-1,1H5C4.449,13,4,12.551,4,12z M9.723,29C9.894,28.705,10,28.366,10,28c0-1.104-0.896-2-2-2H7v-4h1c1.104,0,2-0.896,2-2s-0.896-2-2-2H7v-4h1c1.104,0,2-0.896,2-2 s-0.896-2-2-2H7V6h1c1.104,0,2-0.896,2-2c0-0.366-0.106-0.705-0.277-1H29l0.001,26H9.723z M20.94,13.045 C21.533,12.416,22,11.444,22,10c0-1.657-1.343-3-3-3s-3,1.343-3,3c0,1.444,0.467,2.416,1.06,3.045C15.339,13.264,14,14.721,14,16.5 V18h1v-1.5c0-1.378,1.122-2.5,2.5-2.5h3c1.378,0,2.5,1.122,2.5,2.5V18h1v-1.5C24,14.721,22.661,13.264,20.94,13.045z M19,8 c1.103,0,2,0.897,2,2c0,2.491-1.578,3-2,3c-0.422,0-2-0.509-2-3C17,8.897,17.897,8,19,8z M14,21h10v1H14V21z M14,23h10v1H14V23z" /> </g></svg>
                Contact Us
                {/* <span className="badge badge-xs badge-info"></span> */}
            </Link>
        </li>

    </>


    const [isSticky, setSticky] = useState(false)

    useEffect(() => {

        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 0) {
                setSticky(true)
            } else {
                setSticky(false)
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])


    return (
        <header className='max-w-screen  max-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out ' >
            <div className={`navbar xl:px-23 lg:px-16 ${isSticky ? 'shadow-md bg-base-100 transition-all duration-300 ease-in-out ' : ''}`}>
                {/* logo and phone size navbar  */}
                <div className="navbar-start">
                    <div className="dropdown  ">
                        <div tabIndex={0} role="button" className=" btn btn-ghost md:hidden -ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3">
                            {navItems}
                        </ul>
                    </div>
                    <button onClick={clickHandler} className="font-semibold text-2xl uppercase  ml-3 "><img src={logo} className="lg:w-32 lg:h-16 w-24 h-12" alt="InternDoor" /></button>
                </div>
                {/* serach bar */}
                {/* <div className="navbar-center  ">
                    <div className=" hidden sm:flex lg:flex justify-end">
                        <label className="input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </div>

                </div> */}
                {/* navbar for page search and login */}
                <div className=" navbar-end lg:gap-14   md:gap-14 lg:pr-0 pr-6">
                    <div className="hidden md:flex items-center justify-center   ">
                        <ul className="menu flex flex-nowrap gap-7  menu-horizontal ">
                            {navItems}
                        </ul>
                    </div>
                    <div className=" pl-10 md:border-l-2  border-black cursor-pointer ">
                        <a className="font-semibold text-xl ">Login</a>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Navbar