import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between bg-gradient-to-r bg-transparent text-white py-4 shadow-lg'>
        <div className='logo'>
            <span className='font-bold text-3xl mx-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              iTask
            </span>
        </div>
        <ul className='flex gap-8 mx-9 items-center'>
            <li className='cursor-pointer hover:text-blue-400 transition-all duration-300 font-medium'>
              Home
            </li>
            <li className='cursor-pointer hover:text-blue-400 transition-all duration-300 font-medium'>
              Contact
            </li>
            <li className='cursor-pointer hover:text-blue-400 transition-all duration-300 font-medium'>
              About Us
            </li>
            <li className='cursor-pointer hover:text-blue-400 transition-all duration-300 font-medium'>
              Your Tasks
            </li>
        </ul>
    </nav>
  )
}

export default Navbar