import React from 'react'
import Content from './footer-content';

export default function Footer() {
  return (
    <div 
        className='relative h-[384px]'
        style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
        <div className='relative h-[calc(100vh+384px)] -top-[100vh]'>
            <div className='h-[384px] sticky top-[calc(100vh-384px)]'>
              <Content />
            </div>
        </div>
    </div>
  )
}