import React from 'react'
import { TiArrowBack } from 'react-icons/ti'
import { Link } from 'react-router-dom'

const Error404 = () => {
    return (
        <div className='bg-gray-950 py-10 flex justify-center items-center flex-col'>

            <div className="bg-error-404 min-h-[300px] h-[60vh] w-full"></div>

            <div className='mt-4'>
                <Link to="/" className="flex text-white items-center bg-purple-700 border-0 py-2 px-3 focus:outline-none transition-all hover:transition-all hover:bg-purple-600 rounded text-base" data-aos="fade-up">
                    <TiArrowBack className='text-xl me-1' />
                    Back to Home
                </Link>
            </div>

        </div>
    )
}

export default Error404