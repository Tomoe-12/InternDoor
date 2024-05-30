import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider"
import axios from "axios"
import Swal from 'sweetalert2'
import Validation from '../../hook/validation'
const CompanySignUp = () => {
    const {  validatePhoneNumber, validateEmail, validatePassword, validateRequired, validateFoundingYear } = Validation
    let navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const { createUser } = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = (data) => {
        let { name, industry, email, slogan, phone, companySize, foundingYear, address, description, pass } = data

        // register new company
        createUser(email, pass)
            .then((result) => {
                const user = result.user
                const companyData = {
                    name,
                    email,
                    photoURL: '',
                    password: pass,
                    role: 'company',
                    phoneNumber: phone,
                    companyInfo: {
                        slogan,
                        location: address,
                        companySize,
                        companyDescription: description,
                        website: '',
                        industry,
                        foundingYear,
                    }
                }
                console.log(companyData);

                axios.post('/api/users/companyRegister', companyData, {
                    withCredentials: true
                }).then((res) => {
                    console.log(user);
                    if (res.status === 200) {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Register Successfully ! ",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate('/')
                    }
                })
            }).catch((error) => {
                console.error(error)
                const errorCode = error.code;
                console.log(errorCode);
                if (errorCode == 'auth/email-already-in-use') setErrorMessage('Email address is already in use')
                else { setErrorMessage(errorMessage) }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Email address is already in use"

                });
                navigate('/signup')
            })

    }



    return (
        <>
            < form className="grid gap-6 mt-8 md:grid-cols-2 grid-cols-1 " onSubmit={handleSubmit(onSubmit)}>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Name</label>
                    <input {...register('name', { validate: validateRequired })} type="text" placeholder="John" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.name && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.name.message}</p>
                    </div>}
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Industry</label>
                    <input {...register('industry', { validate: validateRequired })} type="text" placeholder="industry" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.industry && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.industry.message}</p>
                    </div>}
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Email</label>
                    <input {...register('email', { validate: (value) => validateEmail(value) || validateRequired(value) })} type="text" placeholder="example.@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.eamil && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.email.message}</p>
                    </div>}
                </div>

                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Slogan</label>
                    <input {...register('slogan', { validate: validateRequired })} type="text" placeholder="Slogan" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.slogan && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.slogan.message}</p>
                    </div>}
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Phone number</label>
                    <input {...register('phone', { validate: (value) => validateRequired(value) || validatePhoneNumber(value) })} type="tel" placeholder="XX-XXX-XXXX-XXX" maxLength={11} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.phone && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.phone.message}</p>
                    </div>}
                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Size</label>
                    <input {...register('companySize', { validate: validateRequired })} type="text" placeholder="100-500 employees" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.companySize && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.companySize.message}</p>
                    </div>}
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Founding Year</label>
                    <input {...register('foundingYear', { validate: (value) => validateRequired(value) || validateFoundingYear(value) })} type="text" placeholder="YYYY" min={1} max={4} maxLength={4} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.foundingYear && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.foundingYear.message}</p>
                    </div>}
                </div>
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Location</label>
                    <input {...register('address', { validate: validateRequired })} type="text" placeholder="Location" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                    {errors.address && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.address.message}</p>
                    </div>}
                </div>
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Company Description</label>
                    <textarea  required rows={5} name="" id="" placeholder='Description' className="max-h-96 block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" ></textarea>
                    {errors.description && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end  -my-3 ">{errors.description.message}</p>
                    </div>}
                </div>

                <div className="col-span-2 sm:col-span-1" >
                    <label className="block mb-2 text-sm text-gray-600 ">Password</label>
                    <input {...register('pass', {
                        validate: (value) => validateRequired(value) || validatePassword(value)
                    })} type="password" autoComplete="false" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                    {errors.pass && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end   -my-3 ">{errors.pass.message}</p>
                    </div>}
                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Confirm password</label>
                    <input {...register('conpass', {
                        minLength: {
                            value: 6, message: 'Password must be at least 6 characters long'
                        },
                        validate: (value) => value == watch('pass') || 'Passwords do not match'
                    })} type="password" autoComplete="false" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                    {errors.conpass && <div className="col-span-2 mt-5">
                        <p className="text-red-500 text-end   -my-3 ">{errors.conpass.message}</p>
                    </div>}
                </div>


                <div>
                    <button type="submit" className=" flex items-center justify-between w-32  md:w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
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