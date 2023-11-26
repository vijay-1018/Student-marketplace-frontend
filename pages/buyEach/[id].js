import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import ContentLoader from 'react-content-loader';
import ProfileLogo from '../../public/assets/profileLogo.png'
import CartAlt from '../../public/assets/cart.png'
import NotFound from '../../public/assets/not-found.png'
import React, { useState, useEffect } from 'react';
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import BackButton from 'mdi-react/ArrowLeftBoldIcon';
import WishList from 'mdi-react/HeartIcon'
import Cancel from 'mdi-react/CancelBoldIcon'
import SignIn from 'mdi-react/SignInIcon';
import SignOut from 'mdi-react/SignOutIcon';
import TrackOrder from 'mdi-react/TrackChangesIcon';
import YourUpload from 'mdi-react/UploadIcon';

export default function buy()
{
    const [profile, setProfile] = useState(false);
    const {data:session}=useSession()
    const [data, setData] = useState(null)
    const router = useRouter();

    useEffect(() => {
        
    }, []);

    
    const handleProfile = () => {
        setProfile(!profile);
    };

    return(
        <div className="">

        {/* navbar */}
        <div className="md:flex fixed w-full z-40 top-0 mb-96">
            <div className="flex justify-between bg-white items-center w-full h-16 font-bold ">
                <div className="md:pl-12 p-2">
                    <button>
                        <BackButton color='#8A307F'/>
                    </button>
                </div>
                <div>
                    {router.query.id    }
                </div>
                <div className="md:pr-12 pr-2">
                    <button onClick={()=>handleProfile()}>
                    {
                        session?(
                            <img
                            src={session.user.image}
                            alt={CartAlt}
                            width='40'
                            height='40'
                            className='cursor-pointer rounded-full'
                            />
                            ):
                            (
                            <Image
                            src={ProfileLogo}
                            alt='/'
                            width='40'
                            height='40'
                            className='cursor-pointer'
                            />
                        )
                    }
                    </button>
                </div>
           </div>
        </div>

        {/* profile dropdown */}
        <div className={
            profile?'bg-white fixed right-0 top-24 h-auto w-72 z-50 flex flex-col pt-8 pb-2 px-2 rounded-2xl shadow-2xl border-2 border-slate-300':'hidden'
        }>
            {session?
            (
                <div className=' text-[#333333] text-[16px] font-sans flex flex-col font-medium rounded-lg'> 
                    <div className='absolute right-1 top-0 cursor-pointer'>
                        <button onClick={()=>handleProfile()}>
                            <Cancel color='#8A307F'/>
                        </button>
                    </div>
                    <div className='bg-red-200 rounded-lg shadow-lg m-2 p-3 border-2 border-slate-200'>
                        <div>
                        {session.user.email}
                        </div>
                        <div>
                        {session.user.name}  
                        </div>  
                    </div>
                    <div className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <TrackOrder color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Track Orders
                        </div>
                    </div> 
                    <div className='flex flex-row rounded-lg shadow-lg m-2 p-3 cusor-pointer border-2 border-slate-200'>
                        <div>
                            <YourUpload  color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Your Uploads
                        </div>
                    </div> 
                    <div className='flex flex-row rounded-lg shadow-lg m-2 p-3 cusor-pointer border-2 border-slate-200'>
                        <div>
                            <WishList  color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            WishList
                        </div>
                    </div> 
                    <div className='flex flex-row rounded-lg shadow-lg m-2 p-3 border-2 border-slate-200'>
                        <div>
                            <SignOut  color='#8A307F'/>
                        </div>
                        <div className='pl-4 cursor-pointer'>
                            <button onClick={()=>signOut()}>Sign Out</button>
                        </div>
                    </div>         
                </div>
            )
            :
            ( 
                <div className='text-[#333333] text-[16px] font-sans flex flex-col font-medium rounded-lg'> 
                    <div className='absolute right-1 top-0 cursor-pointer'>
                        <button onClick={()=>handleProfile()}>
                            <Cancel color='#8A307F'/>
                        </button>
                    </div>
                    <div className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <SignIn  color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                           <button onClick={()=>signIn()}>Sign In</button>
                        </div>
                    </div>
                </div>            
            )
            }
        </div>

        </div>
        
    );
}