import Image from 'next/image';
import axios from 'axios';
import Navbar from "@/components/Navbar"
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import React,{ useEffect, useState } from "react";
import CartAlt from '../public/assets/cart.png'
import NotFound from '../public/assets/not-found.png'
import ContentLoader from 'react-content-loader';
import WishList from 'mdi-react/HeartIcon'

export default function WishListFile() {
    const {data:session}=useSession()
    const [data1, setData1] = useState(null)
    const [data2, setData2] = useState(null)
    const [data3, setData3] = useState(null)
    const [isLoading, setLoading] = useState(false);
    const [wishIds, setwishIds] = useState([]);
    const [email,setEmail]=useState("sample@gamil.com")
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

  useEffect(()=>{
    setLoading(true);  
    if(session)
    {
        setEmail(session.user.email);
    } 
  
    async function fetchData() {
        try
        {
            const postData = {
                email: email,
            };
           
            const [res1, res2,res3] = await Promise.all([
                axios.post('http://localhost:4000/getWishList?type=lost',postData),
                axios.post('http://localhost:4000/getWishList?type=found',postData),
                axios.post('http://localhost:4000/getWishList?type=sell',postData)
            ]);
            
            const data1 = await res1.data;
            const data2 = await res2.data;
            const data3= await res3.data;

            if(data1.length) setData1(data1);
            else setData1(null)

            if(data2.length) setData2(data2);
            else setData2(null)

            if(data3.length) setData3(data3);
            else setData3(null)

            
            data1.map((item=>{
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
            ))

            data2.map((item=>{
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
            ))

            data3.map((item=>{
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
            ))

            setLoading(false);
        }
        catch(error)
        {
            setWarnToast(true);
            setWarnToastMsg("Server Issue! Please try after some time."+error)
            handleX1();
            setTimeout(() => {
                setWarnToastMsg("")
                setWarnToast(false);
            }, 4000);
            setLoading(false);
        }
    }


    fetchData(); 

  },[session])

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


  return (
    <div>
        <Navbar/>
        {
          session?(
            <div>
                {isLoading?
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
                    
                    ((data1 || data2) || data3)?
                    (
                        <div className='mt-40 md:px-12'>
                        <div className='text-sm fixed right-0 top-1/2 z-[200] bg-[#11d7ac] rounded-lg shadow-xl text-white text-center w-32 px-2 py-2'>
                            Total Items: <span className='text-lg font-bold text-red-600'>{wishIds.length}</span>
                        </div>

                        {data1?(
                        <div>
                        <div className='text-lg my-1 font-bold'>
                            Lost Items:
                        </div>
                        <div className='grid lg:grid-cols-4 w-full lg:gap-16 grid-cols-1 lg:px-6 gap-2'>
                            {data1.map((item) => (
                            <div className={wishIds.includes(item._id)?'mb-4 shadow-lg h-auto p-4 w-full relative':'hidden'} id={item._id}>
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
                                        <div className='font-bold text-[#5a2954] font-mono text-lg'>
                                            {item.specs}
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            {item.place}
                                        </div>
                                        <div className='flex flex-col text-xs'>
                                            <div>
                                                uploaded by {item.email} on {item.date}
                                            </div>
                                            <div className='text-xs'>
                                                <span className='font-bold'>Contact: </span> {item.contact}
                                            </div>
                                        </div>
                                        {item.email==email?(
                                            <div className='py-4 mx-auto px-12 mt-6 bg-slate-200 w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                Uploaded by you
                                            </div>
                                        ):(
                                            <div>
                                                {
                                                requestSentId.includes(item._id)?(
                                                    <div className='py-4 mx-auto px-12 mt-6 bg-slate-200  font-bold w-[4/5] rounded-2xl shadow-2xl text-center'>
                                                        Request Sent Already!
                                                    </div>
                                                ):(
                                                    <div className='py-4 mx-auto px-12 mt-6 cursor-pointer bg-[#8A307F] w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                        <button onClick={()=>handleBuyPopUp(item._id,item.product)}>Send A Request Through Mail</button>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>  
                            ))}
    
                        </div>   
                        </div>     
                        ):
                        (
                        <div>
                        </div>
                        )}

                        {data2?(
                        <div>
                        <div className='text-lg my-1 font-bold'>
                            Found Items:
                        </div>
                        <div className='grid lg:grid-cols-4 w-full lg:gap-16 grid-cols-1 lg:px-6 gap-2'>
                            {data2.map((item) => (
                            <div className={wishIds.includes(item._id)?'mb-4 shadow-lg h-auto p-4 w-full relative':'hidden'} id={item._id}>
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
                                        <div className='font-bold text-[#5a2954] font-mono text-lg'>
                                            {item.specs}
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            {item.place}
                                        </div>
                                        <div className='flex flex-col text-xs'>
                                            <div>
                                                uploaded by {item.email} on {item.date}
                                            </div>
                                            <div className='text-xs'>
                                                <span className='font-bold'>Contact: </span> {item.contact}
                                            </div>
                                        </div>
                                        {item.email==email?(
                                            <div className='py-4 mx-auto px-12 mt-6 bg-slate-200 w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                Uploaded by you
                                            </div>
                                        ):(
                                            <div>
                                                {
                                                requestSentId.includes(item._id)?(
                                                    <div className='py-4 mx-auto px-12 mt-6 bg-slate-200  font-bold w-[4/5] rounded-2xl shadow-2xl text-center'>
                                                        Request Sent Already!
                                                    </div>
                                                ):(
                                                    <div className='py-4 mx-auto px-12 mt-6 cursor-pointer bg-[#8A307F] w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                        <button onClick={()=>handleBuyPopUp(item._id,item.product)}>Send A Request Through Mail</button>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>  
                            ))}
    
                        </div>   
                        </div>     
                        ):
                        (
                        <div>
                        </div>
                        )}

                        {data3?(
                        <div>
                        <div className='text-lg my-1 font-bold'>
                            Items to be sold:
                        </div>
                        <div className='grid lg:grid-cols-4 w-full lg:gap-16 grid-cols-1 lg:px-6 gap-2'>
                            {data3.map((item) => (
                            <div className={wishIds.includes(item._id)?'mb-4 shadow-lg h-auto p-4 w-full relative':'hidden'} id={item._id}>
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
                                        <div className='font-bold text-[#5a2954] font-mono text-lg'>
                                            {item.specs}
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <div className='flex flex-row '>
                                                <div className='text-[#79A7D3] font-bold'>
                                                    ${item.sPrice}
                                                </div>
                                                <div className='pl-2 line-through'>
                                                    {item.oPrice}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-xs'>
                                            <div>
                                                uploaded by {item.email} on {item.date}
                                            </div>
                                            <div className='text-xs'>
                                                <span className='font-bold'>Contact: </span> {item.contact}
                                            </div>
                                        </div>
                                        {item.email==email?(
                                            <div className='py-4 mx-auto px-12 mt-6 bg-slate-200 w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                Uploaded by you
                                            </div>
                                        ):(
                                            <div>
                                                {
                                                requestSentId.includes(item._id)?(
                                                    <div className='py-4 mx-auto px-12 mt-6 bg-slate-200  font-bold w-[4/5] rounded-2xl shadow-2xl text-center'>
                                                        Request Sent Already!
                                                    </div>
                                                ):(
                                                    <div className='py-4 mx-auto px-12 mt-6 cursor-pointer bg-[#8A307F] w-[4/5] rounded-2xl shadow-lg text-white text-center'>
                                                        <button onClick={()=>handleBuyPopUp(item._id,item.product)}>Send A Request Through Mail</button>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>  
                            ))}
    
                        </div>   
                        </div>     
                        ):
                        (
                        <div>
                        </div>
                        )}
                        </div>
                    ):
                    (
                        <div className='w-full h-full mx-auto mt-60'>
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
          ):
          (
            <div className="text-lg mt-24 text-center font-bold bg-slate-50 rounded-lg shadow-xl  px-6 py-2 mx-auto w-80">
              PLease Login First to upload a new item
            </div>
          )
        }

        
        
    
        {/* Confirm Buy PopUp */}
        <div className={buyPopUp?'fixed top-0 left-0 w-full flex items-center justify-center z-[100] bg-white rounded-lg shadow-2xl px-8 py-4':'hidden'}>
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
        

    </div>
  );
}
