import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'


const Navbar = () => {
    let navigate = useNavigate()

    let clickHandler = ()=> {
        navigate('/home')
        console.log('click')
    }

    const navItems = <>
        <li>Home</li>
        <li>Browse</li>
        <li>Contact</li>
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
        <header className=' max-w-screen  max-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out ' >
            <div className={`navbar xl:px-23 ${isSticky ? 'shadow-md bg-base-100 transition-all duration-300 ease-in-out' : ''}`}>
                <div className="navbar-start">
                    <div className="dropdown  ">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden  -ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navItems}
                        </ul>
                    </div>
                    <button onClick={clickHandler} className="font-semibold text-2xl uppercase  ml-3 "><img src={logo} className="lg:w-32 lg:h-16 w-24 h-12" alt="InternDoor" /></button>
                </div>
                <div className="navbar-center  ">
                    <div className="  hidden md:flex lg:flex justify-end">
                        <label className="input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </div>

                </div>
                <div className="navbar-end  lg:gap-14 md:gap-10 ">
                    <div className="  hidden lg:flex justify-end">
                        <ul className="menu gap-5   menu-horizontal px-1 ">
                            {navItems}
                        </ul>
                    </div>
                    <a className="btn">Login</a>
                </div>
            </div>
        </header>

    )
}

export default Navbar