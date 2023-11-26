import Image from 'next/image';
import axios from 'axios';
import Navbar from "@/components/Navbar"
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import React,{ useEffect, useState } from "react";
import CartAlt from '../public/assets/cart.png'
import NotFound from '../public/assets/not-found.png'
import ContentLoader from 'react-content-loader';
import DeleteIcon from 'mdi-react/BinIcon'
import Cancel from 'mdi-react/CancelBoldIcon'



export default function yourUploadFile() {

    const {data:session}=useSession();
    const [isLoading, setLoading] = useState(false);
    const [email,setEmail]=useState("sample@gamil.com")
    const [data1, setData1] = useState(null)
    const [data2, setData2] = useState(null)
    const [successToast,setSuccessToast]=useState(false);
    const [warnToast,setWarnToast]=useState(false);
    const [successToastMsg,setSuccessToastMsg]=useState("");
    const [warnToastMsg,setWarnToastMsg]=useState("");
    const [x1, setX1] = useState(0);
    const [deleteIds,setDeleteIds]=useState([]);
    const [deletePopUp,setDeletePopUp]=useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteProduct,setDeleteProduct]=useState(null);
    const [acceptId,setAcceptId]=useState(null);
    const [acceptEmail,setAcceptEmail]=useState(null);
    const [cancelId,setCancelId]=useState(null);
    const [cancelEmail,setCancelEmail]=useState(null);
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    const [width,setWidth]=useState("full");
    const [cols,setCols]=useState("4");
    const [webView,setWebView]=useState(false);
    const [mobView,setMobView]=useState(false);
    const [fullItem,setFullItem]=useState(null);
    const [acceptPopUp,setAcceptPopUp] = useState(false);
    const [cancelPopUp,setCancelPopUp] = useState(false);
    const [orderType,setOrderType]=useState("recieve");
    const [count, setCount] = useState(0); //count when the accept item is executed
    const [num,setNum]=useState(0);

  useEffect(()=>{
    setLoading(true);  
    if(session)
    {
        setEmail(session.user.email);
    } 

    
    const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setMobView(false);
        setWebView(false);
        setWidth("  full");
        setCols("4");
        setAcceptPopUp(false);
        setCancelPopUp(false);
    };
    async function fetchData() {
        try
        {
            const postData = {
                email: email,
            };

            const [res1, res2] = await Promise.all([
                axios.post('http://localhost:4000/yourUploads',postData),
                axios.post('http://localhost:4000/yourOrders',postData),
            ]);
            
            const data1 = await res1.data;
            const data2 = await res2.data;

            if(data1.length) setData1(data1);
            else setData1(null)

            if(data2.length) setData2(data2);
            else setData2(null)

            data1.map((item=>{
                if(!deleteIds.includes(item._id)) 
                {setDeleteIds(oldArray =>[...oldArray, item._id])}
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
    window.addEventListener('resize', handleResize);

    // Initial call to set the window size
    handleResize();
    fetchData();  

    // Clean up the event listener when the component unmounts
    return () => {
        window.removeEventListener('resize', handleResize);
    };

  },[session,count])

  const handleDeletePopUp=(idValue,product)=>
  {
      setDeletePopUp(!deletePopUp);
      setDeleteId(idValue);
      setDeleteProduct(product);
      setAcceptPopUp(false);
      setCancelPopUp(false);
  }

  const deleteThis=(idValue) =>
  {
      if(session)
      {
          const data = {
              id: idValue
          };
          postData('http://localhost:4000/deleteThis',data)   
          setDeleteId(null);
          setDeleteProduct(null);
          setDeletePopUp(false);        
      }
      else
      {
          setDeleteId(null);
          setDeleteProduct(null);
          setDeletePopUp(false);
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
                setSuccessToast(true);
                setSuccessToastMsg("Deleted Successfully!")
                handleX1();
                setTimeout(() => {
                    setSuccessToastMsg("")
                    setSuccessToast(false);
                }, 4000);
                setDeleteIds(deleteIds.filter(item => item !== deleteId));
              
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

    const dontDeleteThis=()=>
    {
        setDeleteId(null);
        setDeleteProduct(null);
        setDeletePopUp(false);
        setAcceptId(null);
        setCancelId(null);
        setAcceptEmail(null);
        setCancelEmail(null)
        setAcceptPopUp(false);
        setCancelPopUp(false);
    }

    const handleView=(item,num)=>
        {
            setNum(num);
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
        setWidth("full");
        setCols("4");
        setAcceptPopUp(false);
        setCancelPopUp(false);
        setDeletePopUp(false);
        setAcceptId(null);
        setCancelId(null);
        setCancelEmail(null)
        setAcceptEmail(null);
        setDeleteId(null);
        
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

    const accepThis=(idValue,customer)=>
    {
        setAcceptPopUp(true);
        setCancelPopUp(false);
        setAcceptId(idValue);
        setCancelId(null);
        setAcceptEmail(customer);
    }

    const finalAccept=(idValue,customer) =>
    {
        setAcceptPopUp(false);
        setCancelPopUp(false);
        const data = {
            id: idValue,
            accept:customer
        };
        postData('http://localhost:4000/accept',data)   
        async function postData(url,data) {
            try
            {
                  const response =await axios.post(url, data);
                  setCount(count+1);
                  setSuccessToast(true);
                  setSuccessToastMsg("Accepeted Successfully!")
                  handleX1();
                  setTimeout(() => {
                      setSuccessToastMsg("")
                      setSuccessToast(false);
                  }, 4000);
                  
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
        setAcceptId(null);
        setCancelId(null);
        setAcceptEmail(null);
    }


    const cancelOrder=(idValue,customer)=>
    {
        setCancelPopUp(true);
        setAcceptPopUp(false);
        setCancelId(idValue)
        setCancelEmail(customer)
    }

    const finalCancel=(idValue,customer) =>
    {
        setAcceptPopUp(false);
        setCancelPopUp(false);
        const data = {
            id: idValue,
            email:customer
        };
        postData('http://localhost:4000/cancelOrder',data)   
        async function postData(url,data) {
            try
            {
                  const response =await axios.post(url, data);
                  setCount(count+1);
                  setSuccessToast(true);
                  setSuccessToastMsg("Ordered Cancelled!")
                  handleX1();
                  setTimeout(() => {
                      setSuccessToastMsg("")
                      setSuccessToast(false);
                  }, 4000);
                  
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
        setAcceptId(null);
        setCancelId(null);
        setAcceptEmail(null);
        setCancelEmail(null);
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


    const handleRequest=(order)=>
    {
        setOrderType(order);
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
                    (data1 || data2)?(
                        <div className='mt-28 md:px-12'>
                            {/* Title */}
                            <div className='lg:mx-16 text-md bg-[#11d7ac] font-bold w-auto h-auto rounded-lg px-2 py-2 shadow-lg text-center text-white '>
                                Your Uploads And Track Your Orders...... <span className='text-sm text-black'>click delete icon to delete the item</span>
                            </div>
                            <div className="flex flex-row justify-between mt-8 mx-auto lg:w-96 w-72 bg-white border-slate-200 shadow-2xl border-2">
                                <button onClick={()=>handleRequest("recieve")} className={(orderType=="recieve")?'w-full h-auto text-white font-bold bg-[#11d7ac] md:py-4 py-1 md:px-2 px-1 transition-colors duration-1000 ':'w-full font-bold h-auto bg-white md:py-4 py-1 md:px-2 px-1 transition-colors duration-1000 '}>Your Uploads<span className='text-red-600'> {data1.length}</span></button>
                                <button onClick={()=>handleRequest("send")} className={(orderType=="send")?"w-full h-auto text-white font-bold bg-[#11d7ac] md:py-4 py-1 md:px-2 px-2 transition-colors duration-1000 ":"w-full font-bold h-auto md:py-4 py-1 md:px-2 px-2 bg-white transition-colors duration-1000 "}>Orders Placed<span className='text-red-600'> {data2.length}</span></button>
                            </div>
                            <div>
                                {orderType=="recieve"?(
                                    <div>
                                        {data1?(
                                        <div className={width=="1/2"?`grid lg:grid-cols-${cols} lg:w-1/2 w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`:`grid lg:grid-cols-${cols} lg:w-full w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`}>
                                        {data1.map((item) => (
                                             <div className={deleteIds.includes(item._id)?'mb-4 shadow-lg h-auto p-4 w-full relative':'hidden'} id={item._id}>
                                                 <div className='flex flex-col bg-white h-full justify-between'>
                                                     <div className='my-auto'>
                                                         <div className='absolute cursor-pointer top-0 right-1 p-2 rounded-full'>
                                                             <button onClick={()=>handleDeletePopUp(item._id,item._product)}>
                                                                 <DeleteIcon size='28' color='red'/>
                                                             </button>
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
                                                         <div className='font-bold flex justify-between w-full flex-row text-[#8A307F] font-mono text-lg'>
                                                             <div>{item.product}</div>
                                                             <div className='text-black text-md'>{item.type}</div>
                                                         </div>
                                                         <div className='bg-[#11d7ac] cursor-pointer py-2 mx-auto text-white md:text-md my-2 font-mono md:px-6 px-4 rounded-md shadow-md'>
                                                             <button onClick={()=>handleView(item,"1")}>Track This</button>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>  
                                             ))}
                                             </div>
                                        ):
                                        (
                                            <div className='mt-10 text-center w-72 shadow-2xl mx-auto text-black py-2 font-bold bg-slate-200'>NO RECIEVED REQUESTS</div>
                                        )}
                                    </div>
                                ):
                                (
                                    <div>
                                        {data2?(
                                        <div className={width=="1/2"?`grid lg:grid-cols-${cols} lg:w-1/2 w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`:`grid lg:grid-cols-${cols} lg:w-full w-full lg:gap-16 grid-cols-2 lg:px-6 gap-2`}>
                                        {data2.map((item) => (
                                             <div className='mb-4 shadow-lg h-auto p-4 w-full relative' id={item._id}>
                                                 <div className='flex flex-col bg-white h-full justify-between'>
                                                     <div className='my-auto'>                                       
                                                         <Image
                                                         className="w-auto h-auto aspect-auto"
                                                         src={item.images[0]?"/../public/uploads/"+item.images[0]:CartAlt}
                                                         alt='../public/assets/cart.png'
                                                         width={800}
                                                         height={20}
                                                         />
                                                     </div>
                                                     <div className='flex flex-col pt-2'>
                                                         <div className='font-bold flex justify-between w-full flex-row text-[#8A307F] font-mono text-lg'>
                                                             <div>{item.product}</div>
                                                             <div className='text-black text-md'>{item.type}</div>
                                                         </div>
                                                         <div className='bg-[#11d7ac] cursor-pointer py-2 mx-auto text-white md:text-md my-2 font-mono md:px-6 px-2 rounded-md shadow-md'>
                                                             <button onClick={()=>handleView(item,"2")}>Details</button>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>  
                                             ))}
                                             </div>
                                        ):
                                        (
                                            <div className='mt-10 text-center w-72 shadow-2xl mx-auto text-black py-2 font-bold bg-slate-200'>NO ORDERS PLACED</div>
                                        )}
                                    </div>               
                                )}
                            </div>
                           
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
              PLease Login First to track your orders
            </div>
          )
        }

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
                        <Image
                        className="w-auto h-72 aspect-auto mx-auto my-auto"
                        src={fullItem.images[0]?"/../public/uploads/"+fullItem.images[0]:CartAlt}
                        alt='../public/assets/cart.png'
                        width={400}
                        height={200}
                        />
                    </div>
                    <div className='bg-white rounded-sm shadow-2xl h-auto flex flex-col w-full py-2 px-6'>
                        <div className='text-[#8A307F] font-bold text-lg'>
                            {fullItem.product}<span className='text-sm font-sans text-black'>    --{fullItem.type}</span>
                        </div>
                        <div className='font-bold text-[#5a2954] font-mono text-lg'>
                            {fullItem.specs}
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <div>{fullItem.place}</div>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <div className='flex flex-row'>
                                <div className={fullItem.sPrice?'text-[#79A7D3] font-bold':'hidden'}    >
                                    ${fullItem.sPrice}
                                </div>
                                <div className='pl-2 line-through'>
                                    {fullItem.oPrice}
                                </div>
                                <div className={fullItem.isNego?'pl-2':'hidden'}>
                                    IsNegotibale?: {fullItem.isNego}
                                </div>
                                
                            </div>

                        </div>
                        <div className='flex flex-col text-xs'>
                            <div className='text-xs'>
                                <span className='font-bold'>Contact: </span> {fullItem.contact}
                            </div>
                            <div>
                                {fullItem.date}
                            </div>
                        </div>
                        {num==1?(
                            <div>
                                {fullItem.acceptedTo?(
                                    <div className='text-sm text-black mx-auto bg-slate-200 font-bold text-center w-72 py-2'>
                                        Accepted to {fullItem.acceptedTo}
                                    </div>
                                ):(
                                    <div>
                                        {fullItem.type=="sell"?(
                                        <div className='flex flex-col w-full items-center'>
                                            <span className='text-sm mb-2'>These people are ready to buy your product. Negotiate and accept to any one</span>
                                            {fullItem.customers.map((customer)=>(
                                                <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                    <button onClick={()=>accepThis(fullItem._id,customer)}>{customer}</button>
                                                </div>
                                            ))}
                                        </div>
                                    ):(
                                    <div>
                                            {fullItem.type=="lost"?(
                                            <div className='flex flex-col w-full items-center'>
                                                <span className='text-sm mb-2'>Your item is found by below people. please connect to him/her to take it</span>
                                                {fullItem.customers.map((customer)=>(
                                                    <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                        <button onClick={()=>accepThis(fullItem._id,customer)}>Connect to {customer}</button>
                                                    </div>
                                                ))}
                                            </div>
                                            ):(
                                            <div>
                                                <span className='text-sm mb-2'>This item belongs to him/her. Please give it</span>
                                                {fullItem.customers.map((customer)=>(
                                                    <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                        <button onClick={()=>accepThis(fullItem._id,customer)}>Give it to {customer}</button>
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                    </div>
                                    )}
                                    </div>
                                )}
                            </div>
                        ):(
                            <div>
                                {fullItem.acceptedTo==email?(
                                    <div className='bg-slate-200 text-center mx-auto w-72 py-2 text-black text-sm font-bold'>
                                        Your order was accepted by {fullItem.email} 
                                    </div>
                                ):(
                                    <div className='text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl'>
                                        <button onClick={()=>cancelOrder(fullItem._id,email)}>Cancel Order</button>
                                    </div>
                                )}
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
                        <Image
                        className="w-auto h-auto aspect-auto mx-auto my-auto"
                        src={fullItem.images[0]?"/../public/uploads/"+fullItem.images[0]:CartAlt}
                        alt='../public/assets/cart.png'
                        width={400}
                        height={200}
                        />
                    </div>
                    <div className='bg-white rounded-sm shadow-2xl h-auto flex flex-col w-full py-2 px-6'>
                        <div className='text-[#8A307F] font-bold text-lg'>
                            {fullItem.product}<span className='text-sm font-sans text-black'>    --{fullItem.type}</span>
                        </div>
                        <div className='font-bold text-[#5a2954] font-mono text-lg'>
                            {fullItem.specs}
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <div>{fullItem.place}</div>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <div className='flex flex-row'>
                                <div className={fullItem.sPrice?'text-[#79A7D3] font-bold':'hidden'}    >
                                    ${fullItem.sPrice}
                                </div>
                                <div className='pl-2 line-through'>
                                    {fullItem.oPrice}
                                </div>
                                <div className={fullItem.isNego?'pl-2':'hidden'}>
                                    IsNegotibale?: {fullItem.isNego}
                                </div>
                                
                            </div>

                        </div>
                        <div className='flex flex-col text-xs'>
                            <div className='text-xs'>
                                <span className='font-bold'>Contact: </span> {fullItem.contact}
                            </div>
                            <div>
                                {fullItem.date}
                            </div>
                        </div>
                        {num==1?(
                            <div>
                                {fullItem.acceptedTo?(
                                    <div className='text-sm text-black mx-auto bg-slate-200 font-bold text-center w-72 py-2'>
                                        Accepted to {fullItem.acceptedTo}
                                    </div>
                                ):(
                                    <div>
                                        {fullItem.type=="sell"?(
                                        <div className='flex flex-col w-full items-center'>
                                            <span className='text-sm mb-2'>These people are ready to buy your product. Negotiate and accept to any one</span>
                                            {fullItem.customers.map((customer)=>(
                                                <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                    <button onClick={()=>accepThis(fullItem._id,customer)}>{customer}</button>
                                                </div>
                                            ))}
                                        </div>
                                    ):(
                                    <div>
                                            {fullItem.type=="lost"?(
                                            <div className='flex flex-col w-full items-center'>
                                                <span className='text-sm mb-2'>Your item is found by him/her. please connect to him/her to take it</span>
                                                {fullItem.customers.map((customer)=>(
                                                    <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                        <button onClick={()=>accepThis(fullItem._id,customer)}>Connect to {customer}</button>
                                                    </div>
                                                ))}
                                            </div>
                                            ):(
                                            <div>
                                                <span className='text-sm mb-2'>This item belongs to him/her. Please give it</span>
                                                {fullItem.customers.map((customer)=>(
                                                    <div className={customer?'text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl':'hidden'}>
                                                        <button onClick={()=>accepThis(fullItem._id,customer)}>Give it to {customer}</button>
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                    </div>
                                    )}
                                    </div>
                                )}
                            </div>
                        ):(
                            <div>
                                {fullItem.acceptedTo==email?(
                                    <div className='bg-slate-200 text-center mx-auto w-72 py-2 text-black text-sm font-bold'>
                                        Your order was accepted by {fullItem.email} 
                                    </div>
                                ):(
                                    <div className='text-white text-md cursor-pointer text-center w-72 py-2 mb-2 bg-[#11d7ac] shadow-xl'>
                                        <button onClick={()=>cancelOrder(fullItem._id,email)}>Cancel Order</button>
                                    </div>
                                )}
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

        {/* Confirm Delete PopUp */}
        <div className={deletePopUp?'fixed top-0 left-0 w-full flex items-center justify-center z-[100] bg-white rounded-lg shadow-2xl px-8 py-4':'hidden'}>
            <div className='flex flex-col'>
                <div className=''>
                    Are you sure you want to delete <span className='font-bold text-lg text-[#8A307F]'>{deleteProduct}</span>?
                </div>
                <button className='py-3 text-white font-bold bg-green-400 my-6 text-center w-64 rounded-lg shadow-sm cursor-pointer' onClick={()=>deleteThis(deleteId)}>Yes Delete</button>
                <button className='py-3 text-white font-bold bg-red-400 mb-6 text-center w-64 rounded-lg shadow-md cursor-pointer' onClick={()=>dontDeleteThis()}>No</button>   
            </div>
        </div>

         
        {/* Confirm Accept PopUp */}
        <div className={acceptPopUp &&( webView || mobView )?'fixed top-0 left-0 w-full flex items-center justify-center z-[100] bg-white rounded-lg shadow-2xl px-8 py-4':'hidden'}>
            <div className='flex flex-col'>
                <div className=''>
                    Are you sure you want to accept this to {acceptEmail}? 
                </div>
                <button className='py-3 text-white font-bold bg-green-400 my-6 text-center w-64 rounded-lg shadow-sm cursor-pointer' onClick={()=>finalAccept(acceptId,acceptEmail)}>Yes Accept</button>
                <button className='py-3 text-white font-bold bg-red-400 mb-6 text-center w-64 rounded-lg shadow-md cursor-pointer' onClick={()=>dontDeleteThis()}>No</button>   
            </div>
        </div>

         {/* Confirm Cancel PopUp */}
         <div className={cancelPopUp &&( webView || mobView )?'fixed top-0 left-0 w-full flex items-center justify-center z-[100] bg-white rounded-lg shadow-2xl px-8 py-4':'hidden'}>
            <div className='flex flex-col'>
                <div className=''>
                    Are you sure you want to cancel this to order? 
                </div>
                <button className='py-3 text-white font-bold bg-green-400 my-6 text-center w-64 rounded-lg shadow-sm cursor-pointer' onClick={()=>finalCancel(cancelId,cancelEmail)}>Yes Accept</button>
                <button className='py-3 text-white font-bold bg-red-400 mb-6 text-center w-64 rounded-lg shadow-md cursor-pointer' onClick={()=>dontDeleteThis()}>No</button>   
            </div>
        </div>
        

    </div>
  );
}
