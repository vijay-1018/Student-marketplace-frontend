import React from 'react'
import {useSession,signIn,signOut} from 'next-auth/react'


export default function Login()
{
    const {data:session,status}=useSession({required:true})
    if(status==='authenticated')
    {
        return(
          <div>
            <p>WEelcome, {session.user.email}</p>
            <img src={session.user.image}/>
            <button onClick={()=>signOut()}>Sign Out</button>
        </div>
        )
    }
    else
    {
        return(
            <div>
            <button onClick={()=>signIn()}>Sign IN</button>
         </div>
        )  
    }
}

