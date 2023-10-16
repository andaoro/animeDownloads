import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IAnimesDownloadedProps } from '../../views/Home/HomeScreen';

type PropsPagination = {
    pages: number;
    actualPage: number;
    setPage?: React.Dispatch<React.SetStateAction<number>>;
    setanimes:React.Dispatch<React.SetStateAction<IAnimesDownloadedProps[]>>
};

export const Pagination: React.FC<PropsPagination> = ({
    pages,
    actualPage,
    setPage,
    setanimes
}) => {

    const navigate = useNavigate()
    const location = useLocation()

    const totalPages = Array.from({ length: pages }, (_, index) => index + 1);
    const lastPage = totalPages[totalPages.length - 1];

    const visiblePages = 5; // Cantidad de páginas visibles antes de usar los puntos suspensivos.

    const getVisiblePageRange = () => {
        if (pages <= visiblePages) {
            return totalPages;
        }

        const start = Math.max(1, actualPage - Math.floor(visiblePages / 2));
        const end = Math.min(lastPage, start + visiblePages - 1);

        const pagesToDisplay = [];
        if (start > 1) {
            pagesToDisplay.push(1);
            if (start > 2) {
                pagesToDisplay.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pagesToDisplay.push(i);
        }

        if (end < lastPage) {
            if (end < lastPage - 1) {
                pagesToDisplay.push('...');
            }
            pagesToDisplay.push(lastPage);
        }

        return pagesToDisplay;
    };

    return (
        <div className="w-full">
            <ul className="flex justify-center gap-x-2">
                {getVisiblePageRange().map((page, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            if (setPage) {
                                if (typeof page === 'number') {
                                    setPage(page - 1);
                                    navigate(`${location.pathname}?page=${page}`)
                                    setanimes([])
                                }
                            }
                        }}
                        className={`flex justify-center items-center cursor-pointer w-8 h-8 rounded hover:bg-Rsecondary hover:text-white transition-all duration-300 ${actualPage + 1 === page ? 'bg-Rsecondary text-white' : 'bg-white text-black font-medium'
                            }`}
                    >
                        {page}
                    </li>
                ))}
            </ul>
        </div>
    );
};
