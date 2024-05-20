
const FilterAndSortBy = ({ sort, setSort }) => {

    

    const onSelectChange = ({ currentTartget: input }) => {
        setSort({ sort: input.value, order: sort.order })
    }
    const onArrowchange = () => {
        if (sort.order === 'asc') setSort({ sort: sort.sort, order: 'desc' })
        else setSort({ sort: sort.sort, order: 'asc' })
    }
    return (
        <div>
            <div>
                <p>sortBy ;</p>
                <select name="" id="" defaultValue={sort.sort} onChange={onSelectChange}>
                    <option value="year">year</option>
                    <option value="ration">ration</option>

                </select>
                <button className="" onClick={onArrowchange}>
                    <p>&uarr;</p>
                    <p>&darr;</p>
                </button>
              
            </div>
        </div>
      
    )
}

export default FilterAndSortBy