import React from 'react'
import "./style.modules.css"
const DeleteButton = ({ removeMoveable, id }) => {
    return (
        <button className='delete-button' onClick={() => removeMoveable(id)}>X</button>
    )
}

export default DeleteButton