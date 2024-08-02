import { UserButton } from '@clerk/nextjs'
import AddNewinterview from './_components/AddNewinterview'
import React from 'react'
import  List  from "./_components/interviewList";

function Dashboard() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewinterview></AddNewinterview>
      </div>
    
    <List />
    </div>
  )
}

export default Dashboard