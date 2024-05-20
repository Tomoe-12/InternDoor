
const filterByCategory = ({ category, filterCategory, setFilterCategory }) => {
    return (
        <div>
            {category.map((cate)=>(
              <div key={cate}>
                  <input type="checkbox" className='' />
              </div>
            ))}
        </div>
    )
}

export default filterByCategory