import React from 'react'
import { ImSpinner3 } from 'react-icons/im'

const Spinner = ({ className }) => {
    return (
        <ImSpinner3 className={`custom-spinner ${className}`} />
    )
}

export default Spinner