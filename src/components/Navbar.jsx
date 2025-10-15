import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-center bg-gradient-to-r bg-transparent text-white py-3 sm:py-4 px-4'>
        <div className='logo'>
            <span className='font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg'>
              iTask
            </span>
        </div>
    </nav>
  )
}

export default Navbar