import Navbar from "@/components/Navbar"
import fetch from 'node-fetch';
import { motion } from 'framer-motion';


export default function Home({lost,found,sell}) {
  return (
    <div>
      <Navbar/>
      <div className="lg:mt-12 lg:grid-cols-3 grid-cols-1 grid px-6 lg:gap-6"> 
        <div>
            <div className="lg:mt-20  text-[#FEFFFF] rounded-md shadow-2xl bg-[#3AAFA9] lg:text-xl text-md px-2 py-2 h-15 font-bold w-full text-center">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}     
            >
            All Lost Items
            </motion.div>
            </div>
            <div>
              {lost.slice(0,4).map((item) => (
                <div className="mt-4 text-[#093145] bg-slate-200 text-center w-auto rounded-md shadow-xl font-bold lg:text-lg py-2">
                  <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}     
                  >
                  {item.product}
                  </motion.div>
                </div>  
              ))}
            </div>
        </div>
        <div>
            <div className="lg:mt-20 mt-6  text-[#FEFFFF] rounded-md shadow-2xl bg-[#3AAFA9] lg:text-xl text-md px-2 py-2 lg:h-12 font-bold w-full text-center">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            
            >
            All Found Items
            </motion.div>
            </div>
            <div>
              {found.slice(0,4).map((item) => (
                <div className="mt-4 text-[#093145] bg-slate-200 text-center w-auto rounded-md shadow-xl font-bold lg:text-lg py-2">
                  <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}     
                  >
                  {item.product}
                  </motion.div>
                </div>  
              ))}
            </div>
        </div>
        <div>
            <div className="lg:mt-20 mt-6  text-[#FEFFFF] rounded-md shadow-2xl bg-[#3AAFA9] lg:text-xl text-md px-2 py-2 h-12 font-bold w-full text-center">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            
            >
            Buy these used products
            </motion.div>
            </div>
            <div>
              {sell.slice(0,4).map((item) => (
                <div className="mt-4 text-[#093145] bg-slate-200 text-center w-auto rounded-md shadow-xl font-bold lg:text-lg py-2">
                  <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}     
                  >
                  {item.product}
                  </motion.div>
                </div>  
              ))}
            </div>
        </div>
      </div>
    
      
       
    </div>
    
  )
}

export async function getStaticProps() {
  const [res1, res2,res3] = await Promise.all([
    fetch('http://localhost:4000/getAll?type=lost'),
    fetch('http://localhost:4000/getAll?type=found'),
    fetch('http://localhost:4000/getAll?type=sell')
  ]);

  const lost = await res1.json();
  const found = await res2.json();
  const sell= await res3.json();
  return {
    props: {
      lost,
      found,
      sell
    },
  };
}