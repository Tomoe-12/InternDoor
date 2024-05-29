import { useLocation, useNavigate } from "react-router-dom"
import Logo from '../../assets/logo.png'
import { useForm } from 'react-hook-form'
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import axios from "axios";
import Swal from 'sweetalert2'
import Validation from '../../hook/validation'
const Login = () => {
    const { validateEmail, validatePassword, validateRequired } = Validation

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()


    const { signUpWithGmail, login } = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState('')

    // redirecting to home page or specifice page
    const location = useLocation()
    let navigate = useNavigate()
    const from = location.state?.from?.pathname || '/'

    const onSubmit = async (data, e) => {
        e.preventDefault()
        let { email, password } = data

        login(email, password)
            .then((result) => {
                const userInfor = {
                    email,
                    password,
                }
                axios.post('/api/users/login', userInfor, { withCredentials: true ,})
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Login Successfully !",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate(from, { replace: true })
                        }
                    })
            }).catch((e) => {
                console.log(e.code);
                if (e.code == "auth/invalid-credential") { setErrorMessage('Provide a correct email and password') }
                else setErrorMessage('')
                console.log(errorMessage);

            })
    }

    // google sign in
    const handleGoogleSignUp = async () => {
        signUpWithGmail()
            .then((result) => {
                const user = result.user
                console.log(user);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/')
            }).catch((error) => {
                console.log(error);
                alert('something went wrong try again')
                navigate('/login')
            })
    };



    return (
        <>
            <section className="bg-white w-full h-lvh overflow-y-hidden flex items-center " >
                {/* close button  */}
                <button className="hidden md:flex btn btn-circle btn-outline absolute top-10 right-24 " onClick={(e) => { e.preventDefault(); navigate('/') }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="container px-6 py-24 mx-auto lg:py-32  ">
                    <div className="lg:flex">
                        <div className="lg:w-1/2">
                            <img src={Logo} className="w=auto h-10 sm:h-14" alt="" />
                            <h1 className="mt-4 text-gray-600  md:text-lg">Welcome back</h1>
                            <h1 className="mt-4 text-2xl font-medium text-gray-800 capitalize lg:text-3xl ">
                                login to your account
                            </h1>
                        </div>
                        <div className="mt-8 lg:w-1/2 lg:mt-0">
                            <form className="w-full lg:max-w-xl" onSubmit={handleSubmit(onSubmit)}>
                                {/* email */}
                                <div className="relative flex items-center">
                                    <span className="absolute">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input {...register('email', { validate: (value) => validateRequired(value) || validateEmail(value) })} autoComplete="true" type="email" className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11    focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email address" />
                                </div>
                                {errors.email && <div className="col-span-2 mt-5">
                                    <p className="text-red-500 text-end  -my-3 ">{errors.email.message}</p>
                                </div>}
                                {/* password */}
                                <div className="relative flex items-center mt-4">
                                    <span className="absolute">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input {...register('password', { validate: (value) => validateRequired(value) || validatePassword(value) })} autoComplete="true" type="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg    focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password" />

                                </div>
                                {errors.password && <div className="col-span-2 mt-5">
                                    <p className="text-red-500 text-end   -my-3 ">{errors.password.message}</p>
                                </div>}
                                {!errors.password && errorMessage && <div className="col-span-2 mt-5">
                                    <p className="text-red-500 text-end   -my-3 ">{errorMessage}</p>
                                </div>}
                                <div className="mt-8 md:flex md:items-center ">
                                    <button type="submit" className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        Sign in
                                    </button>
                                    <a href="#" className=" block mt-4 md:text-center text-end text-blue-500 md:mt-0 md:mx-6 hover:underline ">
                                        Forgot your password?
                                    </a>
                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="flex w-full items-center space-x-4 mt-10 mb-5">
                        <div className="flex-1 border-b border-gray-200 " />
                        <span className="flex items-center justify-center text-gray-400 text-lg font-normal leading-7 px-5">OR Login With</span>
                        <div className="flex-1 border-b border-gray-200" />
                    </div>
                    <div className="mt-8 sm:flex sm:items-center   justify-center">
                        <h3 className="hidden md:block text-blue-500 dark:text-blue-400 sm:w-1/2">Social networks</h3>

                        {/* <div className=" md:w-full text-center w-fit mx-auto md:flex md:justify-between">
                            <h3 className="text-blue-500  sm:w-1/2">Social networks</h3>
                            <div className="flex items-center mt-4 sm:mt-0 -mx-1.5 sm:w-1/2">
                                <a className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#">
                                    <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334C15.9195 6.49001 14.8115 6.44334 13.7468 6.84201C12.6822 7.24068 11.9848 8.21534 12.0002 9.33334V10C9.83683 10.0553 7.91016 9.07001 6.66683 7.33334C6.66683 7.33334 3.87883 12.2887 9.3335 14.6667C8.0855 15.498 6.84083 16.0587 5.3335 16C7.53883 17.202 9.94216 17.6153 12.0228 17.0113C14.4095 16.318 16.3708 14.5293 17.1235 11.85C17.348 11.0351 17.4595 10.1932 17.4548 9.34801C17.4535 9.18201 18.4615 7.50001 18.6668 6.67268V6.67334Z" />
                                    </svg>
                                </a>
                                <a className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.2 8.80005C16.4731 8.80005 17.694 9.30576 18.5941 10.2059C19.4943 11.1061 20 12.327 20 13.6V19.2H16.8V13.6C16.8 13.1757 16.6315 12.7687 16.3314 12.4687C16.0313 12.1686 15.6244 12 15.2 12C14.7757 12 14.3687 12.1686 14.0687 12.4687C13.7686 12.7687 13.6 13.1757 13.6 13.6V19.2H10.4V13.6C10.4 12.327 10.9057 11.1061 11.8059 10.2059C12.7061 9.30576 13.927 8.80005 15.2 8.80005Z" fill="currentColor" />
                                        <path d="M7.2 9.6001H4V19.2001H7.2V9.6001Z" fill="currentColor" />
                                        <path d="M5.6 7.2C6.48366 7.2 7.2 6.48366 7.2 5.6C7.2 4.71634 6.48366 4 5.6 4C4.71634 4 4 4.71634 4 5.6C4 6.48366 4.71634 7.2 5.6 7.2Z" fill="currentColor" />
                                    </svg>
                                </a>
                                <a className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 10.2222V13.7778H9.66667V20H13.2222V13.7778H15.8889L16.7778 10.2222H13.2222V8.44444C13.2222 8.2087 13.3159 7.9826 13.4826 7.81591C13.6493 7.64921 13.8754 7.55556 14.1111 7.55556H16.7778V4H14.1111C12.9324 4 11.8019 4.46825 10.9684 5.30175C10.1349 6.13524 9.66667 7.2657 9.66667 8.44444V10.2222H7Z" fill="currentColor" />
                                    </svg>
                                </a>
                                <a className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.9294 7.72275C9.65868 7.72275 7.82715 9.55428 7.82715 11.825C7.82715 14.0956 9.65868 15.9271 11.9294 15.9271C14.2 15.9271 16.0316 14.0956 16.0316 11.825C16.0316 9.55428 14.2 7.72275 11.9294 7.72275ZM11.9294 14.4919C10.462 14.4919 9.26239 13.2959 9.26239 11.825C9.26239 10.354 10.4584 9.15799 11.9294 9.15799C13.4003 9.15799 14.5963 10.354 14.5963 11.825C14.5963 13.2959 13.3967 14.4919 11.9294 14.4919ZM17.1562 7.55495C17.1562 8.08692 16.7277 8.51178 16.1994 8.51178C15.6674 8.51178 15.2425 8.08335 15.2425 7.55495C15.2425 7.02656 15.671 6.59813 16.1994 6.59813C16.7277 6.59813 17.1562 7.02656 17.1562 7.55495ZM19.8731 8.52606C19.8124 7.24434 19.5197 6.10901 18.5807 5.17361C17.6453 4.23821 16.51 3.94545 15.2282 3.88118C13.9073 3.80621 9.94787 3.80621 8.62689 3.88118C7.34874 3.94188 6.21341 4.23464 5.27444 5.17004C4.33547 6.10544 4.04628 7.24077 3.98201 8.52249C3.90704 9.84347 3.90704 13.8029 3.98201 15.1238C4.04271 16.4056 4.33547 17.5409 5.27444 18.4763C6.21341 19.4117 7.34517 19.7045 8.62689 19.7687C9.94787 19.8437 13.9073 19.8437 15.2282 19.7687C16.51 19.708 17.6453 19.4153 18.5807 18.4763C19.5161 17.5409 19.8089 16.4056 19.8731 15.1238C19.9481 13.8029 19.9481 9.84704 19.8731 8.52606ZM18.1665 16.5412C17.8881 17.241 17.349 17.7801 16.6456 18.0621C15.5924 18.4799 13.0932 18.3835 11.9294 18.3835C10.7655 18.3835 8.26272 18.4763 7.21307 18.0621C6.51331 17.7837 5.9742 17.2446 5.69215 16.5412C5.27444 15.488 5.37083 12.9888 5.37083 11.825C5.37083 10.6611 5.27801 8.15832 5.69215 7.10867C5.97063 6.40891 6.50974 5.8698 7.21307 5.58775C8.26629 5.17004 10.7655 5.26643 11.9294 5.26643C13.0932 5.26643 15.596 5.17361 16.6456 5.58775C17.3454 5.86623 17.8845 6.40534 18.1665 7.10867C18.5843 8.16189 18.4879 10.6611 18.4879 11.825C18.4879 12.9888 18.5843 15.4916 18.1665 16.5412Z" fill="currentColor" />
                                    </svg>
                                </a>
                            </div>
                        </div> */}
                        <div className="flex items-center justify-center gap-x-7">
                            <a onClick={handleGoogleSignUp} className=" relative w-11 h-11 rounded-full transition-all duration-500 flex justify-center items-center bg-gray-700  hover:bg-blue-500">
                                <svg className="w-[1rem] h-[1rem] text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 210 210" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40 c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105 S0,162.897,0,105z" /> </g></svg>
                            </a>
                            <a className="relative w-11 h-11 rounded-full transition-all duration-500 flex justify-center items-center bg-gray-700  hover:bg-blue-500">
                                <svg className="w-[1rem] h-[1rem] text-white" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.04111 7.81204L7.41156 5.46043H5.1296V3.93188C5.1296 3.28886 5.44818 2.66054 6.46692 2.66054H7.51899V0.657999C6.90631 0.560385 6.28723 0.507577 5.66675 0.5C3.78857 0.5 2.56239 1.62804 2.56239 3.66733V5.46043H0.480469V7.81204H2.56239V13.5H5.1296V7.81204H7.04111Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a className="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center hover:bg-blue-500">
                                <svg className="w-[1.125rem] h-[0.875rem] text-white" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5106 1.87152C13.0907 2.05225 12.6492 2.1781 12.1971 2.24596C12.4084 2.20973 12.7195 1.82924 12.8433 1.67524C13.0314 1.44293 13.1747 1.17774 13.266 0.893133C13.266 0.871995 13.2872 0.841798 13.266 0.826699C13.2554 0.820885 13.2435 0.817838 13.2313 0.817838C13.2192 0.817838 13.2072 0.820885 13.1966 0.826699C12.7056 1.09256 12.1831 1.29547 11.6414 1.43064C11.6226 1.43641 11.6025 1.43693 11.5833 1.43214C11.5642 1.42735 11.5467 1.41744 11.5327 1.40346C11.4906 1.35325 11.4452 1.30585 11.3968 1.26154C11.1759 1.06358 10.9252 0.90156 10.654 0.781404C10.2879 0.631197 9.8924 0.566145 9.49745 0.591162C9.11422 0.615364 8.74008 0.718152 8.39827 0.893133C8.06169 1.07761 7.76587 1.32824 7.5286 1.62994C7.27902 1.94047 7.09883 2.30085 7.00015 2.68684C6.91878 3.05399 6.90955 3.43346 6.97297 3.80413C6.97297 3.86754 6.97297 3.8766 6.91862 3.86754C4.76557 3.55048 2.99904 2.78649 1.55562 1.14679C1.4922 1.07432 1.45899 1.07432 1.40765 1.14679C0.779553 2.10102 1.08454 3.61087 1.86967 4.35674C1.97536 4.45639 2.08407 4.55302 2.19882 4.64361C1.83884 4.61805 1.48766 4.5205 1.16608 4.35674C1.10568 4.31748 1.07246 4.33862 1.06945 4.41109C1.06088 4.51157 1.06088 4.61259 1.06945 4.71306C1.13245 5.19458 1.32222 5.65073 1.61933 6.03486C1.91645 6.41899 2.31026 6.71731 2.76048 6.89933C2.87023 6.94634 2.9846 6.98176 3.10171 7.00502C2.76846 7.07063 2.42667 7.08083 2.09011 7.03522C2.01763 7.02012 1.99046 7.05938 2.01763 7.12883C2.46153 8.33671 3.42482 8.70512 4.13143 8.91046C4.22806 8.92555 4.32469 8.92556 4.4334 8.94971C4.4334 8.94971 4.4334 8.94971 4.41528 8.96783C4.20692 9.34831 3.36442 9.60499 2.9779 9.73786C2.2724 9.99127 1.5202 10.0881 0.773514 10.0217C0.655745 10.0036 0.628568 10.0066 0.598371 10.0217C0.568174 10.0368 0.598371 10.07 0.631588 10.1002C0.782573 10.1999 0.933558 10.2874 1.09058 10.372C1.55805 10.627 2.05225 10.8295 2.5642 10.9759C5.2155 11.7067 8.19897 11.1692 10.189 9.19129C11.7532 7.63916 12.3028 5.49819 12.3028 3.35419C12.3028 3.27266 12.4024 3.22435 12.4598 3.18207C12.8555 2.87373 13.2044 2.50958 13.4955 2.10102C13.546 2.04011 13.5718 1.96257 13.568 1.8836C13.568 1.8383 13.568 1.84736 13.5106 1.87152Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a className="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center hover:bg-blue-500">
                                <svg className="w-[1.25rem] h-[1.125rem] text-white" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.70975 7.93663C4.70975 6.65824 5.76102 5.62163 7.0582 5.62163C8.35537 5.62163 9.40721 6.65824 9.40721 7.93663C9.40721 9.21502 8.35537 10.2516 7.0582 10.2516C5.76102 10.2516 4.70975 9.21502 4.70975 7.93663ZM3.43991 7.93663C3.43991 9.90608 5.05982 11.5025 7.0582 11.5025C9.05658 11.5025 10.6765 9.90608 10.6765 7.93663C10.6765 5.96719 9.05658 4.37074 7.0582 4.37074C5.05982 4.37074 3.43991 5.96719 3.43991 7.93663ZM9.97414 4.22935C9.97408 4.39417 10.0236 4.55531 10.1165 4.69239C10.2093 4.82946 10.3413 4.93633 10.4958 4.99946C10.6503 5.06259 10.8203 5.07916 10.9844 5.04707C11.1484 5.01498 11.2991 4.93568 11.4174 4.81918C11.5357 4.70268 11.6163 4.55423 11.649 4.39259C11.6817 4.23095 11.665 4.06339 11.6011 3.91109C11.5371 3.7588 11.4288 3.6286 11.2898 3.53698C11.1508 3.44536 10.9873 3.39642 10.8201 3.39635H10.8197C10.5955 3.39646 10.3806 3.48424 10.222 3.64043C10.0635 3.79661 9.97434 4.00843 9.97414 4.22935ZM4.21142 13.5892C3.52442 13.5584 3.15101 13.4456 2.90286 13.3504C2.57387 13.2241 2.33914 13.0738 2.09235 12.8309C1.84555 12.588 1.69278 12.3569 1.56527 12.0327C1.46854 11.7882 1.3541 11.4201 1.32287 10.7431C1.28871 10.0111 1.28189 9.79119 1.28189 7.93669C1.28189 6.08219 1.28927 5.86291 1.32287 5.1303C1.35416 4.45324 1.46944 4.08585 1.56527 3.84069C1.69335 3.51647 1.84589 3.28513 2.09235 3.04191C2.3388 2.79869 2.57331 2.64813 2.90286 2.52247C3.1509 2.42713 3.52442 2.31435 4.21142 2.28358C4.95417 2.24991 5.17729 2.24319 7.0582 2.24319C8.9391 2.24319 9.16244 2.25047 9.90582 2.28358C10.5928 2.31441 10.9656 2.42802 11.2144 2.52247C11.5434 2.64813 11.7781 2.79902 12.0249 3.04191C12.2717 3.2848 12.4239 3.51647 12.552 3.84069C12.6487 4.08513 12.7631 4.45324 12.7944 5.1303C12.8285 5.86291 12.8354 6.08219 12.8354 7.93669C12.8354 9.79119 12.8285 10.0105 12.7944 10.7431C12.7631 11.4201 12.6481 11.7881 12.552 12.0327C12.4239 12.3569 12.2714 12.5882 12.0249 12.8309C11.7784 13.0736 11.5434 13.2241 11.2144 13.3504C10.9663 13.4457 10.5928 13.5585 9.90582 13.5892C9.16306 13.6229 8.93994 13.6296 7.0582 13.6296C5.17645 13.6296 4.95395 13.6229 4.21142 13.5892ZM4.15307 1.03424C3.40294 1.06791 2.89035 1.18513 2.4427 1.3568C1.9791 1.53408 1.58663 1.77191 1.19446 2.1578C0.802277 2.54369 0.56157 2.93108 0.381687 3.38797C0.207498 3.82941 0.0885535 4.3343 0.0543922 5.07358C0.0196672 5.81402 0.0117188 6.05074 0.0117188 7.93663C0.0117188 9.82252 0.0196672 10.0592 0.0543922 10.7997C0.0885535 11.539 0.207498 12.0439 0.381687 12.4853C0.56157 12.9419 0.802334 13.3297 1.19446 13.7155C1.58658 14.1012 1.9791 14.3387 2.4427 14.5165C2.89119 14.6881 3.40294 14.8054 4.15307 14.839C4.90479 14.8727 5.1446 14.8811 7.0582 14.8811C8.9718 14.8811 9.212 14.8732 9.96332 14.839C10.7135 14.8054 11.2258 14.6881 11.6737 14.5165C12.137 14.3387 12.5298 14.1014 12.9219 13.7155C13.3141 13.3296 13.5543 12.9419 13.7347 12.4853C13.9089 12.0439 14.0284 11.539 14.062 10.7997C14.0962 10.0587 14.1041 9.82252 14.1041 7.93663C14.1041 6.05074 14.0962 5.81402 14.062 5.07358C14.0278 4.33424 13.9089 3.82913 13.7347 3.38797C13.5543 2.93135 13.3135 2.5443 12.9219 2.1578C12.5304 1.7713 12.137 1.53408 11.6743 1.3568C11.2258 1.18513 10.7135 1.06735 9.96388 1.03424C9.21256 1.00058 8.97236 0.992188 7.05876 0.992188C5.14516 0.992188 4.90479 1.00002 4.15307 1.03424Z" fill="currentColor" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    {/* or line  */}
                    <div className="flex w-full items-center space-x-4 mt-10 mb-10">
                        <div className="flex-1 border-b border-gray-200" />
                        <span className="flex items-center justify-center text-gray-400 text-lg font-normal leading-7 px-5">OR</span>
                        <div className="flex-1 border-b border-gray-200" />
                    </div>
                    <div className=" mt-1  text-center tracking-wide" >
                        <p>Don&apos;t have an account? <span onClick={(e) => { e.preventDefault(); navigate('/signup') }} className="font-semibold cursor-pointer hover:underline text-blue-500">Create One</span></p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Login