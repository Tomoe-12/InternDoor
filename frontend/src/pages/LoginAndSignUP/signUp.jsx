import student from '../../assets/images/studetn.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CompanySignUp from './companySignUpForm.jsx'
import StudentSignUpForm from './studentSignUpForm.jsx'
const SignUp = () => {
    let [accType, setAccType] = useState('student')

    console.log(accType);

    let accTypeBtn = (e, type) => {
        e.preventDefault();
        setAccType(type)
    }

    let navigate = useNavigate()



    return (
        <>
            <section className="bg-white">
                <div className="flex justify-center min-h-screen">
                    <div className="hidden bg-cover lg:block lg:w-2/5" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80")' }}>
                    </div>
                    {/* <div className="hidden bg-cover lg:block lg:w-2/5  " >
                        <img src={img} className="w-full h-[850px]  mt-24" alt="" />
                    </div> */}
                    <div className=" flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5 ">
                        {/* close button  */}
                        <button className="hidden md:flex btn btn-circle btn-outline absolute xl:top-10 xl:right-24 md:top-5 md:right-5 " onClick={(e) => { e.preventDefault(); navigate('/') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className={`${accType === 'company' ? 'md:mt-16 md:mb-8' : ''} w-full  `}>
                            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize ">
                                Get free account now.
                            </h1>
                            <p className="mt-4 text-gray-500 ">
                                Let’s get you all set up so you can verify your personal account and begin setting up your profile.
                            </p>
                            {/* account type select button */}
                            <div className="mt-6">
                                <h1 className="text-gray-500 ">Select type of account</h1>
                                <div className="mt-3 md:flex md:items-center md:-mx-2">
                                    <button onClick={(e) => accTypeBtn(e, 'student')} className={`${accType === 'student' ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'} flex items-center justify-center w-full px-6 py-3 mt-4 rounded-lg md:mt-0 md:w-auto md:mx-2  focus:outline-none`}>
                                        <svg className={`h-7 w-7 ${accType === 'student' ? 'icon-white' : 'icon-blue'}`} height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <style type="text/css" dangerouslySetInnerHTML={{ __html: " .st0{fill:#000000;} " }} /> <g> <path className="st0" d="M505.837,180.418L279.265,76.124c-7.349-3.385-15.177-5.093-23.265-5.093c-8.088,0-15.914,1.708-23.265,5.093 L6.163,180.418C2.418,182.149,0,185.922,0,190.045s2.418,7.896,6.163,9.627l226.572,104.294c7.349,3.385,15.177,5.101,23.265,5.101 c8.088,0,15.916-1.716,23.267-5.101l178.812-82.306v82.881c-7.096,0.8-12.63,6.84-12.63,14.138c0,6.359,4.208,11.864,10.206,13.618 l-12.092,79.791h55.676l-12.09-79.791c5.996-1.754,10.204-7.259,10.204-13.618c0-7.298-5.534-13.338-12.63-14.138v-95.148 l21.116-9.721c3.744-1.731,6.163-5.504,6.163-9.627S509.582,182.149,505.837,180.418z" /> <path className="st0" d="M256,346.831c-11.246,0-22.143-2.391-32.386-7.104L112.793,288.71v101.638 c0,22.314,67.426,50.621,143.207,50.621c75.782,0,143.209-28.308,143.209-50.621V288.71l-110.827,51.017 C278.145,344.44,267.25,346.831,256,346.831z" /> </g> </g></svg>

                                        <span className="mx-2">
                                            Student
                                        </span>
                                    </button>
                                    <button onClick={(e) => accTypeBtn(e, 'company')} className={`${accType === 'company' ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'} flex items-center justify-center w-full px-6 py-3 mt-4 rounded-lg md:mt-0 md:w-auto md:mx-2  focus:outline-none`}>
                                        <svg className={`w-7 h-7 ${accType === 'company' ? 'icon-white' : 'icon-blue'} `} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M192 128v704h384V128H192zm-32-64h448a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32z" /><path fill="#000000" d="M256 256h256v64H256v-64zm0 192h256v64H256v-64zm0 192h256v64H256v-64zm384-128h128v64H640v-64zm0 128h128v64H640v-64zM64 832h896v64H64v-64z" /><path fill="#000000" d="M640 384v448h192V384H640zm-32-64h256a32 32 0 0 1 32 32v512a32 32 0 0 1-32 32H608a32 32 0 0 1-32-32V352a32 32 0 0 1 32-32z" /></g></svg>

                                        <span className="mx-2">
                                            Company
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* student account type */}
                            {accType !== null && accType === 'student' && (
                                <StudentSignUpForm />
                            )}

                            {/* company account type */}
                            {accType !== null && accType === 'company' && (
                                <CompanySignUp />
                            )}
                        </div>
                    </div>
                </div>
            </section >
        </>


    )
}

export default SignUp