import { useState } from 'react';
import {useSession,signIn,signOut,getSession} from 'next-auth/react'

export default function Form1() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [place, setPlace] = useState('');
  const [product, setProduct] = useState('');
  const [specs, setSpecs] = useState('');
  const [category, setCategory] = useState('');
  const [contact,setContact]=useState('');
  const [previewSource, setPreviewSource] = useState("");
  const {data:session}=useSession()
  const [successToast,setSuccessToast]=useState(false);
  const [warnToast,setWarnToast]=useState(false);
  const [successToastMsg,setSuccessToastMsg]=useState("");
  const [warnToastMsg,setWarnToastMsg]=useState("");
  const [x1, setX1] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const imageTypes=["image/jpeg","image/jpg","image/JPG","image/JPEG","image/png","image/PNG"]
    if(file)
    {
      try
      {
        if(event.target.files[0].size>4000000) 
        {
          setWarnToast(true);
          setWarnToastMsg("Image Should be less than 4MB")
          handleX1();
          setTimeout(() => {
              setWarnToastMsg("")
              setWarnToast(false);
          }, 4000);
        }
        else if(!imageTypes.includes(event.target.files[0].type)) 
        {
          setWarnToast(true);
          setWarnToastMsg("Image Should be of type JPG,JPEG,jpg,jpeg,png pr PNG")
          handleX1();
          setTimeout(() => {
              setWarnToastMsg("")
              setWarnToast(false);
          }, 4000);
        }
      }
      catch(error)
      {
        console.log(error);
      }
    }
    else
    {
      setPreviewSource("");
    }
    if(event.target.files[0])
    {
        previewFile(event.target.files[0]);
    }  
    else
    {
        setPreviewSource("");
    } 
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleSpecsChange = (event) => {
    setSpecs(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };


  const handleSubmit =  async (event) => {
    event.preventDefault();
      if ( !place ||!category|| !product || !type || !contact) {
        setWarnToast(true);
        setWarnToastMsg("Please Enter all the mandatory fields")
        handleX1();
        setTimeout(() => {
            setWarnToastMsg("")
            setWarnToast(false);
        }, 4000);
        return;
      }
  
      const formData = new FormData();
     
      formData.append('file', file);
      formData.append('type', type);
      formData.append('product', product);
      formData.append('place', place);
      formData.append('specs', specs);
      formData.append('category',category)
      formData.append('contact',contact)
      formData.append('email', session.user.email);
  
      try {
        const response = await fetch('/api/upload/form1Handle', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setSuccessToast(true);
        setSuccessToastMsg("Uploaded Successfully!...")
        handleX1();
        setTimeout(() => {
            setSuccessToastMsg("")
            setSuccessToast(false);
        }, 4000);

        setPreviewSource("");
        setFile("");
        setProduct("");
        setContact("");
        setCategory("");
        setSpecs("");
        setPlace("");
        setFile("");
      } 

      catch (error) {
        console.error(error);
        setWarnToast(true);
        setWarnToastMsg("Error Occured File Uploading!")
        handleX1();
        setTimeout(() => {
            setWarnToastMsg("")
            setWarnToast(false);
        }, 4000);
      }
    // Handle form submission
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

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


  return (
    <div>
        {/* Form1 */}
        <div className="max-w-md mx-auto my-8 px-2">
          <form onSubmit={handleSubmit}>
          {session?
          (
            <div>
              <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                  Type<span className='text-red-600'>*</span>
              </label>
              <select
                id="isNegotiable"
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="">Select an option</option>
                <option className='font-bold' value="lost">Lost</option>
                <option className='font-bold' value="found">Found</option>
              </select>
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Product Name<span className='text-red-600'>*</span>
                </label>
                <input
                    type="text"
                    id="product"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter the product name"
                    value={product}
                    onChange={handleProductChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Place<span className='text-red-600'>*</span>
                </label>
                <input
                    type="text"
                    id="place"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Where did you lost/find this?"
                    value={place}
                    onChange={handlePlaceChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Description
                </label>
                <input
                    type="text"
                    id="specs"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter the description of the product"
                    value={specs}
                    onChange={handleSpecsChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Category<span className='text-red-500'>*</span>
                </label>
                <select
                  id="isCategory"
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Choose the category</option>
                  <option className='text-md font-bold' value="electronics">Electronics</option>
                  <option className='text-md font-bold' value="education">Study Related</option>
                  <option className='text-md font-bold' value="sports">Sports</option>
                  <option className='text-md font-bold' value="wallets">IDs & Wallets</option>
                  <option className='text-md font-bold' value="fashion">Fashion</option>
                  <option className='text-md font-bold' value="others">Others</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Contact<span className='text-red-600'>*</span>
                </label>
                <input
                    type="text"
                    id="contact"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter the contact details phone/roomNo"
                    value={contact}
                    onChange={handleContactChange}
                />
                </div>
              <div className="mb-4">
              <label htmlFor="file" className="block text-gray-700 font-bold mb-2">
                  Choose a file
              </label>
              <input type="file" className='' id="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {previewSource && (
              <img className='border-2 border-indigo-400' src={previewSource} alt="Preview" style={{ width: "140px" }} />
              )}
              <div className="flex items-center justify-center">
              <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                  Submit
              </button>
            </div>
            </div>
          ):
          (<div>Not Set</div>)}
          </form>
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
