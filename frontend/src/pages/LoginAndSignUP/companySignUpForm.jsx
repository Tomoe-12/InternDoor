import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider"
const CompanySignUp = () => {
    let navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const { createUser } = useContext(AuthContext)

    const onSubmit = (data) => {
        let name = data.name
        let email = data.email
        let industry = data.industry
        let slogan = data.slogan
        let phone = data.phone
        let comSize = data.comSize
        let foundingYear = data.foundingYear
        let address = data.address
        let description = data.description
        let password = data.pass

        createUser(email, password)
            .then((result) => {
                const user = result.user
                alert('register successfully')
                console.log(user);
            }).catch((error) => {
                console.log(error)
            })

        console.log(data);
    }






    return (
        <>
            < form className="grid gap-6 mt-8 md:grid-cols-2 grid-cols-1 " onSubmit={handleSubmit(onSubmit)}>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Name</label>
                    <input {...register('name', { require: true })} type="text" placeholder="John" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Industry</label>
                    <input {...register('industry', { require: true })} type="text" placeholder="industry" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Email</label>
                    <input {...register('email', { require: true })} type="text" placeholder="example.@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>

                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Slogan</label>
                    <input {...register('slogan', { require: true })} type="text" placeholder="Slogan" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Phone number</label>
                    <input {...register('phone', { require: true })} type="tel" placeholder="XXX-XX-XXXX-XXX" maxLength={12} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />

                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Company Size</label>
                    <input {...register('comSize', { require: true })} type="text" placeholder="100-500 employees" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Founding Year</label>
                    <input {...register('foundingYear', { require: true })} type="text" placeholder="YYYY" min={1} max={4} maxLength={4} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Location</label>
                    <input {...register('address', { require: true })} type="text" placeholder="Location" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className='col-span-2'>
                    <label className="block mb-2 text-sm text-gray-600 ">Company Description</label>
                    <textarea {...register('description', { require: true })} rows={5} name="" id="" placeholder='Description' className="max-h-96 block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required></textarea>
                </div>

                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Password</label>
                    <input   {...register('pass', { require: true })} type="password" autoComplete="fale" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                <div className="col-span-2 sm:col-span-1 " >
                    <label className="block mb-2 text-sm text-gray-600 ">Confirm password</label>
                    <input {...register('conpass', {
                        require: true,
                        validate: (value) => value == watch('pass') || 'Passwords do not match'
                    })} type="password" autoComplete="false" placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                </div>
                {errors.conpass && <div className="col-span-2">
                    <p className="text-red-500 text-end   -my-3 ">{errors.conpass.message}</p>
                </div>}


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