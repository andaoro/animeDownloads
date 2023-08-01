import React from "react";
import Switch from "../Switch/Switch ";
import { AiOutlineEdit } from 'react-icons/ai'

type TUsers = {
    enabled: boolean;
    id: number;
    type: string;
    username: string;
};

interface TablaData {
    headers: string[];
    rows: TUsers[];
}

interface TablaResponsiveProps {
    data: TablaData;
    estado:(estado:boolean,id:number)=>any
}


const TablaResponsive: React.FC<TablaResponsiveProps> = ({ data,estado }) => {


    return (
        <div className="w-screen md:px-12">
            <div className="overflow-x-auto hidden md:inline">
                <table className="table-auto w-full text-center">
                    <thead className="bg-sky-700">
                        <tr>
                            {data.headers.map((header) => (
                                <th key={header} className="px-4 py-2 border-2 border-sky-100">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((user, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <span className="p-2">{user.id}</span>
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="p-2">{user.type}</span>
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="p-2">{user.username}</span>
                                </td>
                                <td className="border px-4 py-2 flex justify-center items-center gap-x-4">
                                    <Switch check={user.enabled} onClick={()=>{estado(user.enabled,user.id)}}/>
                                    <div>
                                        <span className="text-gray-400">Editar</span>
                                        <span className="cursor-pointer" onClick={() => { console.log(user) }}><AiOutlineEdit size={23} /></span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden">
                {data.rows.map((rows, index) => (
                    <section className="flex w-full border-b-2 border-b-gray-300 px-2" key={index}>
                        <div className="flex flex-col w-full boder-r-2 font-bold">
                            {data.headers.map((header) => (
                                <span key={header} className="border-t-2 border-t-gray-700 p-2 ">{header}</span>
                            ))}
                        </div>
                        <div className="flex flex-col w-full border-l-2 border-l-gray-300">
                            <span key={index} className="border-t-2 border-t-gray-700 p-2">{rows.id}</span>
                            <span key={index+1} className="border-t-2 border-t-gray-700 p-2">{rows.type}</span>
                            <span key={index+2} className="border-t-2 border-t-gray-700 p-2">{rows.username}</span>
                            <span className="border-t-2 border-t-gray-700 p-2 flex gap-x-12 my-2 items-center justify-center">
                                <Switch check={rows.enabled} onClick={()=>{estado(rows.enabled,rows.id)}}/>
                                <div>
                                    <span className="text-gray-400">Editar</span>
                                    <span className="cursor-pointer" onClick={() => { console.log(rows.enabled,rows.id) }}><AiOutlineEdit size={23} /></span>
                                </div>
                            </span>

                        </div>
                    </section>
                ))}
            </div>
        </div>

    );
};

export default TablaResponsive;
