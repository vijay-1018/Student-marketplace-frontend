import Image from 'next/image';
import axios from 'axios';
import ContentLoader from 'react-content-loader';
import ProfileLogo from '../public/assets/profileLogo.png'
import CartAlt from '../public/assets/cart.png'
import NotFound from '../public/assets/not-found.png'
import React, { useState, useEffect } from 'react';
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import FilterListIcon from 'mdi-react/FilterListIcon';
import SortNew from 'mdi-react/SortDateAscendingIcon';
import SortPriceAsc from 'mdi-react/SortNumericAscendingIcon';
import SortPriceDesc from 'mdi-react/SortNumericDescendingIcon';
import CancelIcon from 'mdi-react/CancelCircleIcon'
import All from 'mdi-react/AllInclusiveIcon'
import Elect1 from 'mdi-react/MobilePhoneIcon'
import Elect2 from 'mdi-react/MonitorAccountIcon'
import Elect3 from 'mdi-react/CeilingFanIcon'
import Educ1 from 'mdi-react/NotebookIcon'
import Educ2 from 'mdi-react/PenIcon'
import Educ3 from 'mdi-react/FilesIcon'
import Others1 from 'mdi-react/WalletAddIcon'
import Others2 from 'mdi-react/CyclingIcon'
import Others3 from 'mdi-react/BagCarryOnIcon'
import Sports1 from 'mdi-react/FootballIcon'
import Sports2 from 'mdi-react/CricketBatIcon'
import Sports3 from 'mdi-react/BadmintonIcon'
import Home1 from 'mdi-react/HomeIcon'
import ID1 from 'mdi-react/WalletIcon'
import ID2 from 'mdi-react/CardAccountDetailsIcon'
import ID3 from 'mdi-react/CardAccountPhoneIcon'
import Fash1 from 'mdi-react/DresserIcon'
import Fash2 from 'mdi-react/LipstickIcon'
import Fash3 from 'mdi-react/FaceWomanShimmerIcon'
import WishList from 'mdi-react/HeartIcon'
import Cancel from 'mdi-react/CancelBoldIcon'
import Right from 'mdi-react/CheckIcon'
import SignIn from 'mdi-react/SignInIcon';
import SignOut from 'mdi-react/SignOutIcon';
import TrackOrder from 'mdi-react/MapMarkerDistanceIcon';
import YourUpload from 'mdi-react/UploadIcon';
import ArrowDown from 'mdi-react/ArrowDropDownIcon'

