import React from 'react'

type PropsPagination = {
    pages: number,
    actualPage:number,
    setPage?:React.Dispatch<React.SetStateAction<number>>
}

export const Pagination: React.FC<PropsPagination> = ({ pages,actualPage,setPage }) => {

    const totalPages = Array.from({ length: pages }, (_, index) => index + 1);

    const lastPage = totalPages[totalPages.length -1 ]

    return (
        <div className='w-full'>
            <ul className='flex justify-center gap-x-2 [&>li]:font-bold'>
                {totalPages.map((page) => (
                    page <= 10 && (<li onClick={()=>{
                        if(setPage){
                            setPage(page-1)
                        }
                    }} className={`flex justify-center items-center cursor-pointer w-8 h-8 rounded hover:bg-sky-700 hover:text-white transition-all duration-300 ${actualPage + 1 == page ? 'bg-sky-700 text-white':'bg-white text-black'}`} key={page}>{page}</li>)
                ))}
                {
                    pages > 10 &&(
                        <>
                        <li className='bg-sky-700 px-2 rounded'>...</li>
                        <li className='bg-sky-700 px-2 rounded'>{lastPage}</li>
                        </>
                    )
                }
            </ul>
        </div>
    )
}
