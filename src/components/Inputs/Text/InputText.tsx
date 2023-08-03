import React, { useState } from 'react'

type PropsInputText = {
    texto:string,
    valueText:string,
    setValueText:React.Dispatch<React.SetStateAction<string>>
    typeInput?:string
}

export const InputText:React.FC<PropsInputText> = ({texto,valueText,setValueText, typeInput = 'text'}) => {

    const [textFocused, setTextFocused] = useState(false)
    return (
        <div className={` my-6 w-72 border-b-2 border-b-gray-700  ${textFocused && "border-b-sky-400"}`}>
            <label>
                
                <input
                    placeholder={texto}
                    type={typeInput}
                    value={valueText}
                    onChange={(e) => { setValueText(e.target.value) }}
                    className='InputLogin'
                    onFocus={() =>  setTextFocused(true ) }
                    onBlur={()=> setTextFocused(false)}
                    onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                            /* login() */
                        }
                    }}
                />
            </label>
        </div>
    )
}
