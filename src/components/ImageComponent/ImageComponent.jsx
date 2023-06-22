import React from 'react'
import "./style.modules.css"
const ImageComponent = ({ img, alt }) => {
    return (
        <img
            className="image"
            src={img}
            alt={alt}
        />
    )
}

export default ImageComponent