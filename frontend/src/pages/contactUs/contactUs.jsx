import { useEffect, useState } from "react"
import axios from 'axios'
const ContactUs = () => {

  const [developers, setDevelopers] = useState([])



  useEffect(() => {

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const fetchData = async () => {

      try {
      fetch("../../../developers.json")
      .then(response => response.json())
      .then(data => {
        setDevelopers(data)
      })


      } catch (e) {
        console.error('error fetching data at contact us page : ' + e)
      }
    };
    fetchData()
  }, []);

  return (
    <div >
      <section className="bg-white xl:mt-28 mt-16 ">
        <div className="section-container py-20 mx-auto ">
          <h1 className="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl  ">
            Our Executive Team
          </h1>
          <p className="max-w-2xl mx-auto my-8 text-center text-gray-500 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
            incidunt ex placeat modi magni quia error alias, adipisci rem
            similique, at omnis eligendi optio eos harum.
          </p>
          <div className=" grid grid-cols-1 gap-8 mt-16 xl:mt-16 md:grid-cols-2 xl:grid-cols-5 md:px-0 px-12">

            {/* developers  */}
            {!!developers && developers.map((dev, i) => (



              <div key={i} className="flex flex-col items-center p-5 py-8  transition-colors duration-300 transform border cursor-pointer rounded-xl  group  ">
                {/* img */}

                <img
                  className="object-cover w-36 h-36  rounded-full ring-4  ring-gray-300 border"
                  src={dev.image}
                  alt={dev.linkedin}

                />

                {/* linkedin */}
                <h1 className="mt-6 text-2xl font-semibold text-gray-700 capitalize  ">
                  {dev.name}
                </h1>

                {/* role */}
                <p className="mt-4 text-gray-500 capitalize  ">{dev.role}</p>

                {/* icons  */}
                <div className="flex mt-5 -mx-2">

                  <a
                    href={dev.email}
                    className="mx-2 text-gray-600  hover:text-gray-500  "
                    aria-label="Reddit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 512 512"><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" /></svg>
                  </a>
                  <a
                    href={dev.linkedin}
                    className="mx-2 text-gray-600  hover:text-gray-500  "
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg>
                  </a>
                  <a
                    href={dev.github}
                    className="mx-2 text-gray-600  hover:text-gray-500  "
                    aria-label="Github"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path>
                    </svg>
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs