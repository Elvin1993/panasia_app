import React from 'react'

export default function DemoLayout ({children}) {
  return (
    <div className='demo page'>
      <h1>DEMO Module</h1>
      {children}
    </div>
  )
}
