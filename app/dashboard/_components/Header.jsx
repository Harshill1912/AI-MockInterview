"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function Header() {
    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
        <Image src={'/L.png'} width={160} height={100} alt='logo'/>
        <ul className=' hidden md:flex gap-6'>
            <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path=='/dashboard' &&'text-purple-700 font-bold'}`}>Dashboard</li>
            <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions' &&'text-purple-700 font-bold'}`}>Question</li>
            <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path=='/dashboard/upgrade' &&'text-purple-700 font-bold'}`}>Upgrade</li>
            <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path=='/dashboard/how' &&'text-purple-700 font-bold'}`}>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header