export default function buy()
{
    const [profile, setProfile] = useState(false);
    const [filter, setFilter] = useState(false);
    const {data:session}=useSession()
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [categoryFilter,setCategoryFilter]=useState("all");
    const [sortFilter,setSortFilter]=useState("latest");
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false);
    const [wishIds, setwishIds] = useState([]);
    const [email,setEmail]=useState("sample@gamil.com")
    const [width,setWidth]=useState("full");
    const [cols,setCols]=useState("4");
    const [webView,setWebView]=useState(false);
    const [mobView,setMobView]=useState(false);
    const [fullItem,setFullItem]=useState(null);
    const [scrollY, setScrollY] = useState(0);
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    const [clickedWishAnimation,setClickedWishAnimation]=useState(false);
    const [clickedWishSize,setClickedWishSize]=useState(24);
    const [clickedWishColor,setClickedWishColor]=useState("orange");
    const [buyPopUp,setBuyPopUp]=useState(false);
    const [buyId,setBuyId]=useState(null);
    const [buyProduct,setBuyProduct]=useState(null);
    const [successToast,setSuccessToast]=useState(false);
    const [warnToast,setWarnToast]=useState(false);
    const [successToastMsg,setSuccessToastMsg]=useState("");
    const [warnToastMsg,setWarnToastMsg]=useState("");
    const [x1, setX1] = useState(0);
    const [requestSentId,setRequestSentId]=useState([]);

    useEffect(() => {
        setLoading(true);  
        if(session)
        {
            setEmail(session.user.email);
        } 

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const handleResize = () => {
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
            setMobView(false);
            setWebView(false);
            setWidth("  full");
            setCols("4");
        };
      
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        async function fetchData() {
            try
            {
                const res = await axios.get(`http://localhost:4000/getLostType?search=${inputValue}&category=${categoryFilter}&sort=${sortFilter}`);
                const data = await res.data;
                if(data.length) setData(data);
                else setData(null)
                
                data.map((item=>{
                    if(item.wishlist.includes(email))
                    {
                        if(!wishIds.includes(item._id)) 
                        {
                            setwishIds(oldArray =>[...oldArray, item._id])
                        }
                        if(item.customers.includes(email))
                        {
                            if(!requestSentId.includes(item._id)) 
                            {  setRequestSentId(oldArray =>[...oldArray, item._id])}
                        }
                    } 
                }
                ))
                setLoading(false);
            }
            catch(error)
            {
                setWarnToast(true);
                setWarnToastMsg("Server Issue! Please try after some time.")
                handleX1();
                setTimeout(() => {
                    setWarnToastMsg("")
                    setWarnToast(false);
                }, 4000);
                setLoading(false);
            }
        }

        // Initial call to set the window size
        handleResize();
        fetchData();  

        // Clean up the event listener when the component unmounts
        return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        };

    }, [inputValue,categoryFilter,sortFilter,session]);

    
    
    const handleWish=(idValue,flag)=>
    {
        if(flag=="yes" && session)
        {
            setwishIds(wishIds.filter(item => item !== idValue));
        }
        else if(session && flag=="no")
        {
            setwishIds(oldArray =>[...oldArray, idValue]);
            handleClickedWishAnimation(idValue);
        }
        if(session)
        {
            const data = {
                id: idValue,
                email: session.user.email,
                flag:flag
            };
            postWishData('http://localhost:4000/addToWish',data)           
        }
        else
        {
            setWarnToast(true);
            setWarnToastMsg("Please Login First to add items to wishlist")
            handleX1();
            setTimeout(() => {
                setWarnToastMsg("")
                setWarnToast(false);
            }, 4000);
        }

        async function postWishData(url,data) {
            try
            {
                const response =await axios.post(url, data);
            }
            catch(error)
            {
                setWarnToast(true);
                setWarnToastMsg("Server Issue! Please try after some time")
                handleX1();
                setTimeout(() => {
                    setWarnToastMsg("")
                    setWarnToast(false);
                }, 4000);
            }
        }
    };

    const handleProfile = () => {
        setProfile(!profile);
    };

    const handleFilter = () => {
        setFilter(!filter);
    };

    function handleInputChange(event) {
      const newValue = event.target.value;
      setInputValue(newValue);
    }

    function handleClearClick() {
        setInputValue(" ");
        setIsFocused(false);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setFullItem(null)
        setWebView(false);
        setMobView(false);
        setBuyId(null);
        setBuyProduct(null);
        setBuyPopUp(false);
        setWidth("full");
        setCols("4");
    };
    
    const handleSortChange= (value) => {
        setSortFilter(value);
        setFilter(!filter);
        setBuyId(null);
        setBuyProduct(null);
        setBuyPopUp(false);
    };

    const handleView=(item)=>
    {
        if(session)
        {
            if(windowSize.width>1024) 
            {
                setWebView(true);
                setFullItem(item);
                setWidth("1/2");
                setCols("2");
            }
            else
            {
                setMobView(true);
                setFullItem(item);
            }      
        }
        else
        {
            setWarnToast(true);
            setWarnToastMsg("Please login first to view this item");
            handleX1();
            setTimeout(() => {
                setWarnToastMsg("")
                setWarnToast(false);
            }, 4000);
        }
    }

    const handleViewCancel=(item) =>
    {
        setWebView(false);
        setMobView(false);
        setFullItem(null);
        setBuyId(null);
        setBuyProduct(null);
        setBuyPopUp(false);
        setWidth("full");
        setCols("4");
        
    };

    const handleBuyPopUp=(idValue,product)=>
    {
        setBuyPopUp(!buyPopUp);
        setBuyId(idValue);
        setBuyProduct(product);
    }

    const buyThis=(idValue) =>
    {
        if(session)
        {
            const data = {
                id: idValue,
                email: session.user.email,
            };
            postData('http://localhost:4000/buyThis',data)   
            setBuyId(null);
            setBuyProduct(null);
            setBuyPopUp(false);        
        }
        else
        {
            setBuyId(null);
            setBuyProduct(null);
            setBuyPopUp(false);
            setWarnToast(true);
            setWarnToastMsg("Please Login first to buy this item")
            handleX1();
            setTimeout(() => {
                setWarnToastMsg("")
                setWarnToast(false);
            }, 4000);
        }

        async function postData(url,data) {
            try
            {
                const response =await axios.post(url, data);
                if(response.data.key=="empty")
                {
                    setWarnToast(true);
                    setWarnToastMsg("A request was already sent")
                    handleX1();
                    setTimeout(() => {
                        setWarnToastMsg("")
                        setWarnToast(false);
                    }, 4000);
                }
                else
                {
                    if(!requestSentId.includes(idValue)) 
                    {  setRequestSentId(oldArray =>[...oldArray, idValue])}
                    setSuccessToast(true);
                    setSuccessToastMsg("Request Sent Successfully!")
                    handleX1();
                    setTimeout(() => {
                        setSuccessToastMsg("")
                        setSuccessToast(false);
                    }, 4000);
                }
            }
            catch(error)
            {
                setWarnToast(true);
                setWarnToastMsg("Server Issue! Please try after some time.")
                setTimeout(() => {
                    setWarnToastMsg("")
                    setWarnToast(false);
                }, 4000);
            }
        }
    };

    const dontBuyThis=()=>
    {
        setBuyId(null);
        setBuyProduct(null);
        setBuyPopUp(false);
    }


    const handleClickedWishAnimation= (idValue) =>
    {
        setClickedWishAnimation(idValue);
        setClickedWishColor("orange")
        setClickedWishSize(24);

        setTimeout(() => {
        setClickedWishAnimation("");
        setClickedWishColor("red");
        }, 2000);
    };

    const handleCancelToastMsg=(type)=>
    {
        if(type=="success")
        {
            setSuccessToast(false);
            setSuccessToastMsg("");
        }
        else 
        {
            setWarnToast(false);
            setWarnToastMsg("");
        }
    }

    const handleX1=()=>
    {
        const animationDuration = 4000; // Animation duration in milliseconds
        const animationSteps = 500; // Number of animation steps
        const stepDuration = animationDuration / animationSteps;   //4

        let currentStep = 0;

        const timer = setInterval(() => 
        {
            currentStep++;

            if (currentStep >= animationSteps) {
                setX1(0);
                clearInterval(timer);
            } else {
                const nextX2 = 200-((currentStep / animationSteps) * 200);
                setX1(nextX2);
        }
        }, stepDuration);
    }
    



    return(
        <div className="">

        {/* navbar */}
        <div className={scrollY>40?"md:flex fixed shadow-2xl w-full z-40 top-0 mb-96 bg-white transition-colors duration-1000 ":"md:flex fixed w-full z-40 top-0 mb-96"}>
            <div className="flex justify-between items-center w-full h-16 font-bold ">
                <div className="md:pl-12 p-2 w-auto">
                    <button className='w-auto flex flex-row' onClick={()=>handleFilter()}>
                        <FilterListIcon size={32} color='#11d7ac'/>
                        <div className={windowSize.width>=1024?'px-4 rounded-lg shadow-2xl border-2 border-slate-300 text-md font-medium w-auto flex flex-row items-center text-[#11d7ac]':'hidden'}>
                            {sortFilter=="latest"?
                            (<div>
                                Latest
                            </div>):
                            (
                                <div>
                                    {sortFilter=="pHtL"?(<div>Price-High to Low</div>):(<div>Price-Low to High</div>)}

                                </div>                            
                            )}
                            <ArrowDown color='' size={16}/>
                        </div> 
                    </button> 
                </div>
                <div className='flex flex-row relative'>
                    <div>
                       <input className="border-[#11d7ac] border-2 md:w-full w-56 rounded-md px-4 py-2 shadow-2xl text-gray-800 focus:outline-double" 
                        type="text" 
                        placeholder="Search for an item"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        />
                    </div>                    
                    <div>
                        {isFocused && inputValue.length > 0 && (
                        <button
                        className="absolute top-1 right-0 p-1"
                        onClick={handleClearClick}
                        >
                        <CancelIcon color=''/>
                        </button>
                        )}
                    </div>
                </div>
                <div className="md:pr-12 pr-2 flex flex-row items-center">
                    <a href='/track' className={windowSize.width>1024?'md:pr-8 cursor-pointer':'hidden'}>
                        <TrackOrder size={32} color='#11d7ac'/>
                    </a>
                    <a href='/wishlist' className={windowSize.width>1024?'relative cursor-pointer':'hidden'}>
                        <div className={wishIds.length>0?'absolute -top-2 z-50 -right-2 text-white bg-red-600 w-5 text-center h-5 text-sm rounded-full':'hidden'}>{wishIds.length}</div>
                        <WishList className=' top-0' size={32} color='#11d7ac'/>
                    </a>
                    <div className='md:pl-12'>
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
        </div>

        {/* filter dropdown    */}
        <div className={
            filter?'bg-white fixed left-0 top-24 h-auto w-72 z-50 flex flex-col pt-8 pb-2 px-2 rounded-2xl shadow-2xl border-2 border-slate-300':'hidden'
        }>
            <div className=' text-[#333333] text-[16px] font-sans flex flex-col font-medium rounded-lg'> 
                <div className='absolute right-1 top-0 cursor-pointer'>
                    <button onClick={()=>handleFilter()}>
                        <Cancel color='#8A307F'/>
                    </button>
                </div>
                <div className='rounded-lg shadow-lg flex flex-row m-2 p-3 cursor-pointer border-2 border-slate-200'>
                    <div className='flex flex-row justify-between w-full'>
                        <div>
                            Latest First
                        </div>
                        <div className='pr-4'>
                            <SortNew color='#8A307F'/>
                        </div> 
                    </div>
                    <button className='cursor-pointer' onClick={() => handleSortChange('latest')}>
                        {sortFilter=="latest"?(
                            <div className='bg-blue-600 rounded-full'>
                               <Right size={20} color='white'/>
                            </div>
                        ):(
                            <div className='bg-white rounded-full border-blue-600 border-2'>
                                <Right size={16} color='white'/>
                            </div>
                        )}
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
                    <a href='/' className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <Home1 color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Back To Home
                        </div>
                    </a> 
                    <a href='/track' className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <TrackOrder color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Track Orders
                        </div>
                    </a>  
                    <a href='wishlist' className='flex flex-row rounded-lg shadow-lg m-2 p-3 cusor-pointer border-2 border-slate-200'>
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
                    <a href='/' className='flex flex-row rounded-lg shadow-lg m-2 p-3 cursor-pointer border-2 border-slate-200'>
                        <div>
                            <Home1 color='#8A307F'/>
                        </div>
                        <div className='pl-4'>
                            Back To Home
                        </div>
                    </a>
                </div>            
            )
            }
        </div>

        {/* categories */}
        <div className="flex py-1 overflow-x-auto mt-16 scrollbar-hide shadow-lg">
            <div className={categoryFilter=="all"?'flex flex-col items-center flex-shrink-0 md:ml-4 md:mr-16 px-5 py-2 mr-6 border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col items-center flex-shrink-0 md:ml-4 md:mr-16 px-5 py-2 mr-6'}>   
               <button className='flex flex-col items-center w-full' onClick={() => handleCategoryChange('all')}>
                    <div className='relative w-full top-3 '>
                        <All color='#8A307F'/>
                    </div>
                    <div className='mt-6 font-bold text-sm text-teal-900'>
                        All
                    </div>                 
                </button>
            </div>
            <div className={categoryFilter=="electronics"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2  border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2'}>
                <button className='flex flex-col items-center w-full ' onClick={() => handleCategoryChange('electronics')}>
                    <div className='relative w-full'>
                        <Elect1 className='absolute top-0 left-2' color=' #8A307F'/>
                        <Elect2 className='absolute top-2 left-8 ' color='#79A7D3'/>
                        <Elect3 className='absolute top-6 left-4' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-sm text-teal-900'>
                        Electronics
                    </div>        
                </button>
            </div>
            <div className={categoryFilter=="education"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2 border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md ':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2 rounded-md'}>
                <button className='flex flex-col items-center' onClick={() => handleCategoryChange('education')}>
                    <div className='relative bg-slate-200 w-full'>
                        <Educ1 className='absolute top-0 left-2' color='#8A307F'/>
                        <Educ2 className='absolute top-2 left-8 z-100' color='#79A7D3'/>
                        <Educ3 className='absolute top-6 left-4 z-20' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-sm text-teal-900'>
                        Education
                    </div>        
                </button>               
            </div>
            <div className={categoryFilter=="sports"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2  border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2'}>
                <button className='flex flex-col items-center' onClick={() => handleCategoryChange('sports')}>
                    <div className='relative bg-slate-200 w-full'>
                        <Sports1 className='absolute top-0 left-0' color='#8A307F'/>
                        <Sports2 className='absolute top-2 left-6 z-20' color='#79A7D3'/>
                        <Sports3 className='absolute top-6 left-2 z-30' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-sm text-teal-900'>
                        Sports
                    </div>         
                </button>
            </div>
            <div className={categoryFilter=="wallets"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2  border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2'}>
                <button className='flex flex-col items-center' onClick={() => handleCategoryChange('wallets')}>
                    <div className='relative bg-slate-200 w-full'>
                        <ID1 className='absolute top-0 left-0' color='#8A307F'/>
                        <ID2 className='absolute top-2 left-6 z-20' color='#79A7D3'/>
                        <ID3 className='absolute top-6 left-2 z-30' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-teal-900 text-sm'>
                        ID& Wallets
                    </div>        
                </button>
            </div>
            <div className={categoryFilter=="fashion"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2  border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-2 py-2'}>
                <button className='flex flex-col items-center' onClick={() => handleCategoryChange('fashion')}>
                    <div className='relative bg-slate-200 w-full'>
                        <Fash1 className='absolute top-0 left-2' color='#8A307F'/>
                        <Fash2 className='absolute top-2 left-8 z-20' color='#79A7D3'/>
                        <Fash3 className='absolute top-6 left-4 z-30' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-sm text-teal-900'>
                        Fashion
                    </div>       
                </button>
            </div>  
            <div className={categoryFilter=="others"?'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-5 py-2  border-y-blue-500 border-b-4 shadow-lg bg-gray-200 rounded-md':'flex flex-col flex-shrink-0 md:mx-16 mx-6 px-5 py-2'}>
                <button className='flex flex-col items-center' onClick={() => handleCategoryChange('others')}>
                    <div className='relative bg-slate-200 w-full'>
                        <Others1 className='absolute top-0 left-2' color='#8A307F'/>
                        <Others2 className='absolute top-2 left-8 z-20' color='#79A7D3'/>
                        <Others3 className='absolute top-6 left-4  z-30' color='#6883BC'/>
                    </div>
                    <div className='mt-12 font-bold text-sm text-teal-900'>
                        Others
                    </div>       
                </button>
            </div>
            
        </div>

        {/* Web View Full Card (>1024px*/}
        <div className={webView?'fixed top-20 right-2 w-1/2 z-40  px-2 pt-4 overflow-auto scrollbar-hide mx-auto my-auto shadow-2xl h-5/6 bg-slate-200 ':'hidden'}>
            {fullItem?(
                <div className='flex flex-col justify-between h-full p-4'>
                    <div>
                        <div className='absolute top-0 right-4'>
                            <button onClick={()=>handleViewCancel()}>
                                <Cancel color='#8A307F' size={40}/>
                            </button>
                        </div>
                        <div className='absolute cursor-pointer top-0 left-1 p-2 rounded-full'>
                            {wishIds.includes(fullItem._id)?
                            (
                                <button onClick={()=>handleWish(fullItem._id,"yes")}>
                                        <WishList size={clickedWishAnimation==fullItem._id?`${clickedWishSize}`:'24'} color={clickedWishAnimation==fullItem._id?`${clickedWishColor}`:'red'}/>
                                        <div className={clickedWishAnimation==fullItem._id?'absolute overflow-visible z-50 -top-10 right-0 bg-transparent':'hidden'}>
                                            <svg  width="" height="100">
                                                <circle className="circleOU" cx="15" cy="40" r="4" />
                                                <circle className="circleRU" cx="25" cy="40" r="3" />
                                                <circle className="circleOD" cx="15" cy="80" r="4" />
                                                <circle className="circleRD" cx="25" cy="80" r="3" />

                                                <circle className="circleOL" cx="15" cy="55" r="4" />
                                                <circle className="circleRL" cx="25" cy="65" r="3" />
                                                <circle className="circleOR" cx="15" cy="55" r="4" />
                                                <circle className="circleRR" cx="25" cy="65" r="3" />
                                            </svg>
                                        </div>
                                </button>
                                
                            ):
                            (
                                <button onClick={()=>handleWish(fullItem._id,"no")}>
                                    <WishList color='white'/>
                                </button>
                            )
                            }
                        </div> 
                        <Image
                        className="w-auto h-72 aspect-auto mx-auto my-auto"
                        src={fullItem.images[0]?"/../public/uploads/"+fullItem.images[0]:CartAlt}
                        alt='../public/assets/cart.png'
                        width={400}
                        height={200}
                        />
                    </div>
                    <div className='bg-white rounded-2xl shadow-2xl h-auto flex flex-col w-full py-2'>
                        <div className='text-[#8A307F] font-bold text-lg px-4'>
                            {fullItem.product}
                        </div>
                        <div className='px-4'>
                            {fullItem.specs}
                        </div>
                        <div className='flex flex-row py-2 px-4 item-center'>
                            <div className=''>
                                Place: {fullItem.place}
                            </div>
                        </div>
                        <div className='mt-4 px-4 text-xs'>
                            Uploaded by <span className='underline'>{fullItem.email}</span> on {(fullItem.date).substring(0,10)}
                        </div>
                        <div className='px-4 text-xs'>
                            Contact: {fullItem.contact}
                        </div>
                        {fullItem.email==email?(
                            <div className='py-4 mx-auto px-12 mt-6 bg-slate-200 w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                Uploaded by you
                            </div>
                        ):(
                            <div>
                                {
                                requestSentId.includes(fullItem._id)?(
                                    <div className='py-4 mx-auto px-12 mt-6 bg-slate-200  font-bold w-[4/5] rounded-2xl shadow-2xl text-center'>
                                        Request Sent Already!
                                    </div>
                                ):(
                                    <div className='py-4 mx-auto px-12 mt-6 cursor-pointer bg-[#8A307F] w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                        <button onClick={()=>handleBuyPopUp(fullItem._id,fullItem.product)}>Send A Request Through Mail</button>
                                    </div>
                                )
                                }
                            </div>
                        )}
                    </div>
                </div>
            ):
            (
                <div>
                    Sorry No data present
                </div>
            )}
        </div>

        {/* Mobile View Full Card (<1024 px) */}
        <div className={mobView?'fixed top-12 my-auto z-[100] w-full  m-auto pt-4 overflow-auto scrollbar-hide shadow-xl bg-slate-200 h-5/6':'hidden'}>
            {fullItem?(
                <div className='flex flex-col justify-between h-full'>
                    <div className='px-4 '>
                        <div className='absolute top-0 right-4'>
                            <button onClick={()=>handleViewCancel()}>
                                <Cancel color='#8A307F' size={40}/>
                            </button>
                        </div>
                        <div className='absolute cursor-pointer top-0 left-1 p-2 rounded-full'>
                            {wishIds.includes(fullItem._id)?
                            (
                                <button onClick={()=>handleWish(fullItem._id,"yes")}>
                                    <WishList size={clickedWishAnimation==fullItem._id?`${clickedWishSize}`:'24'} color={clickedWishAnimation==fullItem._id?`${clickedWishColor}`:'red'}/>
                                    <div className={clickedWishAnimation==fullItem._id?'absolute overflow-visible z-50 -top-10 right-0 bg-transparent':'hidden'}>
                                        <svg  width="" height="100">
                                            <circle className="circleOU" cx="15" cy="40" r="4" />
                                            <circle className="circleRU" cx="25" cy="40" r="3" />
                                            <circle className="circleOD" cx="15" cy="80" r="4" />
                                            <circle className="circleRD" cx="25" cy="80" r="3" />

                                            <circle className="circleOL" cx="15" cy="55" r="4" />
                                            <circle className="circleRL" cx="25" cy="65" r="3" />
                                            <circle className="circleOR" cx="15" cy="55" r="4" />
                                            <circle className="circleRR" cx="25" cy="65" r="3" />
                                        </svg>
                                    </div>
                                </button>
                            ):
                            (
                                <button onClick={()=>handleWish(fullItem._id,"no")}>
                                    <WishList color='white'/>
                                </button>
                            )
                            }
                        </div> 
                        <Image
                        className="w-auto h-auto aspect-auto mx-auto my-auto"
                        src={fullItem.images[0]?"/../public/uploads/"+fullItem.images[0]:CartAlt}
                        alt='../public/assets/cart.png'
                        width={400}
                        height={200}
                        />
                    </div>
                    <div className='bg-white rounded-2xl shadow-2xl my-2 h-auto flex flex-col w-full pt-2'>
                        <div className='text-[#8A307F] font-bold text-lg px-4'>
                            {fullItem.product}
                        </div>
                        <div className='px-4'>
                            {fullItem.specs}
                        </div>
                        <div className='flex flex-row py-2 px-4 items-center'>
                            <div className='pl-1'>
                                {fullItem.place}
                            </div>
                        </div>
                        <div className='px-4 mt-2 text-xs'>
                            Uploaded by <span className='underline'>{fullItem.email}</span> on {(fullItem.date).substring(0,10)}
                        </div>
                        <div className='px-4 text-xs'>
                            Contact: {fullItem.contact}
                        </div>
                        {fullItem.email==email?(
                            <div className='py-4 mx-auto px-12 mt-6 bg-slate-200 w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                Uploaded by you
                            </div>
                        ):(
                            <div>
                                {
                                requestSentId.includes(fullItem._id)?(
                                    <div className='py-4 mx-auto px-12 mt-6 bg-slate-200  font-bold w-[4/5] rounded-2xl shadow-2xl text-center'>
                                        Request Sent Already!
                                    </div>
                                ):(
                                    <div className='py-4 mx-auto px-12 mt-6 cursor-pointer bg-[#8A307F] w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                        <button onClick={()=>handleBuyPopUp(fullItem._id,fullItem.product)}>Send A Request Through Mail</button>
                                    </div>
                                )
                                }
                            </div>
                        )}
                    </div>
                </div>
            ):
            (
                <div>
                    Sorry No data present
                </div>
            )}
        </div>
         
        {/* Confirm Buy PopUp */}
        <div className={buyPopUp &&( webView || mobView )?'fixed top-0 left-0 w-full flex items-center justify-center z-[100] bg-white rounded-lg shadow-2xl px-8 py-4':'hidden'}>
            <div className='flex flex-col'>
                <div className=''>
                    Are you sure you want to buy <span className='font-bold text-lg text-[#8A307F]'>{buyProduct}</span>?
                </div>
                <button className='py-3 text-white font-bold bg-green-400 my-6 text-center w-64 rounded-lg shadow-sm cursor-pointer' onClick={()=>buyThis(buyId)}>Yes Send A Request</button>
                <button className='py-3 text-white font-bold bg-red-400 mb-6 text-center w-64 rounded-lg shadow-md cursor-pointer' onClick={()=>dontBuyThis()}>No</button>   
            </div>
        </div>

        {/* Toast message for success */}
        <div id="toast-success" className={successToast?"flex flex-col overflow-hidden justify-between items-center w-full max-w-xs text-gray-500 bg-green-200 rounded-lg shadow dark:text-gray-400 z-[120] dark:bg-gray-800 fixed bottom-1 left-1":"hidden"} role="alert">
            <svg className='absolute top-0' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 6">
                <line x1={x1} y1="0" x2="0" y2="0" stroke="green" strokeWidth="6" />
            </svg>
            <div className='flex flex-row p-4'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ml-3 text-sm font-bold ">{successToastMsg}</div>
                <button onClick={()=>handleCancelToastMsg("success")} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        </div>
        
        {/* Toast Message for warning */}
        <div id="toast-warning" className={warnToast?"flex flex-col overflow-hidden justify-between items-center w-full max-w-xs text-gray-500 bg-red-200 rounded-lg shadow z-[120] dark:text-gray-400 dark:bg-gray-800 fixed bottom-1 left-1":"hidden"} role="alert">
            <svg className='absolute top-0 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 6">
                <line x1={x1} y1="0" x2="200" y2="0" stroke="red" strokeWidth="6" />
            </svg>
            <div className='flex flex-row p-4'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Warning icon</span>
                </div>
                <div className="ml-3 text-sm font-bold ">{warnToastMsg}</div>
                <button onClick={()=>handleCancelToastMsg("warn")} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        </div>

       {/* Title */}
        <div className='lg:mx-16 text-md font-bold bg-[#11d7ac] w-auto h-auto rounded-lg px-2 py-2 shadow-lg text-center text-white '>
            Found? Give Here..  <span className='text-xs font-normal text-black'>All the Lost Items Inside the Campus</span>
        </div>

        {/* cards */}
        <div>
            {
                isLoading?
                (
                    <div className="grid lg:grid-cols-4 lg:gap-16 grid-cols-2 mt-4 gap-5 lg:px-6 lg:w-full w-48">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index}>
                        <ContentLoader
                          speed={0.8}
                          width={200}
                          height={200}
                          viewBox="0 0 300 400"
                          backgroundColor="#f3f3f3"
                          foregroundColor="#ecebeb"
                        
                        >
                          <rect x="0" y="0" rx="5" ry="5" width="300" height="200" />
                          <rect x="0" y="220" rx="3" ry="3" width="200" height="20" />
                          <rect x="0" y="260" rx="3" ry="3" width="200" height="20" />
                          <rect x="220" y="220" rx="3" ry="3" width="140" height="60" />
                        </ContentLoader>
                      </div>
                    ))}
                    </div>
                ):
                (
                    data?(
                        <div className='mt-8 md:px-12'>
                        <div className={width=="1/2"?`grid lg:grid-cols-${cols} lg:w-1/2 w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`:`grid lg:grid-cols-${cols} lg:w-full w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`}>
                            {data.map((item) => (
                            <div className='mb-4 shadow-lg h-auto p-4 w-full relative ' id={item._id}>
                                <div className='flex flex-col bg-white h-full justify-between'>
                                    <div className='my-auto'>
                                        <div className='absolute cursor-pointer top-0 right-1 p-2 rounded-full'>
                                            {wishIds.includes(item._id)?
                                            (
                                                <button onClick={()=>handleWish(item._id,"yes")}>
                                                    <WishList size={clickedWishAnimation==item._id?`${clickedWishSize}`:'24'} color={clickedWishAnimation==item._id?`${clickedWishColor}`:'red'}/>
                                                    <div className={clickedWishAnimation==item._id?'absolute overflow-visible z-50 -top-10 right-0 bg-transparent':'hidden'}>
                                                        <svg  width="" height="100">
                                                            <circle className="circleOU" cx="15" cy="40" r="4" />
                                                            <circle className="circleRU" cx="25" cy="40" r="3" />
                                                            <circle className="circleOD" cx="15" cy="80" r="4" />
                                                            <circle className="circleRD" cx="25" cy="80" r="3" />

                                                            <circle className="circleOL" cx="15" cy="55" r="4" />
                                                            <circle className="circleRL" cx="25" cy="65" r="3" />
                                                            <circle className="circleOR" cx="15" cy="55" r="4" />
                                                            <circle className="circleRR" cx="25" cy="65" r="3" />
                                                        </svg>
                                                    </div>
                                                </button>
                                               
                                            ):
                                            (
                                                <button onClick={()=>handleWish(item._id,"no")}>
                                                    <WishList size='24' color='gray'/>
                                                </button>
                                            )
                                            }
                                        </div>                                        
                                        <Image
                                        className="w-auto h-auto aspect-auto"
                                        src={item.images[0]?"/../public/uploads/"+item.images[0]:CartAlt}
                                        alt='../public/assets/cart.png'
                                        width={800}
                                        height={20}
                                        />
                                    </div>
                                    <div className='flex flex-col pt-2'>
                                        <div className='font-bold text-[#8A307F] font-mono text-lg'>
                                            {item.product}
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <div className='flex md:flex-row flex-col'>
                                                <div className='text-[#79A7D3] font-bold'>
                                                    {item.specs}
                                                </div>
                                            </div>
                                            <div className='bg-[#11d7ac] cursor-pointer py-2 text-white md:text-md font-mono md:px-3 px-2 rounded-md shadow-md'>
                                                <button onClick={()=>handleView(item)}>View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                            ))}
    
                        </div>
                        </div>
                    ):
                    (
                        <div className='w-full h-full mx-auto my-auto'>
                            <Image
                               className='w-auto h-auto m-auto'
                               src={NotFound}
                               width={400}
                               height={400}
                            />
                        </div>
                    )
                )
            }
        </div>

        </div>
        
    );
}