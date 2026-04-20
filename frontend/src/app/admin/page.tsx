import HeaderWrapper from '@/widgets/header/HeaderWrapper'
import React from 'react'
import AdminDashboard from './ui/AdminDashboard'

const page = () => {
  return (
    <div className='app'>
        <HeaderWrapper />
        <div className="container">
            <AdminDashboard />
        </div>
    </div>
  )
}

export default page