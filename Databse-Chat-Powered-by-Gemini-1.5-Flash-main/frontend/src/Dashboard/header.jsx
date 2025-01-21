import React from 'react'
import { SignedOut, SignIn, SignedIn, UserButton } from '@clerk/clerk-react'







function header() {
  return (
    <div>

      
      <h3 className='mb-2font-extralight text-slate-500'>AI Chat</h3>

         <UserButton />

  

        </div>
  )
}

export default header