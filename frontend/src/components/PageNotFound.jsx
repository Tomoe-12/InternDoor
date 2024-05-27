import { Link } from "react-router-dom"

const Page404 = () => {
  return (
    <>
      <main className="grid h-lvh  place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-5xl font-semibold text-blue-500">404</p>
          <h1 className="mt-4  font-bold tracking-tight  text-gray-900 sm:text-6xl">
            Page not found
          </h1>
          <p className="mt-6 text-sm leading-7 text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/home"
              className="rounded-md bg-gradient-to-br from-cyan to-violet px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page404