import { HistoryIcon } from "lucide-react"

const exampleSearches = [
  'computadores asus',
  'proteina suplemento',
  'controles para pc',
  'busqueda ultramegahiper' ,
]

const SearchBarHistory = () => {
  return (
    <div className='w-full flex flex-col'>
      {exampleSearches.map((search) => {
        return (
          <div className='flex items-center gap-4 w-full h-12 line-clamp-1 text-ellipsis p-3 leading-10 text-gray-400 border-b-[1px] border-gray-300'>
            <HistoryIcon size={12}/>

            <p className="">{search}</p>
          </div>
        )
      })}
    </div>
  )
}

export default SearchBarHistory
