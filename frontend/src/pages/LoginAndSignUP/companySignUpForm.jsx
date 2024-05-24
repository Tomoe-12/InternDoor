import { useState } from "react"
import {  useNavigate } from "react-router-dom"
const CompanySignUp = () => {
    let navigate = useNavigate()
    let [name, setName] = useState('');
    let [industry, setIndustry] = useState('')
    let [email, SetEmail] = useState('');
    let [slogan, setSlogan] = useState('');
    let [phone, setPhoneNumber] = useState('');
    let [comSize, setComSize] = useState('');
    let [foundingYear, setFoundingYear] = useState('');
    let [description, setDescription] = useState('');
    let [pass, setPass] = useState()
    let [conPass, setConPass] = useState('');

    return (
        <>
            < form className="grid gap-6 mt-8 md:grid-cols-2 grid-cols-1 ">
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="John" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Industry</label>
                    <input value={industry} onChange={e => setIndustry(e.target.value)} type="email" placeholder="industry" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Email</label>
                    <input value={email} onChange={e => SetEmail(e.target.value)} type="text" placeholder="example.@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Slogan</label>
                    <input value={slogan} onChange={e => setSlogan(e.target.value)} type="text" placeholder="Slogan" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Phone number</label>
                    <input value={phone} onChange={e => setPhoneNumber(e.target.value)} type="tel" placeholder="XXX-XX-XXXX-XXX" maxLength={12} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />

                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Size</label>
                    <input value={comSize} onChange={e => setComSize(e.target.value)} type="email" placeholder="100-500 employees" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Founding Year</label>
                    <input value={foundingYear} onChange={e => setFoundingYear(e.target.value)} type="text" placeholder="YYYY" pattern='[0-9}{4}' min={1} max={4} maxLength={4} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Company Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} name="" id="" placeholder='Description' className="max-h-96 block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" ></textarea>
                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Password</label>
                    <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Confirm password</label>
                    <input value={conPass} onChange={e => setConPass(e.target.value)} type="password" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
                <div>
                    <button className=" flex items-center justify-between w-32  md:w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        <span>Sign Up </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>

                    </button>
                    <p className="mt-3 text-gray-500 tracking-wide">Already have Account?  <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={(e) => { e.preventDefault(); navigate('/login') }}>Login</span> </p>
                </div>
            </form>
        </>
    )
}

export default CompanySignUp