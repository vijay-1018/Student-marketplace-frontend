import Image from 'next/image';
import NavLogo from '../public/assets/navLogo.png'
import BuyLogo from 'mdi-react/ShoppingBasketMinusIcon'
import LostLogo from 'mdi-react/PuzzleMinusIcon'
import FoundLogo from 'mdi-react/SearchPlusIcon'
import UploadLogo from 'mdi-react/UploadIcon'
import TrackLogo from 'mdi-react/MapMarkerDistanceIcon'
import ProfileLogo from '../public/assets/profileLogo.png'
import React, { useState, useEffect } from 'react';
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import WishList from 'mdi-react/HeartIcon'
import Cancel from 'mdi-react/CancelBoldIcon'
import SignIn from 'mdi-react/SignInIcon';
import SignOut from 'mdi-react/SignOutIcon';
import TrackOrder from 'mdi-react/MapMarkerDistanceIcon';

const Navbar=({ user })=>
{
    const [profile, setProfile] = useState(false);
    const handleProfile = () => {
        setProfile(!profile);
    };
    const {data:session}=useSession()
    const [nav, setNav] = useState(false);

    useEffect(() => {
        const handleShadow = () => {
            if (window.scrollY >= 90) {
              setNav(true);
            } else {
              setNav(false);
            }
          };
          window.addEventListener('scroll', handleShadow);
    }, [])
    

    return(
        <div className="">

        {/* Navbar  */}
        <div className="hidden md:flex fixed w-full z-40 top-0 mb-96">
            <div className="flex justify-between items-center w-full h-20 font-bold shadow-xl bg-white">
                <div className="pl-12">
                    <a href='/'>
                        <Image
                        src={NavLogo}
                        alt='/'
                        width='50'
                        height='50'
                        className='cursor-pointer'
                        />
                    </a>
                </div>
                <div className="flex justify-around h-full">
                    <a href='/buy' className="flex justify-around flex-col w-28 items-center  hover:border-b">
                        <div>
                           <BuyLogo size={32} color='#41436A'/>
                        </div>
                        <div className="text-sm uppercase">
                            Buy a Product
                        </div>
                    </a>
                    <a href='/lost' className="flex justify-around flex-col w-28 items-center hover:border-b">
                        <div>
                            <LostLogo size={32} color="#984063"/>
                        </div>
                        <div className="text-sm uppercase">
                            Lost Items
                        </div>
                    </a>
                    <a href='/found' className="flex justify-around flex-col w-28 items-center hover:border-b">
                        <div>
                            <FoundLogo size={32} color="#F64668"/>
                        </div>
                        <div className="text-sm uppercase">
                            Found Items
                        </div>
                    </a>
                    <a href='/upload' className="flex justify-around flex-col w-28   items-center  hover:border-b">
                        <div>
                            <UploadLogo size={32}  color="#FE9667"/>
                        </div>
                        <div className="text-sm uppercase">
                            Upload
                        </div>
                    </a>
                    <a href='/wishlist' className="flex justify-around flex-col w-28 items-center hover:border-b">
                        <div>
                            <WishList size={32}  color="#60C85B"/>
                        </div>
                        <div className="text-sm uppercase">
                            WishList
                        </div>
                    </a>
                    <a href='/track' className="flex justify-around flex-col w-28 items-center hover:border-b">
                        <div>
                            <TrackLogo size={32} color="#CCAA66"/>
                        </div>
                        <div className="text-sm uppercase">
                            TrackOrders
                        </div>
                    </a>
                </div>
                <div className="pr-12">
                    <button onClick={()=>handleProfile()}>
                    {
                        session?(
                            <img
                            src={session.user.image}
                            alt='/'
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

        {/* Navbar for mobile view */}
        <div className="flex md:hidden flex-col w-full mb-48 z-[150]">
            <div className=
            {nav?'flex flex-row justify-between w-full fixed top-0 py-2 z-[100] bg-blue-400 transition-colors duration-1000 ease-in-out shadow-2xl':
             'flex flex-row justify-between w-full fixed top-0 py-2 z-0 bg-blue-200 ease-in-out duration-300'}
                >
                <div>
                    <a href='/'>
                        <Image
                        src={NavLogo}
                        alt='/'
                        width='42'
                        height='42'
                        className='cursor-pointer'
                        />
                    </a>
                </div>
                <div className="pr-8">
                    <button onClick={()=>handleProfile()}>
                        {
                        session?(
                            <img
                            src={session.user.image}
                            alt='/'
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
            <div className="bg-blue-200 rounded-lg h-40">
                <div className="bg-white rounded-lg shadow-2xl mt-20 mx-3 p-6 flex flex-col text-sm uppercase font-semibold">
                    <div className="grid grid-cols-3 w-full mb-8">
                        <a href='/buy' className="flex flex-col items-center cursor-pointer">
                            <div>
                                <BuyLogo size={32} color='#41436A'/>
                            </div>
                            <div className="pt-1">
                                <p>Buy</p>
                            </div>
                        </a>
                        <a href='/lost' className="flex flex-col items-center cursor-pointer">
                            <div>
                                <LostLogo size={32} color="#984063"/>
                            </div>
                            <div className="pt-1">
                                <p>Lost</p>
                            </div>
                        </a>
                        <a href='/found' className="flex flex-col items-center cursor-pointer">
                            <div>
                                <FoundLogo size={32} color="#F64668"/>
                            </div>
                            <div className="pt-1">
                                <p>Found</p>
                            </div>
                        </a>
                    </div>
                    <div className="grid grid-cols-3 w-full">
                        <a href='/wishlist' className="flex flex-col items-center cursor-pointer">
                            <div>
                                <WishList size={32}  color="#60C85B"/>
                            </div>
                            <div className="pt-1">
                                <p>WishList</p>
                            </div>
                        </a>
                        <a href='/upload' className="flex flex-col  items-center cursor-pointer">
                            <div>
                                <UploadLogo size={32}  color="#FE9667"/>
                            </div>
                            <div className="pt-1">
                                <p>Upload</p>
                            </div>
                        </a>
                        <a href='/track' className="flex flex-col items-center cursor-pointer">
                            <div>
                                <TrackLogo size={32}  color="#CCAA66"/>
                            </div>
                            <div className="pt-1">
                                <p>Track</p>
                            </div>
                        </a>
                    </div>
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
                    <a href='/track'className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <TrackOrder color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Track Orders
                        </div>
                    </a> 
                    <a href='/wishlist' className='flex flex-row rounded-lg shadow-lg m-2 p-3 cusor-pointer border-2 border-slate-200'>
                        <div>
                            <WishList  color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            WishList
                        </div>
                    </a> 
                    <button onClick={()=>signOut()} className='flex flex-row rounded-lg shadow-lg m-2 p-3 border-2 border-slate-200'>
                        <div>
                            <SignOut  color='#8A307F'/>
                        </div>
                        <div className='pl-4 cursor-pointer'>
                            Sign Out
                        </div>
                    </button>         
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
                    <button onClick={()=>signIn()} className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <SignIn  color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                           Sign In
                        </div>
                    </button>
                </div>            
            )
            }
        </div>

        </div>
    )
    
}


export default Navbar;