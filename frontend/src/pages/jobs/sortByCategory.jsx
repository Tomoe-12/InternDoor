// import { Fragment, useEffect, useState } from 'react'
// import { Listbox, Transition } from '@headlessui/react'
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
// import All from '../../assets/images/JobCategoriesIcons/all.svg'

import { useState } from "react"

// const people = [
//   {
//     id: 0,
//     category: 'All',
//     icon: '../../assets/images/JobCategoriesIcons/all.svg'
//   }

// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function Example() {

//   let [jobCategory, setJobCategory] = useState([])

//   useEffect(() => {
//     fetch('../../../jobCategories.json')
//       .then(response => response.json())
//       .then(result =>
//         setJobCategory(result)
//       )

//     // }
//   }, [])

//   let [selected, setSelected] = useState(jobCategory.length > 0 ? jobCategory[3] : {
//     id: 0,
//     category: 'none',
//     icon: ''
//   });
//   useEffect(() => {
//     if (jobCategory.length > 0) {
//       jobCategory.unshift({
//         id: people[0].id,
//         category: people[0].category,
//         icon: All
//       })
//       setSelected(jobCategory[0]);
//     }
//   }, [jobCategory]);

//   return (
//     <Listbox value={selected} onChange={setSelected}>
//       {({ open }) => (
//         <>

//           <div className="relative mt-2">
//             <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-black sm:text-sm sm:leading-6">

//               <span className="flex items-center">
//                 <img alt="" className=" flex-shrink-0 rounded-full" />
//                 <div className="max-w-8 min-w-8 h-8 rounded-xl ">
//                   <img src={selected.icon} />
//                 </div>
//                 <span className="ml-3 block truncate">{selected.category}</span>
//               </span>

//               <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
//                 <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//               </span>
//             </Listbox.Button>

//             <Transition
//               show={open}
//               as={Fragment}
//               leave="transition ease-in duration-100"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                 {jobCategory.map((jobCate) => (
//                   <Listbox.Option
//                     key={jobCate.id}
//                     className={({ active }) =>
//                       classNames(
//                         active ? 'bg-blue-100 ' : 'text-gray-900',
//                         'relative cursor-default select-none py-2 pl-3 pr-9'
//                       )
//                     }
//                     value={jobCate}
//                   >
//                     {({ selected, active }) => (
//                       <>
//                         <div className="flex items-center py-1 ">
//                           {/* <div className='max-h-12 max-w-12 rounded-full  items-center test'>
//                             <img src={jobCate.icon} alt="" className="h-10 w-10 flex-shrink-0 " />
//                           </div> */}
//                           <div className="max-w-8 min-w-8 rounded-xl ">
//                             <img src={jobCate.icon} />
//                           </div>
//                           <span
//                             className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
//                           >
//                             {jobCate.category}
//                           </span>
//                         </div>

//                         {selected ? (
//                           <span
//                             className={classNames(
//                               active ? 'bg-blue-100  text-black ' : 'text-indigo-600',
//                               'absolute inset-y-0 right-0 flex items-center pr-4 '
//                             )}
//                           >
//                             <CheckIcon className="h-6 w-6" aria-hidden="true" />
//                           </span>
//                         ) : null}
//                       </>
//                     )}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         </>
//       )}
//     </Listbox>

//   )
// }


const SortByCategory = ({ category, filterCategory, setFilterCategory }) => {


  let onChange = ({ currentTarget: input }) => {
    if (input.checked) {
      const state = [...filterCategory, input.value]
      setFilterCategory(state)
    } else {
      const state = filterCategory.filter(item => item !== input.value)
      setFilterCategory(state)
    }


  }
  // console.log(filterCategory);
  return (
    <div >

      {!!category.length && category.map((item, i) => (
        <div key={i} className="mt-5 ">
          <div className="form-control  hover:outline hover:outline-1 outline-blue-500  p-1  rounded-full px-2">
            <label className="cursor-pointer label  space-x-2 ">
              <img src={item.icon} className="w-7 h-7" alt="" />
              <span className="label-text ">{item.category}</span>
              <input type="checkbox" id={item.category} value={item.category} onChange={onChange} checked={filterCategory.includes(item.category)} className="checkbox   checkbox-md" />
            </label>
          </div>
        </div>
      ))}


    </div>
  )
}

export default SortByCategory