import React from 'react';

type Tcheck = {
    check: boolean
    onClick:()=> any
}

const Switch: React.FC<Tcheck> = ({ check,onClick }) => {

    return (
        <label className="flex flex-col items-center cursor-pointer">
            <div className="ml-3 text-gray-400 font-medium">
                {check ? 'Activo' : 'Inactivo'}
            </div>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={check}
                    onChange={onClick}
                />
                <div className="block bg-gray-100 w-12 h-6 rounded-full"></div>
                <div
                    className={`dot absolute left-1 top-1  w-4 h-4 rounded-full duration-200 transition ${check ? 'translate-x-6 bg-sky-500' : 'bg-red-500'
                        }`}
                ></div>
            </div>

        </label>
    );
};

export default Switch;
