import React from 'react'
import "./style.module.css"
const ButtonAddMoveable = ({ addMoveable }) => {
    return (
        <button className='button' onClick={addMoveable}>Add Moveable1</button>
    )
}

export default ButtonAddMoveable