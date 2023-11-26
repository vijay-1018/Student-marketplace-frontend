import Navbar from "@/components/Navbar"
import Form1 from "@/components/Form1"
import Form2 from "@/components/Form2"
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import { useState } from "react";

export default function Upload() {

  const {data:session}=useSession();
  const [form,setForm]=useState("form1");

  const handleForms=(form)=>
  {
    setForm(form);
  }
  return (
    <div>
        <Navbar/>
        {
          session?(
            <div>
              <div className="flex flex-row justify-between mt-24 mx-auto lg:w-96 w-72 bg-white border-slate-200 shadow-2xl border-2">
                <button onClick={()=>handleForms("form1")} className={(form=="form1")?'w-full h-auto text-white font-bold bg-[#11d7ac] md:py-4 py-1 md:px-2 px-1 transition-colors duration-1000 ':'w-full font-bold h-auto bg-white md:py-4 py-1 md:px-2 px-1 transition-colors duration-1000 '}>Upload Lost/Found</button>
                <button onClick={()=>handleForms("form2")} className={(form=="form2")?"w-full h-auto text-white font-bold bg-[#11d7ac] md:py-4 py-1 md:px-2 px-2 transition-colors duration-1000 ":"w-full font-bold h-auto md:py-4 py-1 md:px-2 px-2 bg-white transition-colors duration-1000 "}>Sell an Item</button>
              </div>
              <div>
                {form=="form1"?(
                  <Form1/>
                ):
                (
                  <Form2/>
                )}
              </div>
            </div>
          
          ):
          (
            <div className="text-lg mt-24 text-center font-bold bg-slate-50 rounded-lg shadow-xl  px-6 py-2 mx-auto w-80">
              PLease Login First to upload a new item
            </div>
          )
        }
        

    </div>
  );
}
